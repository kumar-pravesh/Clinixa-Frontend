const BaseModel = require('./BaseModel');

class NotificationModel extends BaseModel {
    static async create(data) {
        const { userId, type, title, message, link } = data;
        const [result] = await this.query(
            'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
            [userId, type || 'info', title, message, link || null]
        );
        return result.insertId;
    }

    static async findByUserId(userId, limit = 20) {
        const [rows] = await this.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [userId, limit]
        );
        return rows;
    }

    static async markAsRead(id, userId) {
        const [result] = await this.query(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }

    static async markAllAsRead(userId) {
        const [result] = await this.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );
        return result.affectedRows;
    }
}

module.exports = NotificationModel;
