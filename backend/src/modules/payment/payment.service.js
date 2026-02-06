const { pool } = require('../../config/db');
const mockProvider = require('./mock.provider');
// const razorpayProvider = require('./razorpay.provider');

// Factory to select provider
const getProvider = (providerName) => {
    // For now, only Mock is active
    return mockProvider;
};

const initiatePayment = async (userId, appointmentId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Validate Appointment
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
        if (appointment.payment_status === 'SUCCESS') throw new Error('Appointment already paid');

        // 2. Initiate with Provider
        const provider = getProvider('mock');
        const { transactionId } = await provider.initiate(appointment.fees, 'INR', { appointmentId });

        // 3. Create Payment Record
        const paymentRes = await client.query(
            `INSERT INTO payments (appointment_id, amount, provider, transaction_id, status)
             VALUES ($1, $2, 'mock', $3, 'INITIATED') RETURNING id`,
            [appointmentId, appointment.fees, transactionId]
        );

        await client.query('COMMIT');

        return {
            paymentId: paymentRes.rows[0].id,
            transactionId,
            amount: appointment.fees
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const confirmPayment = async (paymentId, status) => { // status: SUCCESS or FAILED
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const paymentRes = await client.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
        const payment = paymentRes.rows[0];
        if (!payment) throw new Error('Payment not found');

        // Verify with provider (Mock logic: we trust the status passed for now, or assume provider mock verifies it)
        const provider = getProvider(payment.provider);
        const isValid = await provider.verify(payment.transaction_id, status);

        const newStatus = isValid ? 'SUCCESS' : 'FAILED';

        // Update Payment
        await client.query('UPDATE payments SET status = $1 WHERE id = $2', [newStatus, paymentId]);

        // If Success, Update Appointment
        if (isValid) {
            await client.query(
                `UPDATE appointments 
                 SET status = 'CONFIRMED', payment_status = 'SUCCESS' 
                 WHERE id = $1`,
                [payment.appointment_id]
            );
        } else {
            await client.query(
                `UPDATE appointments 
                 SET payment_status = 'FAILED' 
                 WHERE id = $1`,
                [payment.appointment_id]
            );
        }

        await client.query('COMMIT');
        return { status: newStatus };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    initiatePayment,
    confirmPayment
};
