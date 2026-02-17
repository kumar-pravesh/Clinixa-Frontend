const BaseModel = require('./BaseModel');

class PaymentModel extends BaseModel {
    static async findExistingInitiated(appointmentId, amount, providerName) {
        const [rows] = await this.query(`
            SELECT p.*, inv.amount as inv_amount 
            FROM payments p 
            JOIN invoices inv ON p.invoice_id = inv.id 
            WHERE inv.appointment_id = ? AND p.status = 'INITIATED' AND inv.amount = ? AND p.method = ?
            ORDER BY p.id DESC LIMIT 1
        `, [appointmentId, amount, providerName]);
        return rows[0] || null;
    }

    static async create(data, connection) {
        const { invoiceId, amount, method, transactionId, status } = data;
        const [result] = await this.query(
            `INSERT INTO payments (invoice_id, amount, method, transaction_id, status)
             VALUES (?, ?, ?, ?, ?)`,
            [invoiceId, amount, method, transactionId, status || 'INITIATED'],
            connection
        );
        return result.insertId;
    }

    static async findById(id) {
        const cleanId = id.toString().replace('PAY-', '');
        const [rows] = await this.query('SELECT * FROM payments WHERE id = ?', [cleanId]);
        return rows[0] || null;
    }

    static async updateStatus(id, status, connection) {
        return this.query(
            'UPDATE payments SET status = ? WHERE id = ?',
            [status, id],
            connection
        );
    }

    static async findInvoiceByPaymentId(paymentId) {
        const [rows] = await this.query('SELECT invoice_id FROM payments WHERE id = ?', [paymentId]);
        return rows[0] ? rows[0].invoice_id : null;
    }
}

module.exports = PaymentModel;
