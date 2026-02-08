const emailProvider = require('./email/nodemailer.provider');
const smsProvider = require('./sms/twilio.provider');
const { pool } = require('../../config/db');

class NotificationService {
    constructor() {
        this.sentReminders = new Set(); // Track sent reminders to avoid spam
        // Scheduler: Check for upcoming appointments every minute
        setInterval(() => this.checkReminders(), 60000);
    }

    async sendBookingConfirmation(email, patientName, doctorName, date, time) {
        const subject = 'Appointment Confirmation - Clinixa';
        const message = `Hello ${patientName},\n\nYour appointment with ${doctorName} on ${date} at ${time} has been successfully booked.\n\nPlease complete the payment to confirm your slot.`;

        console.log(`[Notification] Queuing Booking Email to ${email}`);
        await emailProvider.send(email, message, subject);
    }

    async sendPaymentSuccess(email, patientName, amount, transactionId) {
        const subject = 'Payment Receipt - Clinixa';
        const message = `Hello ${patientName},\n\nWe have received your payment of INR ${amount}.\nTransaction ID: ${transactionId}\n\nYour appointment is now CONFIRMED.`;

        console.log(`[Notification] Queuing Payment Email to ${email}`);
        await emailProvider.send(email, message, subject);
    }

    async sendAppointmentReminder(phone, patientName, time) {
        const message = `Reminder: Hello ${patientName}, you have an appointment at Clinixa today at ${time}. Please arrive 10 mins early.`;

        console.log(`[Notification] Queuing SMS Reminder to ${phone}`);
        await smsProvider.send(phone, message);
    }

    // Mock Scheduler Logic
    async checkReminders() {
        console.log('[Scheduler] Checking for upcoming appointments...');
        try {
            // Find CONFIRMED appointments in the next 2 hours
            // Using Postgres interval logic
            const upcoming = await pool.query(`
                SELECT a.id, a.time_slot, p.phone, u.name 
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE a.status = 'CONFIRMED' 
                AND a.date = CURRENT_DATE
                -- Mock Logic: In reality, compare time_slot to current time
                -- For demo, we just pick all 'CONFIRMED' today to show it works
            `);

            for (const appt of upcoming.rows) {
                if (this.sentReminders.has(appt.id)) continue;

                console.log(`[Scheduler] Found appointment ${appt.id} for ${appt.name} - Sending SMS`);

                await this.sendAppointmentReminder(appt.phone, appt.name, appt.time_slot);
                this.sentReminders.add(appt.id);
            }
        } catch (err) {
            console.error('[Scheduler] Error:', err.message);
        }
    }
}

module.exports = new NotificationService();
