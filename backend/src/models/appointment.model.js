const BaseModel = require('./BaseModel');

class AppointmentModel extends BaseModel {
    static async findByDoctorId(doctorId) {
        const [rows] = await this.query(`
            SELECT a.id, u.name as patient_name, a.patient_id, DATE_FORMAT(a.date, '%Y-%m-%d') as date, a.time, a.type, a.status, a.reason
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE a.doctor_id = ?
            ORDER BY a.date DESC, a.time ASC
        `, [doctorId]);
        return rows;
    }

    static async findByIdAndDoctor(id, doctorId) {
        const [rows] = await this.query('SELECT id FROM appointments WHERE id = ? AND doctor_id = ?', [id, doctorId]);
        return rows[0] || null;
    }

    static async create(data, connection) {
        let { patientId, doctorId, date, timeSlot, time, type, status, reason } = data;

        // Sanitize IDs
        const cleanPatientId = patientId.toString().replace('PID-', '');
        const cleanDoctorId = doctorId.toString().replace('DOC-', '');

        // Map timeSlot to time if time is missing (for flexibility)
        const finalTime = time || timeSlot;
        const [result] = await this.query(
            `INSERT INTO appointments (patient_id, doctor_id, date, time, type, status, reason)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cleanPatientId, cleanDoctorId, date, finalTime, type || 'Consultation', status || 'CREATED', reason || ''],
            connection
        );
        return result.insertId;
    }

    static async getLastVisit(patientId, doctorId) {
        const [rows] = await this.query(
            'SELECT date FROM appointments WHERE patient_id = ? AND doctor_id = ? ORDER BY date DESC LIMIT 1',
            [patientId, doctorId]
        );
        return rows[0] ? rows[0].date : null;
    }

    static async getDiagnosis(patientId, doctorId) {
        const [rows] = await this.query(
            'SELECT reason FROM appointments WHERE patient_id = ? AND doctor_id = ? ORDER BY date DESC LIMIT 1',
            [patientId, doctorId]
        );
        return rows[0] ? rows[0].reason : null;
    }

    static async findAll(filters = {}) {
        const { date, status, doctor_id, patient_id, search, limit = 100 } = filters;

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
            LEFT JOIN patients p ON a.patient_id = p.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE 1=1
        `;

        const params = [];
        if (date) {
            // Use DATE_ADD to handle UTC vs IST (5:30h offset) for precise day matching
            query += ` AND DATE(DATE_ADD(a.date, INTERVAL 330 MINUTE)) = ?`;
            params.push(date);
        }
        if (status) {
            query += ` AND a.status = ?`;
            params.push(status);
        }
        if (doctor_id) {
            const cleanId = doctor_id.toString().replace('DOC-', '');
            query += ` AND a.doctor_id = ?`;
            params.push(cleanId);
        }
        if (patient_id) {
            const cleanId = patient_id.toString().replace('PID-', '');
            query += ` AND a.patient_id = ?`;
            params.push(cleanId);
        }
        if (search) {
            query += ` AND (p.name LIKE ? OR u.name LIKE ? OR dep.name LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        query += ` ORDER BY a.date DESC, a.time LIMIT ?`;
        params.push(parseInt(limit) || 100);

        const [rows] = await this.query(query, params);
        return rows;
    }

    static async countToday() {
        // Use +5:30 offset to match IST "Today" from UTC storage
        const [rows] = await this.query('SELECT COUNT(*) as count FROM appointments WHERE DATE(DATE_ADD(date, INTERVAL 330 MINUTE)) = DATE(DATE_ADD(NOW(), INTERVAL 330 MINUTE))');
        return rows[0].count;
    }

    static async checkAvailability(doctorId, date, timeSlot) {
        const cleanDoctorId = doctorId.toString().replace('DOC-', '');
        const [rows] = await this.query(
            'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != ?',
            [cleanDoctorId, date, timeSlot, 'Cancelled']
        );
        return rows.length === 0;
    }

    static async findByUserId(userId) {
        const [rows] = await this.query(`
            SELECT 
                a.*,
                u.name as doctor_name,
                dep.name as specialization,
                doc.consultation_fee,
                doc.image_url,
                inv.total as paid_amount,
                inv.payment_status
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors doc ON a.doctor_id = doc.id
            JOIN users u ON doc.user_id = u.id
            LEFT JOIN departments dep ON doc.department_id = dep.id
            LEFT JOIN invoices inv ON inv.appointment_id = a.id
            WHERE p.user_id = ?
            ORDER BY a.date DESC, a.time ASC
        `, [userId]);
        return rows;
    }

    static async findNextByUserId(userId) {
        const [rows] = await this.query(`
            SELECT 
                a.id,
                DATE_FORMAT(a.date, '%Y-%m-%d') as date,
                a.time,
                a.status,
                u.name as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE p.user_id = ? 
            AND (
                a.date > CURDATE() 
                OR (a.date = CURDATE() AND a.time > DATE_FORMAT(NOW(), '%h:%i %p'))
            )
            AND a.status != 'Cancelled'
            ORDER BY a.date ASC, a.time ASC
            LIMIT 1
        `, [userId]);
        return rows[0] || null;
    }

    static async countTodayByUserId(userId) {
        const [rows] = await this.query(`
            SELECT COUNT(*) as count
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE p.user_id = ? AND a.date = CURDATE() AND a.status != 'Cancelled'
        `, [userId]);
        return rows[0].count;
    }

    static async findById(id) {
        const cleanId = id.toString().replace('APP-', '');
        const [rows] = await this.query(`
             SELECT a.*, d.consultation_fee, p.user_id, p.id as patient_id
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             WHERE a.id = ?
        `, [cleanId]);
        return rows[0] || null;
    }

    /**
     * Update appointment status
     * @param {number|string} id 
     * @param {string} status 
     * @param {object} connection - Optional connection for transaction
     */
    static async updateStatus(id, status, connection) {
        const cleanId = id.toString().replace(/^(APP|APT|APT-)-/i, '').replace(/[^0-9]/g, '');
        const [result] = await this.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, cleanId],
            connection
        );
        return result;
    }
}

module.exports = AppointmentModel;
