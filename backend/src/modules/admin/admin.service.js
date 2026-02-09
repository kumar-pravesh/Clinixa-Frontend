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

module.exports = {
    createDoctor,
    updateDoctor
};
