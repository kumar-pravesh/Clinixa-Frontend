const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');

const createDoctor = async (doctorData) => {
    const { name, email, phone, password, dept, experience, status } = doctorData;

    // Default password if not provided (Admin sets credentials)
    const finalPassword = password || 'Doctor@123';

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check if user exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw new Error('User with this email already exists');
        }

        // 2. Create User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(finalPassword, salt);

        const [userRes] = await connection.query(
            'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, passwordHash, phone, 'doctor', status || 'Active']
        );
        const userId = userRes.insertId;

        // 3. Get or Create Department (Simple logic for now)
        // Check if dept exists
        let deptId;
        const [deptRes] = await connection.query('SELECT id FROM departments WHERE name = ?', [dept]);
        if (deptRes.length > 0) {
            deptId = deptRes[0].id;
        } else {
            const [newDept] = await connection.query('INSERT INTO departments (name) VALUES (?)', [dept]);
            deptId = newDept.insertId;
        }

        // 4. Create Doctor Profile
        await connection.query(
            'INSERT INTO doctors (user_id, department_id, consultation_fee) VALUES (?, ?, ?)',
            [userId, deptId, doctorData.consultation_fee || 500]
        );

        await connection.commit();
        return { id: userId, name, email, role: 'doctor' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateDoctor = async (doctorId, updateData) => {
    const { name, email, phone, dept, consultation_fee, status } = updateData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get doctor's user_id
        const [doctorRes] = await connection.query('SELECT user_id, department_id FROM doctors WHERE id = ?', [doctorId]);
        if (doctorRes.length === 0) {
            throw new Error('Doctor not found');
        }
        const userId = doctorRes[0].user_id;

        // 2. Update user information
        await connection.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
            [name, email, phone, status || 'Active', userId]
        );

        // 3. Handle department update if needed
        let deptId = doctorRes[0].department_id;
        if (dept) {
            const [deptRes] = await connection.query('SELECT id FROM departments WHERE name = ?', [dept]);
            if (deptRes.length > 0) {
                deptId = deptRes[0].id;
            } else {
                const [newDept] = await connection.query('INSERT INTO departments (name) VALUES (?)', [dept]);
                deptId = newDept.insertId;
            }
        }

        // 4. Update doctor profile
        await connection.query(
            'UPDATE doctors SET department_id = ?, consultation_fee = ? WHERE id = ?',
            [deptId, consultation_fee || 500, doctorId]
        );

        await connection.commit();
        return { id: doctorId, userId, name, email };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getDashboardStats = async () => {
    const [[{ dailyAppointments }]] = await pool.query('SELECT COUNT(*) as dailyAppointments FROM appointments WHERE date = CURRENT_DATE');
    const [[{ activePatients }]] = await pool.query('SELECT COUNT(*) as activePatients FROM patients');
    // For revenue, sum all paid payments today
    const [[{ dailyRevenue }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) as dailyRevenue FROM payments WHERE status IN ('Captured', 'Paid') AND DATE(payment_date) = CURRENT_DATE");
    const [[{ pendingApprovals }]] = await pool.query("SELECT COUNT(*) as pendingApprovals FROM appointments WHERE status = 'Scheduled'");

    return {
        dailyAppointments,
        activePatients,
        dailyRevenue,
        pendingApprovals
    };
};

const getPatients = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id, 
            u.name, 
            u.email, 
            p.gender, 
            p.dob, 
            p.phone, 
            p.address, 
            p.history,
            p.blood_group,
            p.status,
            p.clinical_condition
        FROM patients p
        JOIN users u ON p.user_id = u.id
    `);
    return rows;
};

const getAppointments = async () => {
    const [rows] = await pool.query(`
        SELECT 
            a.id, 
            a.date, 
            a.time, 
            a.status,
            u_p.name as patient_name,
            u_d.name as doctor_name,
            dep.name as dept,
            a.doctor_id,
            p.user_id as patient_user_id,
            d.department_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u_p ON p.user_id = u_p.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u_d ON d.user_id = u_d.id
        LEFT JOIN departments dep ON (d.department_id = dep.id OR a.department_id = dep.id)
        ORDER BY a.date DESC, a.time ASC
    `);
    return rows;
};

const getTodaysAppointments = async () => {
    const [rows] = await pool.query(`
        SELECT 
            a.id, 
            a.date, 
            a.time, 
            a.status,
            u_p.name as patient_name,
            u_d.name as doctor_name,
            dep.name as dept,
            a.doctor_id,
            d.department_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u_p ON p.user_id = u_p.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u_d ON d.user_id = u_d.id
        LEFT JOIN departments dep ON (d.department_id = dep.id OR a.department_id = dep.id)
        WHERE DATE(a.date) = CURRENT_DATE
        ORDER BY a.time ASC
    `);
    return rows;
};

const assignDoctor = async (appointmentId, doctorId) => {
    const [result] = await pool.query(
        "UPDATE appointments SET doctor_id = ? WHERE id = ?",
        [doctorId, appointmentId]
    );
    return result;
};



const updateAppointmentStatus = async (id, status) => {
    await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    return { id, status };
};

const getNotifications = async () => {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    return rows;
};

const markRead = async (id) => {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    return { id };
};

module.exports = {
    createDoctor,
    updateDoctor,
    getDashboardStats,
    getPatients,
    getAppointments,
    getTodaysAppointments,
    updateAppointmentStatus,
    getNotifications,
    markRead,
    assignDoctor
};
