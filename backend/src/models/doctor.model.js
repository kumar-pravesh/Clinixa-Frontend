const BaseModel = require('./BaseModel');

class DoctorModel extends BaseModel {
    static async findByUserId(userId) {
        const [rows] = await this.query('SELECT * FROM doctors WHERE user_id = ?', [userId]);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await this.query('SELECT * FROM doctors WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async logLogin(doctorId, ip) {
        const [result] = await this.query('INSERT INTO login_history (doctor_id, ip_address) VALUES (?, ?)', [doctorId, ip]);
        return result;
    }

    static async getProfile(userId) {
        const [rows] = await this.query(`
            SELECT u.name, u.email, u.phone, u.status, d.specialization, d.experience_years, d.consultation_fee
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            WHERE u.id = ?
        `, [userId]);
        return rows[0] || null;
    }

    static async getPublicDoctors() {
        const [rows] = await this.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name,
                u.email,
                u.phone,
                u.status,
                d.specialization as dept,
                d.experience_years,
                d.consultation_fee,
                d.qualification,
                d.image_url,
                dep.name as department_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE u.role = 'doctor' AND u.status = 'Active'
            ORDER BY u.name
        `);
        return rows;
    }

    static async getPublicDoctorById(cleanId) {
        const [rows] = await this.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name,
                u.email,
                u.phone,
                u.status,
                d.specialization as dept,
                d.experience_years,
                d.consultation_fee,
                d.qualification,
                d.image_url,
                dep.name as department_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE d.id = ?
        `, [cleanId]);
        return rows[0] || null;
    }

    static async getPatientsByDoctorId(doctorId) {
        console.log(`[DEBUG] executing getPatientsByDoctorId with ID: ${doctorId}`);
        const [rows] = await this.query(`
            SELECT DISTINCT 
                p.id, 
                COALESCE(p.name, u.name) as name, 
                CASE 
                    WHEN p.dob IS NOT NULL THEN TIMESTAMPDIFF(YEAR, p.dob, CURDATE())
                    ELSE 'N/A'
                END as age,
                p.gender, 
                p.phone,
                (SELECT reason FROM appointments WHERE patient_id = p.id AND doctor_id = ? ORDER BY date DESC, time DESC LIMIT 1) as diagnosis,
                (SELECT date FROM appointments WHERE patient_id = p.id AND doctor_id = ? ORDER BY date DESC, time DESC LIMIT 1) as lastVisit
            FROM patients p
            LEFT JOIN users u ON p.user_id = u.id
            JOIN appointments a ON p.id = a.patient_id
            WHERE a.doctor_id = ?
        `, [doctorId, doctorId, doctorId]);
        return rows;
    }

    static async create(data, connection) {
        // Creates the Doctor profile part. User part is handled by UserModel.
        const { userId, departmentId, departmentName, experience_years, consultation_fee, qualification, image_url } = data;
        const [result] = await this.query(
            `INSERT INTO doctors (user_id, department_id, specialization, experience_years, consultation_fee, qualification, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, departmentId, departmentName, experience_years || 0, consultation_fee || 500, qualification || '', image_url || null],
            connection
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await this.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name, u.email, u.phone, u.status,
                dep.name as dept,
                d.specialization, d.experience_years, d.consultation_fee, d.qualification, d.image_url
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            ORDER BY u.name ASC
        `);
        return rows;
    }

    static async update(id, data, connection) {
        // Updates doctor profile only. User table updated separately.
        const { departmentId, departmentName, consultation_fee, experience_years, qualification, image_url } = data;
        let query = `UPDATE doctors SET department_id = ?, specialization = ?, consultation_fee = ?, 
                     experience_years = ?, qualification = ?`;
        const params = [departmentId, departmentName, consultation_fee || 500, experience_years || 0, qualification || ''];

        if (image_url) {
            query += `, image_url = ?`;
            params.push(image_url);
        }

        query += ` WHERE id = ?`;
        params.push(id);

        const [result] = await this.query(query, params, connection);
        return result;
    }

    static async countTotal() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM doctors');
        return rows[0].count;
    }
}

module.exports = DoctorModel;
