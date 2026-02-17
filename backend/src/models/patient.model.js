const BaseModel = require('./BaseModel');

class PatientModel extends BaseModel {
    /**
     * Create a new patient profile
     * @param {object} patientData - { user_id, name, dob, gender, phone }
     * @param {object} connection - Optional connection for transaction
     * @returns {Promise<number>} - The new patient ID
     */
    static async create(patientData, connection) {
        const { user_id, name, dob, gender, phone, email } = patientData;
        const [result] = await this.query(
            'INSERT INTO patients (user_id, name, dob, gender, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, name, dob, gender, phone, email],
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

    static async countTotal() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM patients');
        return rows[0].count;
    }

    static async search(queryText) {
        const cleanId = queryText.toUpperCase().replace('PID-', '');
        const isId = !isNaN(cleanId) && cleanId.length > 0;

        let sql = `
            SELECT 
                CONCAT('PID-', LPAD(id, 4, '0')) as id,
                name, email, phone, dob, gender,
                DATE_FORMAT(created_at, '%Y-%m-%d') as registered_date
            FROM patients 
            WHERE phone LIKE ? OR name LIKE ?
        `;

        const params = [`%${queryText}%`, `%${queryText}%`];

        if (isId) {
            sql += ` OR id = ?`;
            params.push(cleanId);
        }

        sql += ` LIMIT 10`;

        const [rows] = await this.query(sql, params);
        return rows;
    }

    static async registerWalkIn(patientData, registeredBy) {
        const { name, phone, dob, gender, address, email, blood_group, emergency_contact } = patientData;
        const [result] = await this.query(`
            INSERT INTO patients (name, phone, dob, gender, address, email, blood_group, emergency_contact, registered_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, phone, dob, gender, address, email, blood_group, emergency_contact, registeredBy]);
        return result.insertId;
    }

    static async getProfile(userId) {
        const [rows] = await this.query(`
            SELECT p.id, u.name, u.email, p.dob, p.gender, p.phone 
            FROM users u 
            JOIN patients p ON u.id = p.user_id 
            WHERE u.id = ?
        `, [userId]);
        return rows[0] || null;
    }

    static async countToday() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM patients WHERE DATE(created_at) = CURDATE()');
        return rows[0].count;
    }
}

module.exports = PatientModel;
