/**
 * Email HTML Template Factory
 * 
 * All transactional email templates as functions returning HTML strings.
 * User-supplied values are HTML-escaped to prevent injection.
 */

const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const baseWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #2563eb, #1e40af); padding: 28px 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .body { padding: 32px; color: #333333; line-height: 1.6; }
        .body h2 { color: #1e40af; font-size: 20px; margin-top: 0; }
        .info-box { background: #f0f4ff; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 20px 0; border-radius: 0 6px 6px 0; }
        .info-box p { margin: 4px 0; font-size: 14px; }
        .info-box strong { color: #1e40af; }
        .otp-box { text-align: center; margin: 24px 0; }
        .otp-code { display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1e40af; background: #f0f4ff; padding: 16px 32px; border-radius: 8px; border: 2px dashed #2563eb; }
        .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; margin: 16px 0; }
        .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .success { color: #16a34a; }
        .warning { color: #dc2626; }
        .amount { font-size: 24px; font-weight: 700; color: #1e40af; }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="container">
            <div class="header">
                <h1>Clinixa Health</h1>
            </div>
            ${content}
            <div class="footer">
                <p>This is an automated message from Clinixa Health Management System.</p>
                <p>Please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const templates = {
    /**
     * Registration OTP email
     */
    registrationOtp(name, otp) {
        return baseWrapper(`
            <div class="body">
                <h2>Verify Your Email</h2>
                <p>Hello ${escapeHtml(name)},</p>
                <p>Thank you for registering with Clinixa Health. Use the OTP below to complete your registration:</p>
                <div class="otp-box">
                    <div class="otp-code">${escapeHtml(otp)}</div>
                </div>
                <p style="text-align: center; color: #64748b; font-size: 14px;">This code expires in <strong>5 minutes</strong>.</p>
                <p style="color: #64748b; font-size: 13px;">If you did not request this, please ignore this email.</p>
            </div>
        `);
    },

    /**
     * Payment success receipt
     */
    paymentSuccess(patientName, amount, transactionId, appointmentDetails) {
        const details = appointmentDetails || {};
        return baseWrapper(`
            <div class="body">
                <h2 class="success">✓ Payment Successful</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>We have received your payment. Your appointment is now <strong class="success">CONFIRMED</strong>.</p>
                <div class="info-box">
                    <p><strong>Amount Paid:</strong> <span class="amount">₹${escapeHtml(String(amount))}</span></p>
                    <p><strong>Transaction ID:</strong> ${escapeHtml(transactionId)}</p>
                    ${details.doctorName ? `<p><strong>Doctor:</strong> ${escapeHtml(details.doctorName)}</p>` : ''}
                    ${details.date ? `<p><strong>Date:</strong> ${escapeHtml(details.date)}</p>` : ''}
                    ${details.time ? `<p><strong>Time:</strong> ${escapeHtml(details.time)}</p>` : ''}
                </div>
                <p>Please arrive 10 minutes before your scheduled time.</p>
            </div>
        `);
    },

    /**
     * Payment failure notification
     */
    paymentFailed(patientName, amount, transactionId, reason) {
        return baseWrapper(`
            <div class="body">
                <h2 class="warning">✗ Payment Failed</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>Unfortunately, your payment could not be processed.</p>
                <div class="info-box">
                    <p><strong>Amount:</strong> ₹${escapeHtml(String(amount))}</p>
                    <p><strong>Transaction ID:</strong> ${escapeHtml(transactionId)}</p>
                    ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
                </div>
                <p>Please try again or contact our support team for assistance.</p>
            </div>
        `);
    },

    /**
     * Appointment booked confirmation
     */
    appointmentBooked(patientName, doctorName, date, time) {
        return baseWrapper(`
            <div class="body">
                <h2>Appointment Booked</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>Your appointment has been successfully created.</p>
                <div class="info-box">
                    <p><strong>Doctor:</strong> ${escapeHtml(doctorName)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(date)}</p>
                    <p><strong>Time:</strong> ${escapeHtml(time)}</p>
                    <p><strong>Status:</strong> Pending Payment</p>
                </div>
                <p>Please complete the payment to confirm your appointment slot.</p>
            </div>
        `);
    },

    /**
     * Appointment rejected notification
     */
    appointmentRejected(patientName, doctorName, date, time, reason) {
        return baseWrapper(`
            <div class="body">
                <h2 class="warning">Appointment Cancelled</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>We regret to inform you that your appointment has been cancelled by the clinic.</p>
                <div class="info-box">
                    <p><strong>Doctor:</strong> ${escapeHtml(doctorName)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(date)}</p>
                    <p><strong>Time:</strong> ${escapeHtml(time)}</p>
                    ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
                </div>
                <p>Please book a new appointment at your convenience.</p>
            </div>
        `);
    },

    /**
     * 2-hour appointment reminder
     */
    appointmentReminder(patientName, doctorName, date, time) {
        return baseWrapper(`
            <div class="body">
                <h2>⏰ Appointment Reminder</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>This is a reminder that your appointment is in approximately <strong>2 hours</strong>.</p>
                <div class="info-box">
                    <p><strong>Doctor:</strong> ${escapeHtml(doctorName)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(date)}</p>
                    <p><strong>Time:</strong> ${escapeHtml(time)}</p>
                </div>
                <p>Please arrive 10 minutes early. Bring any relevant medical documents.</p>
            </div>
        `);
    },

    /**
     * Forgot password reset link
     */
    passwordResetLink(name, resetUrl) {
        return baseWrapper(`
            <div class="body">
                <h2>Password Reset Request</h2>
                <p>Hello ${escapeHtml(name)},</p>
                <p>We received a request to reset your password. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${escapeHtml(resetUrl)}" class="btn">Reset Password</a>
                </div>
                <p style="color: #64748b; font-size: 13px;">This link expires in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email — your password will remain unchanged.</p>
                <p style="color: #94a3b8; font-size: 12px; word-break: break-all;">If the button doesn't work, copy this link: ${escapeHtml(resetUrl)}</p>
            </div>
        `);
    },

    /**
     * Cancellation confirmation
     */
    cancellationConfirmation(patientName, doctorName, date, time) {
        return baseWrapper(`
            <div class="body">
                <h2>Appointment Cancelled</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>Your appointment has been successfully cancelled.</p>
                <div class="info-box">
                    <p><strong>Doctor:</strong> ${escapeHtml(doctorName)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(date)}</p>
                    <p><strong>Time:</strong> ${escapeHtml(time)}</p>
                </div>
                <p>If a payment was made, a refund will be initiated shortly.</p>
            </div>
        `);
    },

    /**
     * Refund initiated notification
     */
    refundInitiated(patientName, amount, transactionId) {
        return baseWrapper(`
            <div class="body">
                <h2>Refund Initiated</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>A refund has been initiated for your cancelled appointment.</p>
                <div class="info-box">
                    <p><strong>Refund Amount:</strong> <span class="amount">₹${escapeHtml(String(amount))}</span></p>
                    <p><strong>Transaction ID:</strong> ${escapeHtml(transactionId)}</p>
                </div>
                <p>The refund will be credited to your original payment method within 5–7 business days.</p>
            </div>
        `);
    },

    /**
     * Refund success confirmation
     */
    refundSuccess(patientName, amount, refundId) {
        return baseWrapper(`
            <div class="body">
                <h2 class="success">✓ Refund Processed</h2>
                <p>Hello ${escapeHtml(patientName)},</p>
                <p>Your refund has been successfully processed.</p>
                <div class="info-box">
                    <p><strong>Refund Amount:</strong> <span class="amount">₹${escapeHtml(String(amount))}</span></p>
                    <p><strong>Refund Reference:</strong> ${escapeHtml(refundId)}</p>
                </div>
                <p>The amount will reflect in your account shortly.</p>
            </div>
        `);
    }
};

module.exports = templates;
