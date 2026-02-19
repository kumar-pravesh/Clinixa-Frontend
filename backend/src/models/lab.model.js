const BaseModel = require('./BaseModel');

class LabModel extends BaseModel {
    static async findByDoctorId(doctorId) {
        const [rows] = await this.query(`
            SELECT lr.id, COALESCE(p.name, u.name) as patient_name, lr.test_name, lr.test_date as date, lr.status, lr.file_url as file_path
            FROM lab_reports lr
            JOIN patients p ON lr.patient_id = p.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE lr.doctor_id = ?
            ORDER BY lr.test_date DESC
        `, [doctorId]);
        return rows;
    }

    static async create(data) {
        // supports both upload styles (doctor direct or lab tech with test link)
        const { labTestId, doctorId, patientId, uploadedBy, testName, filePath, results, notes, date } = data;

        const [result] = await this.query(`
            INSERT INTO lab_reports (
                lab_test_id, patient_id, doctor_id, uploaded_by,
                test_name, file_url, result_summary, test_date, status, test_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed', 'Completed')
        `, [
            labTestId || null,
            patientId,
            doctorId,
            uploadedBy || null,
            testName,
            filePath,
            results || notes || null,
            date || new Date()
        ]);
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await this.query(`
            SELECT 
                lr.id,
                CONCAT('RPT-', LPAD(lr.id, 4, '0')) as report_id,
                lr.test_name,
                lr.file_url,
                lr.result_summary,
                lr.test_date,
                p.name as patient_name,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                u.name as doctor_name,
                tu.name as technician_name
            FROM lab_reports lr
            JOIN patients p ON lr.patient_id = p.id
            JOIN doctors d ON lr.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN users tu ON lr.uploaded_by = tu.id
            WHERE lr.id = ?
        `, [id]);
        return rows[0] || null;
    }

    static async findByPatientId(patientId) {
        const [rows] = await this.query(`
            SELECT 
                CONCAT('RPT-', LPAD(lr.id, 4, '0')) as report_id,
                lr.test_name,
                lr.file_url,
                lr.test_date,
                u.name as doctor_name
            FROM lab_reports lr
            LEFT JOIN doctors d ON lr.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE lr.patient_id = ?
            ORDER BY lr.test_date DESC
        `, [patientId]);
        return rows;
    }

    static async countByPatientId(patientId) {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM lab_reports WHERE patient_id = ?', [patientId]);
        return rows[0].count;
    }
}

module.exports = LabModel;
