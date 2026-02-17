const BaseModel = require('./BaseModel');

class PrescriptionModel extends BaseModel {
    static async findByDoctorId(doctorId) {
        const [rows] = await this.query(`
            SELECT pr.id, COALESCE(p.name, u.name) as patient_name, pr.visit_date as date, pr.diagnosis,
                   (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', m.name, 'dosage', m.dosage, 'frequency', m.frequency, 'duration', m.duration))
                    FROM medicines m WHERE m.prescription_id = pr.id) as medications
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE pr.doctor_id = ?
            ORDER BY pr.visit_date DESC
        `, [doctorId]);
        return rows;
    }

    static async findByPatientId(patientId) {
        const [rows] = await this.query(`
            SELECT 
                pr.id,
                COALESCE(u.name, 'Doctor') as doctor_name,
                pr.visit_date as date,
                pr.diagnosis
            FROM prescriptions pr
            LEFT JOIN doctors d ON pr.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE pr.patient_id = ?
            ORDER BY pr.visit_date DESC
        `, [patientId]);
        return rows;
    }

    static async countByPatientId(patientId) {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?', [patientId]);
        return rows[0].count;
    }

    static async findByIdAndDoctor(id, doctorId) {
        const [rows] = await this.query('SELECT id FROM prescriptions WHERE id = ? AND doctor_id = ?', [id, doctorId]);
        return rows[0] || null;
    }

    static async create(data, connection) {
        const { doctorId, patientId, date, diagnosis, notes } = data;
        const [result] = await this.query(
            'INSERT INTO prescriptions (doctor_id, patient_id, visit_date, diagnosis, notes) VALUES (?, ?, ?, ?, ?)',
            [doctorId, patientId, date, diagnosis || '', notes || ''],
            connection
        );
        return result.insertId;
    }

    static async addItems(items, connection) {
        // items is array of [prescriptionId, name, dosage, frequency, duration]
        const [result] = await this.query(
            'INSERT INTO medicines (prescription_id, name, dosage, frequency, duration) VALUES ?',
            [items],
            connection
        );
        return result;
    }
}

module.exports = PrescriptionModel;
