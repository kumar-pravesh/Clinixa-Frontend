const BaseModel = require('./BaseModel');

class InvoiceModel extends BaseModel {
    static async findAll(limit = 100) {
        const [rows] = await this.query(`
            SELECT 
                i.id, i.invoice_number, i.amount, i.total, i.payment_status, i.payment_mode,
                DATE_FORMAT(i.issued_date, '%Y-%m-%d') as issued_date,
                p.name as patient_name,
                'Consultation' as type -- Placeholder for now as per current schema structure
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            ORDER BY i.issued_date DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    static async getTodayRevenue() {
        try {
            const [rows] = await this.query(
                `SELECT COALESCE(SUM(total), 0) as total FROM invoices 
                 WHERE DATE(DATE_ADD(issued_date, INTERVAL 330 MINUTE)) = DATE(DATE_ADD(NOW(), INTERVAL 330 MINUTE)) 
                 AND payment_status = 'Paid'`
            );
            return rows[0].total;
        } catch (e) {
            return 0;
        }
    }

    static async getRecent() {
        const [rows] = await this.query(`
            SELECT 
                i.id,
                i.invoice_number,
                p.name as patient_name,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                i.total,
                i.payment_mode,
                i.payment_status,
                DATE_FORMAT(i.issued_date, '%Y-%m-%d') as date,
                DATE_FORMAT(i.issued_date, '%h:%i %p') as time
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            ORDER BY i.issued_date DESC
            LIMIT 50
        `);
        return rows;
    }

    static async countThisYear() {
        const [rows] = await this.query('SELECT COUNT(*) as count FROM invoices WHERE YEAR(issued_date) = YEAR(CURDATE())');
        return rows[0].count;
    }

    static async create(data) {
        try {
            const {
                invoiceNumber, appointment_id, patient_id, createdBy,
                consultation_fee, lab_charges, medicine_charges, other_charges,
                items, subtotal, discount_percent, discount_amount,
                taxAmount, total, payment_mode, amount
            } = data;

            const issuedDate = new Date();

            const [result] = await this.query(`
                INSERT INTO invoices (
                    invoice_number, appointment_id, patient_id, created_by,
                    consultation_fee, lab_charges, medicine_charges, other_charges,
                    items, subtotal, discount_percent, discount_amount,
                    tax_amount, total, amount, payment_mode, payment_status, issued_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Paid', ?)
            `, [
                invoiceNumber, appointment_id, patient_id, createdBy,
                consultation_fee, lab_charges, medicine_charges, other_charges,
                JSON.stringify(items), subtotal, discount_percent, discount_amount,
                taxAmount, total, amount || total, payment_mode, issuedDate
            ]);
            return result.insertId;
        } catch (error) {
            console.error('[InvoiceModel] Create Error:', error.message);
            throw error;
        }
    }

    static async findById(invoiceId) {
        const [rows] = await this.query(`
            SELECT 
                i.*,
                p.name as patient_name,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_code,
                p.phone as patient_phone,
                p.address as patient_address,
                a.status as appointment_status,
                a.id as appointment_id
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            LEFT JOIN appointments a ON i.appointment_id = a.id
            WHERE i.id = ? OR i.invoice_number = ?
        `, [invoiceId, invoiceId]);
        return rows[0] || null;
    }

    static async upsertInvoice(data, connection) {
        // Used by payment service to create/update invoice before payment
        const { appointmentId, patientId, amount, createdBy } = data;

        // Sanitize IDs
        const cleanAppointmentId = appointmentId.toString().replace('APP-', '');
        const cleanPatientId = patientId.toString().replace('PID-', '');

        // Generate a random invoice number for new inserts
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [result] = await this.query(
            `INSERT INTO invoices (invoice_number, appointment_id, patient_id, amount, total, created_by, issued_date)
              VALUES (?, ?, ?, ?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE amount = VALUES(amount), total = VALUES(total), issued_date = NOW()`,
            [invoiceNumber, cleanAppointmentId, cleanPatientId, amount, amount, createdBy],
            connection
        );

        if (result.insertId) return result.insertId;

        // If updated, fetch ID. Use try-catch or explicit check.
        const [rows] = await this.query('SELECT id FROM invoices WHERE appointment_id = ?', [cleanAppointmentId], connection);
        if (!rows || rows.length === 0) throw new Error('Failed to retrieve invoice ID after upsert');
        return rows[0].id;
    }

    static async getAppointmentId(invoiceId, connection) {
        const [rows] = await this.query('SELECT appointment_id FROM invoices WHERE id = ?', [invoiceId], connection);
        return rows[0] ? rows[0].appointment_id : null;
    }

    static async updateStatus(id, status, connection) {
        const cleanId = id.toString().replace('INV-', '');
        const [result] = await this.query(
            'UPDATE invoices SET payment_status = ? WHERE id = ?',
            [status, cleanId],
            connection
        );
        return result;
    }
}

module.exports = InvoiceModel;
