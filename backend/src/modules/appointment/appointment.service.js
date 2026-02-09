const { pool } = require('../../config/db');

const getDoctors = async () => {
    const [rows] = await pool.query(`
        SELECT 
            d.id,
            u.name,
            u.email,
            u.phone,
            dep.name as specialization,
            d.consultation_fee,
            u.status
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN departments dep ON d.department_id = dep.id
    `);
    return rows;
};

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

        // Create Admin Notification
        const [patientInfo] = await connection.query('SELECT name FROM users WHERE id = ?', [userId]);
        const patientName = patientInfo[0].name;
        await connection.query(
            "INSERT INTO notifications (type, message, related_id) VALUES (?, ?, ?)",
            ['NEW_APPOINTMENT', `New appointment booked by ${patientName} for ${date} at ${timeSlot}`, appointmentId]
        );

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

module.exports = {
    getDoctors,
    createAppointment,
    getAppointments
};
