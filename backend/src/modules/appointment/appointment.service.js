const { pool } = require('../../config/db');

const createAppointment = async (userId, doctorId, date, timeSlot) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get Patient ID
        const [patientRes] = await connection.query('SELECT id FROM patients WHERE user_id = ?', [userId]);
        if (patientRes.length === 0) throw new Error('Patient profile not found');
        const patientId = patientRes[0].id;

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
       VALUES (?, ?, ?, ?, 'Scheduled')`,
            [patientId, doctorId, date, timeSlot]
        );

        const appointmentId = result.insertId;

        await connection.commit();

        // Return constructed object
        return {
            id: appointmentId,
            patient_id: patientId,
            doctor_id: doctorId,
            date,
            time: timeSlot,
            status: 'Scheduled'
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
