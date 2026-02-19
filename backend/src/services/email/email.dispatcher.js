/**
 * Email Dispatcher — High-level email dispatch with templates, retry, and deduplication.
 * 
 * Uses the existing nodemailer.provider.js for actual sending.
 * Adds retry logic, rate limiting, and idempotency.
 */
const emailProvider = require('./nodemailer.provider');
const templates = require('./templates');
const featureFlags = require('../../lib/feature-flags');

// Deduplication: TTL set of processed keys (10-minute window)
const sentEmails = new Map(); // key -> timestamp
const DEDUP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Per-email send rate: max sends per email per hour
const emailSendCounts = new Map(); // email -> { count, windowStart }
const MAX_EMAILS_PER_ADDRESS_PER_HOUR = 10;
const HOUR_MS = 60 * 60 * 1000;

// Global send rate: token bucket
let globalTokens = 100;
const GLOBAL_MAX_TOKENS = 100;
const GLOBAL_REFILL_RATE = 2; // tokens per second

// Refill global tokens periodically
const _refillInterval = setInterval(() => {
    globalTokens = Math.min(GLOBAL_MAX_TOKENS, globalTokens + GLOBAL_REFILL_RATE);
}, 1000);
if (_refillInterval.unref) _refillInterval.unref();

// Cleanup dedup map periodically
const _cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, ts] of sentEmails.entries()) {
        if (now - ts > DEDUP_TTL_MS) sentEmails.delete(key);
    }
    for (const [email, record] of emailSendCounts.entries()) {
        if (now - record.windowStart > HOUR_MS) emailSendCounts.delete(email);
    }
}, 60 * 1000);
if (_cleanupInterval.unref) _cleanupInterval.unref();

/**
 * Check per-email rate limit
 */
const checkEmailRateLimit = (recipientEmail) => {
    const now = Date.now();
    let record = emailSendCounts.get(recipientEmail);
    if (!record || now - record.windowStart > HOUR_MS) {
        record = { count: 0, windowStart: now };
        emailSendCounts.set(recipientEmail, record);
    }
    record.count++;
    return record.count <= MAX_EMAILS_PER_ADDRESS_PER_HOUR;
};

/**
 * Send an email with retry logic.
 * @param {string} recipient 
 * @param {string} subject 
 * @param {string} html - HTML content
 * @param {object} options - { dedupKey, maxRetries }
 */
const sendEmail = async (recipient, subject, html, options = {}) => {
    const { dedupKey = null, maxRetries = 3, skipFeatureFlag = false } = options;

    // Feature flag check (skipped for auth-critical emails like OTP and password reset)
    if (!skipFeatureFlag && !featureFlags.ENABLE_TRANSACTIONAL_EMAILS) {
        console.log('[EmailDispatcher] Transactional emails disabled via feature flag');
        return;
    }

    // Deduplication
    if (dedupKey && sentEmails.has(dedupKey)) {
        console.log(`[EmailDispatcher] Skipped duplicate: ${dedupKey}`);
        return;
    }

    // Per-email rate limit
    if (!checkEmailRateLimit(recipient)) {
        console.warn(`[EmailDispatcher] Rate limit exceeded for ${recipient.substring(0, 3)}***`);
        return;
    }

    // Global rate limit
    if (globalTokens <= 0) {
        console.warn('[EmailDispatcher] Global send rate limit reached');
        return;
    }
    globalTokens--;

    // Retry loop
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!process.env.GMAIL_SENDER_EMAIL || !process.env.GMAIL_CLIENT_ID ||
                !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
                console.log('[EmailDispatcher] Skipped: Gmail OAuth2 credentials not configured');
                return;
            }

            await emailProvider.transporter.sendMail({
                from: process.env.GMAIL_SENDER_EMAIL,
                to: recipient,
                subject: subject,
                html: html
            });

            // Mark as sent for dedup
            if (dedupKey) sentEmails.set(dedupKey, Date.now());

            const maskedEmail = recipient.substring(0, 3) + '***@' + recipient.split('@')[1];
            console.log(`[EmailDispatcher] Sent "${subject}" to ${maskedEmail}`);
            return;
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                const delayMs = Math.pow(4, attempt - 1) * 1000; // 1s, 4s, 16s
                console.warn(`[EmailDispatcher] Attempt ${attempt} failed for "${subject}", retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    console.error(`[EmailDispatcher] All ${maxRetries} attempts failed for "${subject}" to ${recipient.substring(0, 3)}***: ${lastError?.message}`);
};

/**
 * High-level dispatch methods using templates
 */
const emailDispatcher = {
    async sendRegistrationOtp(email, name, otp) {
        const html = templates.registrationOtp(name, otp);
        await sendEmail(email, 'Verify Your Email — Clinixa', html, { maxRetries: 2, skipFeatureFlag: true });
    },

    async sendPaymentSuccess(email, patientName, amount, transactionId, appointmentDetails) {
        const html = templates.paymentSuccess(patientName, amount, transactionId, appointmentDetails);
        await sendEmail(email, 'Payment Receipt — Clinixa', html, {
            dedupKey: `payment_success_${transactionId}`,
            maxRetries: 3
        });
    },

    async sendPaymentFailed(email, patientName, amount, transactionId, reason) {
        const html = templates.paymentFailed(patientName, amount, transactionId, reason);
        await sendEmail(email, 'Payment Failed — Clinixa', html, {
            dedupKey: `payment_failed_${transactionId}`,
            maxRetries: 2
        });
    },

    async sendAppointmentBooked(email, patientName, doctorName, date, time) {
        const html = templates.appointmentBooked(patientName, doctorName, date, time);
        await sendEmail(email, 'Appointment Booked — Clinixa', html, { maxRetries: 2 });
    },

    async sendAppointmentRejected(email, patientName, doctorName, date, time, reason) {
        const html = templates.appointmentRejected(patientName, doctorName, date, time, reason);
        await sendEmail(email, 'Appointment Cancelled — Clinixa', html, { maxRetries: 2 });
    },

    async sendAppointmentReminder(email, patientName, doctorName, date, time, appointmentId) {
        const html = templates.appointmentReminder(patientName, doctorName, date, time);
        await sendEmail(email, 'Appointment Reminder — Clinixa', html, {
            dedupKey: `reminder_2hr_${appointmentId}`,
            maxRetries: 2
        });
    },

    async sendPasswordResetLink(email, name, resetUrl) {
        const html = templates.passwordResetLink(name, resetUrl);
        await sendEmail(email, 'Password Reset — Clinixa', html, { maxRetries: 2, skipFeatureFlag: true });
    },

    async sendCancellationConfirmation(email, patientName, doctorName, date, time) {
        const html = templates.cancellationConfirmation(patientName, doctorName, date, time);
        await sendEmail(email, 'Appointment Cancelled — Clinixa', html, { maxRetries: 2 });
    },

    async sendRefundInitiated(email, patientName, amount, transactionId) {
        const html = templates.refundInitiated(patientName, amount, transactionId);
        await sendEmail(email, 'Refund Initiated — Clinixa', html, {
            dedupKey: `refund_initiated_${transactionId}`,
            maxRetries: 2
        });
    },

    async sendRefundSuccess(email, patientName, amount, refundId) {
        const html = templates.refundSuccess(patientName, amount, refundId);
        await sendEmail(email, 'Refund Processed — Clinixa', html, {
            dedupKey: `refund_success_${refundId}`,
            maxRetries: 2
        });
    }
};

module.exports = emailDispatcher;
