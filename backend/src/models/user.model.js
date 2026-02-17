const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
    /**
     * Find a user by email
     * @param {string} email 
     * @returns {Promise<object|null>} User object or null
     */
    static async findByEmail(email) {
        const [rows] = await this.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }

    /**
     * Find a user by ID
     * @param {number} id 
     * @returns {Promise<object|null>} User object or null
     */
    static async findById(id) {
        const [rows] = await this.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }

    /**
     * Create a new user
     * @param {object} userData - { name, email, password_hash, role, status }
     * @param {object} connection - Optional connection for transaction
     * @returns {Promise<number>} - The new user ID
     */
    static async create(userData, connection) {
        const { name, email, phone, password_hash, role, status = 'Active' } = userData;
        const [result] = await this.query(
            'INSERT INTO users (name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, password_hash, role, status],
            connection
        );
        return result.insertId;
    }

    static async updateResetToken(id, token, expires) {
        const [result] = await this.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [token, expires, id]
        );
        return result;
    }

    static async confirmPasswordReset(id, passwordHash) {
        const [result] = await this.query(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [passwordHash, id]
        );
        return result;
    }
}

module.exports = UserModel;
