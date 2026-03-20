const BaseModel = require('./BaseModel');

class InvoiceModel extends BaseModel {
    static async findAll(limit = 100) {
        const [rows] = await this.query(`
            SELECT 
                i.id, i.invoice_number, i.amount, i.total, i.payment_status, i.payment_mode,
                TO_CHAR(i.issued_date, 'YYYY-MM-DD') as issued_date,
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
                 WHERE (issued_date + INTERVAL '330 MINUTE')::date = (NOW() + INTERVAL '330 MINUTE')::date 
                 AND payment_status = 'Paid'`
            );
            return rows[0] ? parseFloat(rows[0].total) : 0;
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
                CONCAT('PID-', LPAD(p.id::text, 4, '0')) as patient_id,
                i.total,
                i.payment_mode,
                i.payment_status,
                TO_CHAR(i.issued_date, 'YYYY-MM-DD') as date,
                TO_CHAR(i.issued_date, 'HH12:MI AM') as time
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            ORDER BY i.issued_date DESC
            LIMIT 50
        `);
        return rows;
    }

    static async countThisYear() {
        const [rows] = await this.query("SELECT COUNT(*) as count FROM invoices WHERE EXTRACT(YEAR FROM issued_date) = EXTRACT(YEAR FROM CURRENT_DATE)");
        return rows[0] ? parseInt(rows[0].count) : 0;
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
                CONCAT('PID-', LPAD(p.id::text, 4, '0')) as patient_code,
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

        // Sanitize IDs with guards
        const cleanAppointmentId = appointmentId ? appointmentId.toString().replace('APP-', '') : null;
        const cleanPatientId = patientId ? patientId.toString().replace('PID-', '') : null;

        // Generate a random invoice number for new inserts
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [result] = await this.query(
            `INSERT INTO invoices (invoice_number, appointment_id, patient_id, amount, total, created_by, issued_date)
              VALUES (?, ?, ?, ?, ?, ?, NOW())
              ON CONFLICT (appointment_id) DO UPDATE SET amount = EXCLUDED.amount, total = EXCLUDED.total, issued_date = NOW()`,
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
        if (!id) return null;
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
