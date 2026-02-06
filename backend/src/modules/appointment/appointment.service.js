const { pool } = require('../../config/db');

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

        // Check availability (Mock: simply check if slot exists for doctor on date)
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

        await client.query('COMMIT');
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
        SELECT a.*, d.name as doctor_name, d.specialization 
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
