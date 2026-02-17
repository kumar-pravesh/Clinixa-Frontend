const twilio = require('twilio');
const NotificationProvider = require('../notification.interface');

class SMSProvider extends NotificationProvider {
    constructor() {
        super();
        if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        }
    }

    async send(recipient, message) {
        if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log('[SMSProvider] Skipped: No credentials configured');
            return;
        }

        try {
            const result = await this.client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE,
                to: recipient
            });
            console.log(`[SMSProvider] Sent SMS to ${recipient}: ${result.sid}`);
        } catch (error) {
            console.error('[SMSProvider] Error sending SMS:', error.message);
        }
    }
}

module.exports = new SMSProvider();
