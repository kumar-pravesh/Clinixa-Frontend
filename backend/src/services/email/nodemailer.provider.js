const nodemailer = require('nodemailer');
const NotificationProvider = require('../notification.interface');

class EmailProvider extends NotificationProvider {
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async send(recipient, message, subject) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('[EmailProvider] Skipped: No credentials configured');
            return;
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: recipient,
                subject: subject || 'Notification from Clinixa',
                text: message,
                html: `<p>${message.replace(/\n/g, '<br>')}</p>` // Simple HTML conversion
            });
            console.log(`[EmailProvider] Sent email to ${recipient}: ${info.messageId}`);
        } catch (error) {
            console.error('[EmailProvider] Error sending email:', error.message);
        }
    }
}

module.exports = new EmailProvider();
