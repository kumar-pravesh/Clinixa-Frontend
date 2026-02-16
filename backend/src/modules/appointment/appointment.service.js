const { pool } = require('../../config/db');
const { createAdminNotification } = require('../admin/admin.notification.controller');
const notificationService = require('../notification/notification.service');

const createAppointment = async (userId, doctorId, date, timeSlot) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get Patient ID and Patient Name
        let [patientRes] = await connection.query(
            'SELECT p.id, u.name FROM patients p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?',
            [userId]
        );

        if (patientRes.length === 0) {
            // Auto-create patient profile for non-patient users (like Admin) to allow demo/booking
            const [userRes] = await connection.query('SELECT name, email, phone FROM users WHERE id = ?', [userId]);
            if (userRes.length === 0) throw new Error('User not found');

            const { name, email, phone } = userRes[0];
            const [newPatient] = await connection.query(
                'INSERT INTO patients (user_id, name, email, phone) VALUES (?, ?, ?, ?)',
                [userId, name, email, phone]
            );
            patientRes = [{ id: newPatient.insertId, name }];
        }
        const patientId = patientRes[0].id;
        const patientName = patientRes[0].name;

        // Get Doctor Name and Department
        const [doctorRes] = await connection.query(
            `SELECT u.name as doctor_name, d.specialization as dept 
             FROM doctors d 
             JOIN users u ON d.user_id = u.id 
             WHERE d.id = ?`,
            [doctorId]
        );
        const doctorName = doctorRes[0]?.doctor_name || 'Doctor';
        const dept = doctorRes[0]?.dept || 'General';

        // Check availability
        const [existing] = await connection.query(
            'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != ?',
            [doctorId, date, timeSlot, 'Cancelled']
        );
        if (existing.length > 0) {
            throw new Error('Slot already booked');
        }

        // Create Appointment
        const [result] = await connection.query(
            `INSERT INTO appointments (patient_id, doctor_id, date, time, status)
       VALUES (?, ?, ?, ?, 'CREATED')`,
            [patientId, doctorId, date, timeSlot]
        );

        const appointmentId = result.insertId;

        await connection.commit();

        // Create admin notification
        await createAdminNotification(
            'appointment',
            'New Appointment Booked',
            `${patientName} booked an appointment with ${doctorName} (${dept}) on ${date} at ${timeSlot}`,
            appointmentId,
            'appointments'
        );

        // Send Booking Confirmation to Patient (Non-blocking)
        // We need patient email. The query above only got name and id.
        // Let's optimize: fetch email in the first query.
        const [patientEmailRes] = await connection.query('SELECT email FROM users WHERE id = ?', [userId]);
        const patientEmail = patientEmailRes[0]?.email;

        if (patientEmail) {
            notificationService.sendBookingConfirmation(patientEmail, patientName, doctorName, date, timeSlot).catch(err =>
                console.error('[Appointment] Failed to send booking notification:', err.message)
            );
        }

        // Return constructed object
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
};

const getAppointments = async (userId) => {
    console.log('Fetching appointments for User ID:', userId);
    const [rows] = await pool.query(`
        SELECT 
            a.*,
            u.name as doctor_name,
            dep.name as specialization,
            doc.consultation_fee
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors doc ON a.doctor_id = doc.id
        JOIN users u ON doc.user_id = u.id
        LEFT JOIN departments dep ON doc.department_id = dep.id
        WHERE p.user_id = ?
        ORDER BY a.date DESC, a.time ASC
    `, [userId]);
    console.log('Found appointments:', rows.length);
    return rows;
};

const getAvailability = async (doctorId, date) => {
    // 1. Define standard slots (9 AM to 5 PM, every 30 mins)
    const slots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM"
    ];

    // 2. Fetch booked slots from DB
    const [booked] = await pool.query(
        'SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status != ?',
        [doctorId, date, 'Cancelled']
    );

    const bookedTimes = booked.map(b => b.time);

    // 3. Filter available slots
    return slots.map(slot => ({
        time: slot,
        available: !bookedTimes.includes(slot)
    }));
};

module.exports = {
    createAppointment,
    getAppointments,
    getAvailability
};
