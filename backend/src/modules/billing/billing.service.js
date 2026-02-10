const db = require("../../config/db");


// ✅ Create Invoice
exports.createInvoice = async ({ appointment_id, patient_id }) => {
  try {
    // Optional: Check if invoice already exists for this appointment
    const [existing] = await db.query(
      "SELECT id FROM invoices WHERE appointment_id = ?",
      [appointment_id]
    );

    if (existing.length > 0) {
      throw new Error("Invoice already exists for this appointment");
    }

    const query = `
      INSERT INTO invoices (appointment_id, patient_id)
      VALUES (?, ?)
    `;

    const [result] = await db.query(query, [
      appointment_id,
      patient_id
    ]);

    return result;

  } catch (error) {
    console.error("Service - Create Invoice Error:", error);
    throw error;
  }
};



// ✅ Get Invoice By ID
exports.getInvoiceById = async (id) => {
  try {
    const query = `
      SELECT 
        i.id,
        i.appointment_id,
        i.patient_id,
        u.name AS patient_name
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE i.id = ?
    `;

    const [rows] = await db.query(query, [id]);

    return rows;

  } catch (error) {
    console.error("Service - Get Invoice Error:", error);
    throw error;
  }
};



// ✅ Search Invoice (by ID or patient name)
exports.searchInvoice = async (term) => {
  try {
    const query = `
      SELECT 
        i.id,
        i.appointment_id,
        u.name AS patient_name
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE i.id = ? 
         OR u.name LIKE ?
    `;

    const [rows] = await db.query(query, [
      term,
      `%${term}%`
    ]);

    return rows;

  } catch (error) {
    console.error("Service - Search Invoice Error:", error);
    throw error;
  }
};
