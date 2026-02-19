const { pool } = require('../config/db');
const PaymentModel = require('../models/payment.model');
const InvoiceModel = require('../models/invoice.model');
const AppointmentModel = require('../models/appointment.model');
const notificationService = require('./notification.service');
const eventBus = require('../lib/event-bus');

// Providers
const mockProvider = require('./payment/mock.provider');
const razorpayProvider = require('./payment/razorpay.provider'); // Assuming files exist in modules/payment

const getProvider = (providerName) => {
    if (providerName === 'razorpay') return razorpayProvider;
    return mockProvider;
};

const paymentService = {
    async initiatePayment(userId, appointmentId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) throw new Error('Appointment not found');
            if (appointment.user_id != userId) throw new Error('Unauthorized');

            const baseFee = parseFloat(appointment.consultation_fee) || 500;
            const amount = parseFloat((baseFee * 1.18).toFixed(2));

            const providerName = process.env.PAYMENT_PROVIDER || 'mock';
            const provider = getProvider(providerName);

            // Check existing payment
            const existingPayment = await PaymentModel.findExistingInitiated(appointmentId, amount, providerName);

            // Note: Reuse logic omitted for brevity as per original service recommendation 
            // "For now, let's assume if it's INITIATED, we can retry it".
            // Original service didn't strictly return existing payment data, but checked length.
            // I'll create new for simplicity/robustness.

            const uniqueReceipt = `appt_${appointmentId}_${Date.now()}`;
            const { transactionId, payload } = await provider.initiate(
                amount,
                'INR',
                { appointmentId, receipt: uniqueReceipt }
            );

            // Upsert Invoice
            const invoiceId = await InvoiceModel.upsertInvoice({
                appointmentId,
                patientId: appointment.patient_id,
                amount,
                createdBy: userId
            }, connection);

            // Create Payment Record
            const paymentId = await PaymentModel.create({
                invoiceId,
                amount,
                method: providerName,
                transactionId,
                status: 'INITIATED'
            }, connection);

            await connection.commit();

            return {
                paymentId,
                provider: providerName,
                payload: {
                    ...payload,
                    key: providerName === 'razorpay' ? process.env.RAZORPAY_KEY_ID : 'mock_key'
                }
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async confirmPayment(paymentId, verificationData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const payment = await PaymentModel.findById(paymentId);
            if (!payment) throw new Error('Payment not found');

            const provider = getProvider(payment.method);

            // ─── Temporary Debug Logging (remove after confirming fix) ───
            if (payment.method === 'razorpay') {
                const crypto = require('crypto');
                console.log('[PaymentService:DEBUG] razorpay_order_id:', verificationData.razorpay_order_id);
                console.log('[PaymentService:DEBUG] razorpay_payment_id:', verificationData.razorpay_payment_id);
                console.log('[PaymentService:DEBUG] razorpay_signature:', verificationData.razorpay_signature);
                console.log('[PaymentService:DEBUG] payment.transaction_id (order_id from DB):', payment.transaction_id);
                const debugHmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
                debugHmac.update((verificationData.razorpay_order_id || '') + '|' + (verificationData.razorpay_payment_id || ''));
                console.log('[PaymentService:DEBUG] generated_signature:', debugHmac.digest('hex'));
            }
            // ─── End Temporary Debug Logging ─────────────────────────────

            const isValid = await provider.verify(payment.transaction_id, verificationData);

            // ─── Debug: log verification result ─────────────────────────
            if (payment.method === 'razorpay') {
                console.log('[PaymentService:DEBUG] isValid:', isValid);
            }
            // ─────────────────────────────────────────────────────────────

            const status = isValid ? 'SUCCESS' : 'FAILED';

            await PaymentModel.updateStatus(paymentId, status, connection);

            if (isValid) {
                // Store razorpay_payment_id for future refund operations
                if (verificationData.razorpay_payment_id) {
                    await connection.query(
                        'UPDATE payments SET transaction_id = ? WHERE id = ?',
                        [verificationData.razorpay_payment_id, paymentId]
                    );
                    payment.transaction_id = verificationData.razorpay_payment_id;
                }
                // Get appointment ID via invoice
                const invoiceId = payment.invoice_id; // PaymentModel row has invoice_id
                const appointmentId = await InvoiceModel.getAppointmentId(invoiceId, connection);

                if (appointmentId) {
                    await AppointmentModel.updateStatus(appointmentId, 'CONFIRMED', connection);

                    // Notification
                    // Fetch patient email
                    // Need a way to get email from invoice -> patient -> user
                    try {
                        const [rows] = await connection.query(`
                            SELECT u.name, u.email 
                            FROM invoices i
                            JOIN patients p ON i.patient_id = p.id
                            JOIN users u ON p.user_id = u.id
                            WHERE i.id = ?
                        `, [invoiceId]);

                        if (rows.length > 0) {
                            const { name, email } = rows[0];
                            notificationService.sendPaymentSuccess(email, name, payment.amount, payment.transaction_id).catch(console.error);
                        }
                    } catch (e) { console.error('Notification error', e); }
                }
            }

            await connection.commit();

            // ─── Post-Commit Event Emissions (additive) ───────────
            try {
                if (isValid) {
                    // Fetch patient info for event payload
                    const [patientRows] = await pool.query(`
                        SELECT u.name, u.email
                        FROM invoices i
                        JOIN patients p ON i.patient_id = p.id
                        JOIN users u ON p.user_id = u.id
                        WHERE i.id = ?
                    `, [payment.invoice_id]);

                    if (patientRows.length > 0) {
                        eventBus.safeEmit('payment.success', {
                            email: patientRows[0].email,
                            patientName: patientRows[0].name,
                            amount: payment.amount,
                            transactionId: payment.transaction_id,
                            appointmentId: await InvoiceModel.getAppointmentId(payment.invoice_id)
                        });
                    }
                } else {
                    // Attempt to get patient info for failure email too
                    const [patientRows] = await pool.query(`
                        SELECT u.name, u.email
                        FROM invoices i
                        JOIN patients p ON i.patient_id = p.id
                        JOIN users u ON p.user_id = u.id
                        WHERE i.id = ?
                    `, [payment.invoice_id]);

                    if (patientRows.length > 0) {
                        eventBus.safeEmit('payment.failed', {
                            email: patientRows[0].email,
                            patientName: patientRows[0].name,
                            amount: payment.amount,
                            transactionId: payment.transaction_id,
                            reason: 'Payment verification failed'
                        });
                    }
                }
            } catch (eventError) {
                console.error('[PaymentService] Event emission error (non-fatal):', eventError.message);
            }
            // ─── End Post-Commit Events ───────────────────────────

            return { status };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = paymentService;
