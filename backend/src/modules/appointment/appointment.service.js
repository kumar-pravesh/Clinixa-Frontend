const { pool } = require('../../config/db');
const notificationService = require('../notification/notification.service');

const getDoctors = async () => {
    const result = await pool.query('SELECT * FROM doctors');
    return result.rows;
};

const createAppointment = async (userId, doctorId, date, timeSlot) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get Patient ID
        const patientRes = await client.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        if (patientRes.rows.length === 0) throw new Error('Patient profile not found');
        const patientId = patientRes.rows[0].id;

        // Check availability
        const existing = await client.query(
            'SELECT * FROM appointments WHERE doctor_id = $1 AND date = $2 AND time_slot = $3 AND status != $4',
            [doctorId, date, timeSlot, 'CANCELLED']
        );
        if (existing.rows.length > 0) {
            throw new Error('Slot already booked');
        }

        // Create Appointment
        const result = await client.query(
            `INSERT INTO appointments (patient_id, doctor_id, date, time_slot, status, payment_status)
       VALUES ($1, $2, $3, $4, 'CREATED', 'PENDING') RETURNING *`,
            [patientId, doctorId, date, timeSlot]
        );

        // Fetch user details for notification
        const userRes = await client.query('SELECT name, email FROM users WHERE id = $1', [userId]);
        const user = userRes.rows[0];

        // Fetch Doctor Name
        const docRes = await client.query('SELECT name FROM doctors WHERE id = $1', [doctorId]);
        const doctorName = docRes.rows[0].name;

        await client.query('COMMIT');

        // Trigger Notification (Async - don't block response)
        notificationService.sendBookingConfirmation(user.email, user.name, doctorName, date, timeSlot)
            .catch(err => console.error('Booking Email Failed:', err.message));

        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getAppointments = async (userId) => {
    const result = await pool.query(`
        SELECT a.*, d.name as doctor_name, d.specialization, a.status, a.payment_status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE p.user_id = $1
        ORDER BY a.date DESC, a.time_slot ASC
    `, [userId]);
    return result.rows;
};

module.exports = {
    getDoctors,
    createAppointment,
    getAppointments
};
