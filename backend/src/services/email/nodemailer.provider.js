const nodemailer = require('nodemailer');
const NotificationProvider = require('../notification.interface');

class EmailProvider extends NotificationProvider {
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_SENDER_EMAIL,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN
            }
        });
    }

    async send(recipient, message, subject) {
        if (!process.env.GMAIL_SENDER_EMAIL || !process.env.GMAIL_CLIENT_ID ||
            !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
            console.log('[EmailProvider] Skipped: Gmail OAuth2 credentials not configured');
            return;
        }

        // Re-create transporter to ensure fresh environment variables are used
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_SENDER_EMAIL,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN
            }
        });

        try {
            const info = await transporter.sendMail({
                from: process.env.GMAIL_SENDER_EMAIL,
                to: recipient,
                subject: subject || 'Notification from Clinixa',
                text: message,
                html: `<p>${message.replace(/\n/g, '<br>')}</p>`
            });
        } catch (error) {
            console.error('[EmailProvider] FAILED to send email:', error.message);
        }
    }
}

module.exports = new EmailProvider();
