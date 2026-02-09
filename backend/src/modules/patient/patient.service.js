const { pool } = require('../../config/db');

const getProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT u.name, u.email, p.dob, p.gender, p.phone 
     FROM users u 
     JOIN patients p ON u.id = p.user_id 
     WHERE u.id = ?`,
        [userId]
    );
    return rows[0];
};

module.exports = {
    getProfile,
};
