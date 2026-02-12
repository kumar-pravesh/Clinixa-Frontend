const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');

const adminService = {
    /**
     * Create a new doctor
     */
    async createDoctor(doctorData) {
        const { name, email, phone, password, dept, experience_years, consultation_fee, status, qualification } = doctorData;
        const finalPassword = password || 'Doctor@123';

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Check if user exists
            const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                throw new Error('User with this email already exists');
            }

            // Create User
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(finalPassword, salt);

            const [userRes] = await connection.query(
                'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, passwordHash, phone, 'doctor', status || 'Active']
            );
            const userId = userRes.insertId;

            // Get or Create Department
            let deptId = null;
            if (dept) {
                const [deptRes] = await connection.query('SELECT id FROM departments WHERE name = ?', [dept]);
                if (deptRes.length > 0) {
                    deptId = deptRes[0].id;
                } else {
                    const [newDept] = await connection.query('INSERT INTO departments (name) VALUES (?)', [dept]);
                    deptId = newDept.insertId;
                }
            }

            // Create Doctor Profile
            const [docRes] = await connection.query(
                `INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, qualification) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, deptId, dept, experience_years || 0, consultation_fee || 500, qualification || '']
            );

            await connection.commit();
            return {
                id: `DOC-${String(docRes.insertId).padStart(4, '0')}`,
                name,
                email,
                role: 'doctor'
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Get all doctors
     */
    async getAllDoctors() {
        const [rows] = await pool.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name, u.email, u.phone, u.status,
                dep.name as dept,
                d.specialization, d.experience_years, d.consultation_fee, d.qualification
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            ORDER BY u.name ASC
        `);
        return rows;
    },

    /**
     * Update doctor information
     */
    async updateDoctor(doctorId, updateData) {
        const numericId = doctorId.toString().replace('DOC-', '');
        const { name, email, phone, dept, consultation_fee, status, experience_years, qualification } = updateData;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [doctorRes] = await connection.query('SELECT user_id, department_id FROM doctors WHERE id = ?', [numericId]);
            if (doctorRes.length === 0) {
                throw new Error('Doctor not found');
            }
            const userId = doctorRes[0].user_id;

            // Update user information
            await connection.query(
                'UPDATE users SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
                [name, email, phone, status || 'Active', userId]
            );

            // Handle department update
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

            // Update doctor profile
            await connection.query(
                `UPDATE doctors SET department_id = ?, specialization = ?, consultation_fee = ?, 
                 experience_years = ?, qualification = ? WHERE id = ?`,
                [deptId, dept, consultation_fee || 500, experience_years || 0, qualification || '', numericId]
            );

            await connection.commit();
            return { id: doctorId, name, email };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Delete doctor
     */
    async deleteDoctor(doctorId) {
        const numericId = doctorId.toString().replace('DOC-', '');

        const [doctorRes] = await pool.query('SELECT user_id FROM doctors WHERE id = ?', [numericId]);
        if (doctorRes.length === 0) {
            throw new Error('Doctor not found');
        }

        await pool.query('DELETE FROM users WHERE id = ?', [doctorRes[0].user_id]);
        return { success: true };
    },

    /**
     * Get all departments
     */
    async getDepartments() {
        const [rows] = await pool.query(`
            SELECT 
                d.id,
                d.name,
                d.head,
                d.beds,
                d.status,
                d.color,
                d.description,
                d.image_url,
                d.tech,
                d.success_rate,
                d.procedures,
                COUNT(doc.id) as doctor_count
            FROM departments d
            LEFT JOIN doctors doc ON doc.department_id = d.id
            GROUP BY d.id
            ORDER BY d.name
        `);
        return rows;
    },

    /**
     * Create department
     */
    async createDepartment(data) {
        const { name, head, beds, status, color, description } = data;
        const [result] = await pool.query(
            'INSERT INTO departments (name, head, beds, status, color, description) VALUES (?, ?, ?, ?, ?, ?)',
            [name, head, beds || 0, status || 'Active', color || 'bg-primary', description || '']
        );
        return { id: result.insertId, name, head, beds, status, color, description };
    },

    /**
     * Update department
     */
    async updateDepartment(id, data) {
        const numericId = id.toString().replace('DEPT-', '');
        const { name, head, beds, status, color, description } = data;
        await pool.query(
            'UPDATE departments SET name = ?, head = ?, beds = ?, status = ?, color = ?, description = ? WHERE id = ?',
            [name, head, beds || 0, status || 'Active', color || 'bg-primary', description || '', numericId]
        );
        return { id, name, head, beds, status, color, description };
    },

    /**
     * Delete department
     */
    async deleteDepartment(id) {
        const numericId = id.toString().replace('DEPT-', '');
        await pool.query('DELETE FROM departments WHERE id = ?', [numericId]);
        return { success: true };
    },

    /**
     * Get all patients
     */
    async getPatients(search = '', limit = 100) {
        let query = `
            SELECT 
                CONCAT('PID-', LPAD(p.id, 4, '0')) as id,
                p.name, p.email, p.phone, p.gender, p.blood_group,
                DATE_FORMAT(p.dob, '%Y-%m-%d') as dob,
                DATE_FORMAT(p.created_at, '%Y-%m-%d') as registered_date,
                (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id) as visit_count,
                (SELECT MAX(a.date) FROM appointments a WHERE a.patient_id = p.id) as last_visit
            FROM patients p
        `;

        const params = [];
        if (search) {
            query += ` WHERE p.name LIKE ? OR p.phone LIKE ? OR p.email LIKE ?`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY p.created_at DESC LIMIT ?`;
        params.push(limit);

        const [rows] = await pool.query(query, params);
        return rows;
    },

    /**
     * Get all appointments
     */
    async getAppointments(filters = {}) {
        const { date, status, doctor_id, limit = 100 } = filters;

        let query = `
            SELECT 
                a.id,
                DATE_FORMAT(a.date, '%Y-%m-%d') as date,
                a.time,
                a.type,
                a.status,
                a.reason,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                u.name as doctor,
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as doctor_id,
                dep.name as dept
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE 1=1
        `;

        const params = [];
        if (date) {
            query += ` AND a.date = ?`;
            params.push(date);
        }
        if (status) {
            query += ` AND a.status = ?`;
            params.push(status);
        }
        if (doctor_id) {
            const numericDoctorId = doctor_id.toString().replace('DOC-', '');
            query += ` AND a.doctor_id = ?`;
            params.push(numericDoctorId);
        }

        query += ` ORDER BY a.date DESC, a.time LIMIT ?`;
        params.push(limit);

        const [rows] = await pool.query(query, params);
        return rows;
    },

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(id, status) {
        await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        return { success: true, status };
    },

    /**
     * Get invoices
     */
    async getInvoices(limit = 100) {
        const [rows] = await pool.query(`
            SELECT 
                i.id, i.amount, i.total, i.payment_status,
                DATE_FORMAT(i.issued_date, '%Y-%m-%d') as issued_date,
                p.name as patient_name
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            ORDER BY i.issued_date DESC
            LIMIT ?
        `, [limit]);
        return rows;
    },

    /**
     * Approve appointment
     */
    async approveAppointment(id) {
        await pool.query('UPDATE appointments SET status = ? WHERE id = ?', ['Scheduled', id]);
        return { success: true, status: 'Scheduled' };
    },

    /**
     * Reject appointment
     */
    async rejectAppointment(id) {
        await pool.query('UPDATE appointments SET status = ? WHERE id = ?', ['Cancelled', id]);
        return { success: true, status: 'Cancelled' };
    },

    /**
     * Get dashboard summary
     */
    async getDashboardSummary() {
        const [doctorCount] = await pool.query('SELECT COUNT(*) as count FROM doctors');
        const [patientCount] = await pool.query('SELECT COUNT(*) as count FROM patients');
        const [todayAppointments] = await pool.query(
            'SELECT COUNT(*) as count FROM appointments WHERE date = CURDATE()'
        );
        const [pendingTokens] = await pool.query(
            `SELECT COUNT(*) as count FROM tokens WHERE status IN ('Waiting', 'In Progress') AND DATE(created_at) = CURDATE()`
        );
        const [todayRevenue] = await pool.query(
            `SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE DATE(issued_date) = CURDATE() AND payment_status = 'Paid'`
        );

        return {
            doctors: doctorCount[0].count,
            patients: patientCount[0].count,
            todayAppointments: todayAppointments[0].count,
            pendingTokens: pendingTokens[0].count,
            todayRevenue: todayRevenue[0].total
        };
    }
};

module.exports = adminService;

