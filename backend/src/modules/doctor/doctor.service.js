const { pool } = require('../../config/db');

const getAllDoctors = async () => {
    const [rows] = await pool.query(`
        SELECT d.id, u.name, u.email, u.phone, dep.name as department, u.status, d.consultation_fee
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN departments dep ON d.department_id = dep.id
    `);
    return rows;
};

module.exports = {
    getAllDoctors
};
