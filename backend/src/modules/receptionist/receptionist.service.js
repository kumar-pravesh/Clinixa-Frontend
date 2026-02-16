/**
 * Receptionist Service
 * Database operations for receptionist module
 */
const { pool } = require('../../config/db');

const receptionistService = {
  /**
   * Search patient by phone number
   */
  async searchPatients(query) {
    const cleanId = query.toUpperCase().replace('PID-', '');
    const isId = !isNaN(cleanId) && cleanId.length > 0;

    let sql = `
            SELECT 
                CONCAT('PID-', LPAD(id, 4, '0')) as id,
                name, email, phone, dob, gender, blood_group,
                address, emergency_contact,
                DATE_FORMAT(created_at, '%Y-%m-%d') as registered_date
            FROM patients 
            WHERE phone LIKE ? OR name LIKE ?
        `;

    const params = [`%${query}%`, `%${query}%`];

    if (isId) {
      sql += ` OR id = ?`;
      params.push(cleanId);
    }

    sql += ` LIMIT 10`;

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  /**
   * Register walk-in patient
   */
  async registerWalkIn(patientData, registeredBy) {
    const { name, phone, dob, gender, address, email, blood_group, emergency_contact } = patientData;

    const [result] = await pool.query(`
            INSERT INTO patients (name, phone, dob, gender, address, email, blood_group, emergency_contact, registered_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, phone, dob, gender, address, email, blood_group, emergency_contact, registeredBy]);

    return {
      id: result.insertId,
      patientId: `PID-${String(result.insertId).padStart(4, '0')}`
    };
  },

  /**
   * Get all tokens for today
   */
  async getTokens() {
    const [rows] = await pool.query(`
            SELECT 
                t.id,
                t.token_number as id,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patientId,
                t.department as dept,
                u.name as doctor,
                t.status,
                DATE_FORMAT(t.created_at, '%h:%i %p') as time,
                p.phone as mobile
            FROM tokens t
            JOIN patients p ON t.patient_id = p.id
            LEFT JOIN doctors d ON t.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE DATE(t.created_at) = CURDATE()
            ORDER BY t.created_at DESC
        `);
    return rows;
  },

  /**
   * Generate new token
   */
  async generateToken(data, generatedBy) {
    const { patient_id, doctor_id, department } = data;

    // Get next token number for today
    const [countResult] = await pool.query(`
            SELECT COUNT(*) as count FROM tokens WHERE DATE(created_at) = CURDATE()
        `);
    const nextNumber = 1000 + countResult[0].count + 1;
    const tokenNumber = `TK-${nextNumber}`;

    const [result] = await pool.query(`
            INSERT INTO tokens (token_number, patient_id, doctor_id, department, generated_by, status)
            VALUES (?, ?, ?, ?, ?, 'Waiting')
        `, [tokenNumber, patient_id, doctor_id, department, generatedBy]);

    // Fetch the created token with details
    const [rows] = await pool.query(`
            SELECT 
                t.token_number as id,
                p.name as patient,
                u.name as doctor,
                t.department as dept,
                t.status,
                DATE_FORMAT(t.created_at, '%h:%i %p') as time,
                p.phone as mobile
            FROM tokens t
            JOIN patients p ON t.patient_id = p.id
            LEFT JOIN doctors d ON t.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE t.id = ?
        `, [result.insertId]);

    return rows[0];
  },

  /**
   * Update token status
   */
  async updateTokenStatus(tokenId, status) {
    const updateData = { status };
    if (status === 'In Progress') {
      updateData.called_at = new Date();
    } else if (status === 'Completed') {
      updateData.completed_at = new Date();
    }

    await pool.query(`
            UPDATE tokens SET status = ?, called_at = ?, completed_at = ?
            WHERE token_number = ? OR id = ?
        `, [status, updateData.called_at || null, updateData.completed_at || null, tokenId, tokenId]);

    return { success: true };
  },

  /**
   * Delete/Cancel token
   */
  async deleteToken(tokenId) {
    await pool.query(`
            DELETE FROM tokens WHERE token_number = ? OR id = ?
        `, [tokenId, tokenId]);
    return { success: true };
  },

  /**
   * Get recent invoices
   */
  async getRecentInvoices() {
    const [rows] = await pool.query(`
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
  },

  /**
   * Create invoice
   */
  async createInvoice(data, createdBy) {
    const {
      patient_id, appointment_id,
      consultation_fee = 0, lab_charges = 0, medicine_charges = 0, other_charges = 0,
      items = [], discount_percent = 0, payment_mode = 'Cash'
    } = data;

    const subtotal = parseFloat(consultation_fee) + parseFloat(lab_charges) +
      parseFloat(medicine_charges) + parseFloat(other_charges) +
      items.reduce((sum, item) => sum + parseFloat(item.charge || 0), 0);

    const discountAmount = (subtotal * parseFloat(discount_percent)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * 0.18;
    const total = taxableAmount + taxAmount;

    // Generate invoice number
    const [countResult] = await pool.query(`
            SELECT COUNT(*) as count FROM invoices WHERE YEAR(issued_date) = YEAR(CURDATE())
        `);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(countResult[0].count + 1).padStart(3, '0')}`;

    const [result] = await pool.query(`
            INSERT INTO invoices (
                invoice_number, appointment_id, patient_id, created_by,
                consultation_fee, lab_charges, medicine_charges, other_charges,
                items, subtotal, discount_percent, discount_amount,
                tax_amount, total, payment_mode, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Paid')
        `, [
      invoiceNumber, appointment_id, patient_id, createdBy,
      consultation_fee, lab_charges, medicine_charges, other_charges,
      JSON.stringify(items), subtotal, discount_percent, discountAmount,
      taxAmount, total, payment_mode
    ]);

    return {
      id: result.insertId,
      invoice_number: invoiceNumber,
      total,
      payment_status: 'Paid'
    };
  },

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId) {
    const [rows] = await pool.query(`
            SELECT 
                i.*,
                p.name as patient_name,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_code,
                p.phone as patient_phone,
                p.address as patient_address
            FROM invoices i
            JOIN patients p ON i.patient_id = p.id
            WHERE i.id = ? OR i.invoice_number = ?
        `, [invoiceId, invoiceId]);

    if (rows.length === 0) return null;

    const invoice = rows[0];
    if (invoice.items) {
      invoice.items = JSON.parse(invoice.items);
    }
    return invoice;
  }
};

module.exports = receptionistService;
