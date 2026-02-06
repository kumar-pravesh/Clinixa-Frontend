const { pool } = require('../../config/db');
const mockProvider = require('./mock.provider');
const razorpayProvider = require('./razorpay.provider');

const getProvider = (providerName) => {
    if (providerName === 'razorpay') return razorpayProvider;
    return mockProvider;
};

const initiatePayment = async (userId, appointmentId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const apptRes = await client.query(
            `SELECT a.*, d.fees, p.user_id
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             WHERE a.id = $1`,
            [appointmentId]
        );

        const appointment = apptRes.rows[0];
        if (!appointment) throw new Error('Appointment not found');
        if (appointment.user_id !== userId) throw new Error('Unauthorized');
        if (appointment.payment_status === 'SUCCESS') throw new Error('Already paid');

        const providerName = process.env.PAYMENT_PROVIDER || 'mock';
        const provider = getProvider(providerName);

        const { transactionId, payload } = await provider.initiate(
            appointment.fees,
            'INR',
            { appointmentId }
        );

        const paymentRes = await client.query(
            `INSERT INTO payments (appointment_id, amount, provider, transaction_id, status)
             VALUES ($1, $2, $3, $4, 'INITIATED')
             RETURNING id`,
            [appointmentId, appointment.fees, providerName, transactionId]
        );

        await client.query('COMMIT');

        return {
            paymentId: paymentRes.rows[0].id,
            provider: providerName,
            payload
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const confirmPayment = async (paymentId, verificationData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const paymentRes = await client.query(
            'SELECT * FROM payments WHERE id = $1',
            [paymentId]
        );

        const payment = paymentRes.rows[0];
        if (!payment) throw new Error('Payment not found');

        const provider = getProvider(payment.provider);
        const isValid = await provider.verify(payment.transaction_id, verificationData);

        const status = isValid ? 'SUCCESS' : 'FAILED';

        await client.query(
            'UPDATE payments SET status = $1 WHERE id = $2',
            [status, paymentId]
        );

        await client.query(
            `UPDATE appointments
             SET status = $1, payment_status = $2
             WHERE id = $3`,
            [
                isValid ? 'CONFIRMED' : 'CREATED',
                status,
                payment.appointment_id
            ]
        );

        await client.query('COMMIT');
        return { status };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    initiatePayment,
    confirmPayment
};
