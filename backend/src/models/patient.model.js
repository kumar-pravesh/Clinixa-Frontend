const BaseModel = require('./BaseModel');

class PatientModel extends BaseModel {
    /**
     * Create a new patient profile
     * @param {object} patientData - { user_id, name, dob, gender, phone }
     * @param {object} connection - Optional connection for transaction
     * @returns {Promise<number>} - The new patient ID
     */
    static async create(patientData, connection) {
        const {
            user_id, name, dob, gender, phone, email,
            height, weight, bp_systolic, bp_diastolic, blood_group
        } = patientData;

        const [result] = await this.query(
            `INSERT INTO patients (
                user_id, name, dob, gender, phone, email, 
                height, weight, bp_systolic, bp_diastolic, blood_group
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, name, dob, gender, phone, email,
                height || null, weight || null,
                bp_systolic || null, bp_diastolic || null,
                blood_group || null
            ],
            connection
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await this.query('SELECT * FROM patients WHERE user_id = ?', [userId]);
        return rows[0] || null;
    }
    static async findAll(search = '', limit = 100) {
        let query = `
            SELECT 
                CONCAT('PID-', LPAD(p.id, 4, '0')) as id,
                p.name, p.email, p.phone, p.gender, p.blood_group,
                p.height, p.weight, p.bp_systolic, p.bp_diastolic,
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

        const [rows] = await this.query(query, params);
        return rows;
    }

    static async updateByUserId(userId, updateData, connection) {
        const allowedFields = ['name', 'phone', 'dob', 'gender', 'address', 'history', 'blood_group', 'emergency_contact', 'height', 'weight', 'bp_systolic', 'bp_diastolic'];
        const fields = [];
        const values = [];

        // Check if patient record exists first
        const [existing] = await this.query('SELECT id, email FROM patients WHERE user_id = ?', [userId], connection);

        if (existing.length === 0) {
            // Get user info to populate basic fields
            const [user] = await this.query('SELECT name, email FROM users WHERE id = ?', [userId], connection);
            if (user.length === 0) return null;

            // Create record
            await this.create({
                user_id: userId,
                name: updateData.name || user[0].name,
                email: user[0].email,
                ...updateData
            }, connection);
            return { affectedRows: 1 };
        }

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updateData[field]);
            }
        }

        if (fields.length === 0) return null;

        // Automatically update last_vitals_update if vitals are changed
        if (updateData.height !== undefined || updateData.weight !== undefined || updateData.bp_systolic !== undefined || updateData.bp_diastolic !== undefined) {
            fields.push('last_vitals_update = NOW()');
        }

        const query = `UPDATE patients SET ${fields.join(', ')} WHERE user_id = ?`;
        values.push(userId);

        const [result] = await this.query(query, values, connection);
        return result;
    }

    static async getProfile(userId) {
        const [rows] = await this.query(`
            SELECT p.id, u.name, u.email, p.dob, p.gender, p.phone, p.address, p.history, 
                   p.blood_group, p.height, p.weight, p.bp_systolic, p.bp_diastolic
            FROM users u 
            LEFT JOIN patients p ON u.id = p.user_id 
            WHERE u.id = ?
        `, [userId]);
        return rows[0] || null;
    }

    static async countTotal() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM patients');
        return rows[0].count;
    }

    static async countToday() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM patients WHERE DATE(created_at) = CURDATE()');
        return rows[0].count;
    }

    static async registerWalkIn(patientData, registeredBy) {
        const {
            name, dob, gender, phone, email, address,
            height, weight, bp_systolic, bp_diastolic, blood_group
        } = patientData;

        const [result] = await this.query(
            `INSERT INTO patients (
                name, dob, gender, phone, email, address, registered_by,
                height, weight, bp_systolic, bp_diastolic, blood_group
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, dob, gender, phone, email || null, address || null, registeredBy,
                height || null, weight || null,
                bp_systolic || null, bp_diastolic || null,
                blood_group || null
            ]
        );
        return result.insertId;
    }
}

module.exports = PatientModel;
