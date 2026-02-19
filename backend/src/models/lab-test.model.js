const BaseModel = require('./BaseModel');

class LabTestModel extends BaseModel {
    static async getQueue() {
        const [rows] = await this.query(`
            SELECT 
                lt.id,
                CONCAT('LAB-', LPAD(lt.id, 4, '0')) as test_id,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                u.name as doctor,
                lt.doctor_id,
                lt.test_name as testType,
                lt.priority,
                lt.status,
                lt.category,
                lt.department,
                DATE_FORMAT(lt.created_at, '%h:%i %p') as time,
                DATE_FORMAT(lt.created_at, '%Y-%m-%d') as date
            FROM lab_tests lt
            JOIN patients p ON lt.patient_id = p.id
            JOIN doctors d ON lt.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE lt.status IN ('Pending', 'In Progress')
            ORDER BY 
                CASE lt.priority WHEN 'STAT' THEN 1 WHEN 'Urgent' THEN 2 ELSE 3 END,
                lt.created_at ASC
        `);
        return rows;
    }

    static async getHistory(limit = 50) {
        const [rows] = await this.query(`
            SELECT 
                lt.id,
                CONCAT('LAB-', LPAD(lt.id, 4, '0')) as test_id,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                du.name as doctor,
                lt.doctor_id,
                lt.test_name as testType,
                lt.priority,
                lt.status,
                lt.category,
                DATE_FORMAT(lt.updated_at, '%Y-%m-%d') as completedDate,
                DATE_FORMAT(lt.updated_at, '%h:%i %p') as completedTime,
                lr.id as report_id,
                lr.file_url,
                tu.name as technician
            FROM lab_tests lt
            JOIN patients p ON lt.patient_id = p.id
            JOIN doctors d ON lt.doctor_id = d.id
            JOIN users du ON d.user_id = du.id
            LEFT JOIN lab_reports lr ON lr.lab_test_id = lt.id
            LEFT JOIN users tu ON lr.uploaded_by = tu.id
            WHERE lt.status IN ('Completed', 'Delivered')
            ORDER BY lt.updated_at DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    static async create(data) {
        const { patient_id, doctor_id, test_name, category, department, priority, notes } = data;
        const [result] = await this.query(`
            INSERT INTO lab_tests (
                patient_id, doctor_id, test_name, category, department, priority, notes, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
        `, [patient_id, doctor_id, test_name, category, department, priority, notes]);
        return result.insertId;
    }

    static async updateStatus(testId, status) {
        const [result] = await this.query(`
            UPDATE lab_tests SET status = ?, updated_at = NOW()
            WHERE id = ?
        `, [status, testId]);
        return result;
    }
}

module.exports = LabTestModel;
