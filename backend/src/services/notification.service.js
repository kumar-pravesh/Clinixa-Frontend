const emailProvider = require('./email/nodemailer.provider');
const smsProvider = require('./sms/twilio.provider');
const { pool } = require('../config/db');
const NotificationModel = require('../models/notification.model');

class NotificationService {
    constructor() {
        this.sentReminders = new Set();
        setInterval(() => this.checkReminders(), 60000);
    }

    async createNotification(userId, data) {
        try {
            return await NotificationModel.create({
                userId,
                type: data.type,
                title: data.title,
                message: data.message,
                link: data.link
            });
        } catch (error) {
            console.error('[NotificationService] Error creating notification:', error.message);
        }
    }

    async getNotifications(userId) {
        return await NotificationModel.findByUserId(userId);
    }

    async markAsRead(id, userId) {
        return await NotificationModel.markAsRead(id, userId);
    }

    async markAllAsRead(userId) {
        return await NotificationModel.markAllAsRead(userId);
    }

    // Existing methods...
    async sendBookingConfirmation(email, patientName, doctorName, date, time) {
        const subject = 'Appointment Confirmation - Clinixa';
        const message = `Hello ${patientName},\n\nYour appointment with ${doctorName} on ${date} at ${time} has been successfully booked.\n\nPlease complete the payment to confirm your slot.`;
        await emailProvider.send(email, message, subject);
    }

    async sendPaymentSuccess(email, patientName, amount, transactionId) {
        const subject = 'Payment Receipt - Clinixa';
        const message = `Hello ${patientName},\n\nWe have received your payment of INR ${amount}.\nTransaction ID: ${transactionId}\n\nYour appointment is now CONFIRMED.`;
        await emailProvider.send(email, message, subject);
    }

    async sendAppointmentReminder(phone, patientName, time) {
        const message = `Reminder: Hello ${patientName}, you have an appointment at Clinixa today at ${time}. Please arrive 10 mins early.`;
        await smsProvider.send(phone, message);
    }

    async sendWelcomeNotification(email, name, phone) {
        const subject = 'Welcome to Clinixa Health';
        const message = `Hello ${name},\n\nWelcome to Clinixa! Your account has been successfully created.\n\nYou can now book appointments and view your medical history.`;
        await emailProvider.send(email, message, subject);
        if (phone) {
            const smsMessage = `Welcome to Clinixa, ${name}! Your account is ready.`;
            await smsProvider.send(phone, smsMessage);
        }
    }

    async sendOTP(email, otp) {
        const subject = 'Clinixa - Password Reset OTP';
        const message = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
        await emailProvider.send(email, message, subject);
    }

    async getPollNotifications(role, userId) {
        // Fetch persistent notifications first
        const dbNotifications = await NotificationModel.findByUserId(userId);

        // Convert DB format to expected frontend format if necessary
        const notifications = dbNotifications.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            timestamp: n.created_at,
            read: !!n.is_read,
            link: n.link
        }));

        // Add summary notifications (on-the-fly)
        if (role === 'doctor') {
            const [appointments] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM appointments 
                WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = ?)
                AND date = CURDATE()
                AND status = 'Confirmed'
            `, [userId]);

            if (appointments[0].count > 0) {
                notifications.push({
                    id: 'summary-1',
                    type: 'appointment',
                    title: 'Today\'s Schedule',
                    message: `You have ${appointments[0].count} appointment(s) today`,
                    timestamp: new Date(),
                    read: false
                });
            }
        }

        // ... (other roles)
        return notifications;
    }

    async checkReminders() {
        try {
            const [upcoming] = await pool.query(`
                SELECT a.id, a.time, p.phone, u.name 
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE a.status = 'Confirmed' 
                AND a.date = CURRENT_DATE
            `);

            for (const appt of upcoming) {
                if (this.sentReminders.has(appt.id)) continue;
                await this.sendAppointmentReminder(appt.phone, appt.name, appt.time);
                this.sentReminders.add(appt.id);
            }
        } catch (err) { }
    }
}

module.exports = new NotificationService();

module.exports = new NotificationService();
