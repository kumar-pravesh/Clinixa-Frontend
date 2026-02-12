const { pool } = require('../../config/db');
const mockProvider = require('./mock.provider');
const razorpayProvider = require('./razorpay.provider');
const notificationService = require('../notification/notification.service');

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

        // Ensure consultation_fee is valid and add 18% tax (aligned with AppointmentReview.jsx)
        const baseFee = parseFloat(appointment.consultation_fee) || 500;
        const amount = parseFloat((baseFee * 1.18).toFixed(2)); // Ensure consistent precision

        const providerName = process.env.PAYMENT_PROVIDER || 'mock';
        const provider = getProvider(providerName);

        // CHECK IF AN INITIATED PAYMENT ALREADY EXISTS FOR THIS APPOINTMENT & AMOUNT
        const [existingPayment] = await connection.query(
            `SELECT p.*, inv.amount as inv_amount 
             FROM payments p 
             JOIN invoices inv ON p.invoice_id = inv.id 
             WHERE inv.appointment_id = ? AND p.status = 'INITIATED' AND inv.amount = ? AND p.method = ?
             ORDER BY p.id DESC LIMIT 1`,
            [appointmentId, amount, providerName]
        );

        if (existingPayment.length > 0) {
            await connection.commit();
            // We need to re-generate the payload if it's Razorpay (or just reuse if possible)
            // For simplicity and safety, if it's Razorpay, we might want to check if the order is still valid.
            // But usually just returning the same data is fine if the order exists.

            // TO BE SAFE: In a real app, you'd verify the order status with Razorpay here.
            // For now, let's assume if it's INITIATED, we can retry it OR we just create a new one with a unique receipt.
        }

        const uniqueReceipt = `appt_${appointmentId}_${Date.now()}`;
        const { transactionId, payload } = await provider.initiate(
            amount,
            'INR',
            { appointmentId, receipt: uniqueReceipt }
        );

        // Create or Update Invoice (Handle Retries)
        const [invRes] = await connection.query(
            `INSERT INTO invoices (appointment_id, patient_id, amount, issued_date)
              VALUES (?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE amount = VALUES(amount), issued_date = NOW()`,
            [appointmentId, appointment.patient_id, amount]
        );

        // If it was an update, we need to find the invoice ID
        let invoiceId = invRes.insertId;
        if (invoiceId === 0) {
            const [existingInv] = await connection.query('SELECT id FROM invoices WHERE appointment_id = ?', [appointmentId]);
            invoiceId = existingInv[0].id;
        }

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
                    ['CONFIRMED', invRes[0].appointment_id]
                );

                // Fetch patient details for notification
                const [patientRes] = await connection.query(
                    `SELECT u.name, u.email 
                     FROM patients p 
                     JOIN users u ON p.user_id = u.id 
                     WHERE p.id = (SELECT patient_id FROM invoices WHERE id = ?)`,
                    [payment.invoice_id]
                );

                if (patientRes.length > 0) {
                    const { name, email } = patientRes[0];
                    notificationService.sendPaymentSuccess(email, name, payment.amount, payment.transaction_id).catch(err =>
                        console.error('[Payment] Failed to send payment notification:', err.message)
                    );
                }
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
