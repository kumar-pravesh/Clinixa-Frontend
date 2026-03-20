const BaseModel = require('./BaseModel');

class TokenModel extends BaseModel {
    static async findAllToday() {
        const [rows] = await this.query(`
            SELECT 
                t.id,
                t.token_number,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id::text, 4, '0')) as patientId,
                t.department as dept,
                u.name as doctor,
                t.status,
                TO_CHAR(t.created_at, 'HH12:MI AM') as time,
                p.phone as mobile
            FROM tokens t
            JOIN patients p ON t.patient_id = p.id
            LEFT JOIN doctors d ON t.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE t.created_at::date = CURRENT_DATE
            ORDER BY t.created_at DESC
        `);
        return rows;
    }

    static async countToday() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM tokens WHERE created_at::date = CURRENT_DATE');
        return rows[0] ? parseInt(rows[0].count) : 0;
    }

    static async create(data) {
        const { tokenNumber, patientId, doctorId, department, generatedBy } = data;
        const [result] = await this.query(`
            INSERT INTO tokens (token_number, patient_id, doctor_id, department, generated_by, status)
            VALUES (?, ?, ?, ?, ?, 'Waiting')
        `, [tokenNumber, patientId, doctorId, department, generatedBy]);
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await this.query(`
            SELECT 
                t.id,
                t.token_number,
                p.name as patient,
                u.name as doctor,
                t.department as dept,
                t.status,
                TO_CHAR(t.created_at, 'HH12:MI AM') as time,
                p.phone as mobile
            FROM tokens t
            JOIN patients p ON t.patient_id = p.id
            LEFT JOIN doctors d ON t.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE t.id = ?
        `, [id]);
        return rows[0] || null;
    }

    static async updateStatus(tokenId, status, calledAt, completedAt) {
        const [result] = await this.query(`
            UPDATE tokens SET status = ?, called_at = ?, completed_at = ?
            WHERE token_number = ? OR id = ?
        `, [status, calledAt || null, completedAt || null, tokenId, tokenId]);
        return result;
    }

    static async delete(tokenId) {
        const [result] = await this.query('DELETE FROM tokens WHERE token_number = ? OR id = ?', [tokenId, tokenId]);
        return result;
    }

    static async getAvgWaitingTimeToday() {
        const [rows] = await this.query(`
            SELECT AVG(EXTRACT(EPOCH FROM (called_at - created_at)) / 60) as avg_wait
            FROM tokens
            WHERE created_at::date = CURRENT_DATE AND called_at IS NOT NULL
        `);
        return rows[0].avg_wait || 0;
    }

    static async countActiveToday() {
        const [rows] = await this.query(`
            SELECT COUNT(*) as count FROM tokens
            WHERE created_at::date = CURRENT_DATE AND status IN ('Waiting', 'In Progress')
        `);
        return rows[0] ? parseInt(rows[0].count) : 0;
    }
}

module.exports = TokenModel;
