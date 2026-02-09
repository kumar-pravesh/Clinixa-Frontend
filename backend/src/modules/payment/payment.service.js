const { pool } = require('../../config/db');
const mockProvider = require('./mock.provider');
const razorpayProvider = require('./razorpay.provider');

const getProvider = (providerName) => {
    if (providerName === 'razorpay') return razorpayProvider;
    return mockProvider;
};

const initiatePayment = async (userId, appointmentId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [apptRes] = await connection.query(
            `SELECT a.*, d.consultation_fee, p.user_id
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             WHERE a.id = ?`,
            [appointmentId]
        );

        const appointment = apptRes[0];
        if (!appointment) throw new Error('Appointment not found');
        if (appointment.user_id !== userId) throw new Error('Unauthorized');

        // Ensure consultation_fee is valid
        const amount = parseFloat(appointment.consultation_fee) || 500;

        const providerName = process.env.PAYMENT_PROVIDER || 'mock';
        const provider = getProvider(providerName);

        const { transactionId, payload } = await provider.initiate(
            amount,
            'INR',
            { appointmentId }
        );

        // Create Invoice first (New Schema)
        const [invRes] = await connection.query(
            `INSERT INTO invoices (appointment_id, patient_id, amount, issued_date)
              VALUES (?, ?, ?, NOW())`,
            [appointmentId, appointment.patient_id, amount]
        );
        const invoiceId = invRes.insertId;

        const [paymentRes] = await connection.query(
            `INSERT INTO payments (invoice_id, amount, method, transaction_id, status)
             VALUES (?, ?, ?, ?, 'INITIATED')`,
            [invoiceId, amount, providerName, transactionId]
        );

        await connection.commit();

        return {
            paymentId: paymentRes.insertId,
            provider: providerName,
            payload
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

const confirmPayment = async (paymentId, verificationData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [paymentRes] = await connection.query(
            'SELECT * FROM payments WHERE id = ?',
            [paymentId]
        );

        const payment = paymentRes[0];
        if (!payment) throw new Error('Payment not found');

        const provider = getProvider(payment.method);
        const isValid = await provider.verify(payment.transaction_id, verificationData);

        const status = isValid ? 'SUCCESS' : 'FAILED';

        await connection.query(
            'UPDATE payments SET status = ? WHERE id = ?',
            [status, paymentId]
        );

        // Update appointment status if successful
        if (isValid) {
            // Get appointment ID via invoice
            const [invRes] = await connection.query('SELECT appointment_id FROM invoices WHERE id = ?', [payment.invoice_id]);
            if (invRes.length > 0) {
                await connection.query(
                    'UPDATE appointments SET status = ? WHERE id = ?',
                    ['Confirmed', invRes[0].appointment_id]
                );
            }
        }

        await connection.commit();
        return { status };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    initiatePayment,
    confirmPayment
};
