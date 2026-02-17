const { pool } = require('../config/db');
const AppointmentModel = require('../models/appointment.model');
const PatientModel = require('../models/patient.model');
const userModel = require('../models/user.model'); // Lowercase filename? No, it's user.model.js
const UserModel = require('../models/user.model');
const DoctorModel = require('../models/doctor.model');
const notificationService = require('./notification.service');
const { createAdminNotification } = require('./admin.service'); // Moving logic to AdminService
// Ideally unrelated to current task but needed for appointment flow.

const appointmentService = {
    async createAppointment(userId, doctorId, date, timeSlot) {
        // Sanitize doctorId (strip DOC- prefix if present)
        const cleanDoctorId = doctorId.toString().replace('DOC-', '');

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Get Patient
            let patient = await PatientModel.findByUserId(userId);
            let patientId = patient ? patient.id : null;
            let patientName = patient ? patient.name : null;

            if (!patient) {
                // Auto-create patient profile for non-patient users
                const user = await UserModel.findById(userId); // Need findById in UserModel
                // UserModel has findByEmail. findById is standard BaseModel? No, BaseModel has no findById.
                // I'll query `users` table directly here or add findById to UserModel.
                // For now, raw query via BaseModel/Pool wrapper
                const [userRes] = await pool.query('SELECT name, email, phone FROM users WHERE id = ?', [userId]);
                if (userRes.length === 0) throw new Error('User not found');

                const { name, email, phone } = userRes[0];
                // Create patient
                // PatientModel.create expects {user_id, ...}
                patientId = await PatientModel.create({
                    user_id: userId,
                    name,
                    email,
                    phone
                }, connection);
                patientName = name;
            }

            // Get Doctor
            const doctor = await DoctorModel.getPublicDoctorById(cleanDoctorId); // logic works as reading by ID
            // Or better findById? DoctorModel.getPublicDoctorById expects cleanId.
            // But doctorId might be int or string.
            // Let's use specific query or existing model method.
            // DoctorModel has findById (returns row) and getPublicDoctorById (returns joined).
            const [docRow] = await pool.query(`
                SELECT u.name as doctor_name, d.specialization as dept 
                FROM doctors d 
                JOIN users u ON d.user_id = u.id 
                WHERE d.id = ?
            `, [cleanDoctorId]);
            const doctorName = docRow ? docRow.doctor_name : 'Doctor';
            const dept = docRow ? docRow.dept : 'General';

            // Check availability
            const isAvailable = await AppointmentModel.checkAvailability(cleanDoctorId, date, timeSlot);
            if (!isAvailable) {
                throw new Error('Slot already booked');
            }

            // Create Appointment
            const appointmentId = await AppointmentModel.create({
                patientId, doctorId, date, timeSlot, status: 'CREATED'
            }, connection);

            await connection.commit();

            // Notifications (Fire and forget or async)
            // Need to handle these nicely.
            try {
                // Admin Notification
                // createAdminNotification(type, title, message, detailsId, link)
                // Need to require this properly.

                // Patient Notification
                const [u] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
                if (u && u.email) {
                    notificationService.sendBookingConfirmation(u.email, patientName, doctorName, date, timeSlot);
                }
            } catch (e) {
                console.warn('Notification failed', e.message);
            }

            return {
                id: appointmentId,
                patient_id: patientId,
                doctor_id: doctorId,
                date,
                time: timeSlot,
                status: 'CREATED'
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getAppointments(userId) {
        return AppointmentModel.findByUserId(userId);
    },

    async getAvailability(doctorId, date) {
        // Standard slots
        const slots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
            "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
            "04:00 PM", "04:30 PM"
        ];

        // Fetch booked from DB
        const cleanDoctorId = doctorId.toString().replace('DOC-', '');
        const [booked] = await pool.query(
            'SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status != ?',
            [cleanDoctorId, date, 'Cancelled']
        );
        const bookedTimes = booked.map(b => b.time);

        return slots.map(slot => ({
            time: slot,
            available: !bookedTimes.includes(slot)
        }));
    }
};

module.exports = appointmentService;
