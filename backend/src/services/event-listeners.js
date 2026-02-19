/**
 * Event Listeners — Register domain event handlers for transactional emails.
 * 
 * All listeners are fire-and-forget. Errors are caught and logged.
 * Each listener checks the feature flag before processing.
 */
const eventBus = require('../lib/event-bus');
const emailDispatcher = require('./email/email.dispatcher');
const featureFlags = require('../lib/feature-flags');
const { pool } = require('../config/db');

/**
 * Register all domain event listeners.
 * Called once at application startup.
 */
const registerEventListeners = () => {
    // ─── Payment Success ──────────────────────────────────────
    eventBus.safeOn('payment.success', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, amount, transactionId, appointmentId } = payload;
        if (!email) return;

        // Fetch appointment details for rich email
        let appointmentDetails = {};
        try {
            const [rows] = await pool.query(`
                SELECT 
                    DATE_FORMAT(a.date, '%Y-%m-%d') as date,
                    a.time,
                    u.name as doctorName
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN users u ON d.user_id = u.id
                WHERE a.id = ?
            `, [appointmentId]);
            if (rows.length > 0) appointmentDetails = rows[0];
        } catch (e) {
            console.warn('[EventListener] Could not fetch appointment details:', e.message);
        }

        await emailDispatcher.sendPaymentSuccess(email, patientName, amount, transactionId, appointmentDetails);
    });

    // ─── Payment Failed ───────────────────────────────────────
    eventBus.safeOn('payment.failed', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, amount, transactionId, reason } = payload;
        if (!email) return;

        await emailDispatcher.sendPaymentFailed(email, patientName, amount, transactionId, reason);
    });

    // ─── Appointment Rejected ─────────────────────────────────
    eventBus.safeOn('appointment.rejected', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, doctorName, date, time, reason } = payload;
        if (!email) return;

        await emailDispatcher.sendAppointmentRejected(email, patientName, doctorName, date, time, reason);
    });

    // ─── Appointment Cancelled ────────────────────────────────
    eventBus.safeOn('appointment.cancelled', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, doctorName, date, time } = payload;
        if (!email) return;

        await emailDispatcher.sendCancellationConfirmation(email, patientName, doctorName, date, time);
    });

    // ─── Refund Initiated ─────────────────────────────────────
    eventBus.safeOn('refund.initiated', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, amount, transactionId } = payload;
        if (!email) return;

        await emailDispatcher.sendRefundInitiated(email, patientName, amount, transactionId);
    });

    // ─── Refund Success ───────────────────────────────────────
    eventBus.safeOn('refund.success', async (payload) => {
        if (!featureFlags.ENABLE_TRANSACTIONAL_EMAILS) return;

        const { email, patientName, amount, refundId } = payload;
        if (!email) return;

        await emailDispatcher.sendRefundSuccess(email, patientName, amount, refundId);
    });

    console.log('[EventListeners] All domain event listeners registered');
};

module.exports = { registerEventListeners };
