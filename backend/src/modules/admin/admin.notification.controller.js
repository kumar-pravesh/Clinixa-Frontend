/**
 * Admin Notification Controller
 * Handles notification retrieval and management for admin
 */
const { pool } = require('../../config/db');

const adminNotificationController = {
    /**
     * Get all notifications for admin
     */
    async getNotifications(req, res) {
        try {
            const [notifications] = await pool.query(`
                SELECT 
                    n.id,
                    n.type,
                    n.title,
                    n.message,
                    n.reference_id,
                    n.reference_type,
                    n.is_read,
                    n.created_at,
                    TIMESTAMPDIFF(MINUTE, n.created_at, NOW()) as minutes_ago
                FROM admin_notifications n
                ORDER BY n.created_at DESC
                LIMIT 50
            `);

            // Format the time
            const formattedNotifications = notifications.map(n => ({
                ...n,
                time: formatTimeAgo(n.minutes_ago),
                read: Boolean(n.is_read)
            }));

            res.json(formattedNotifications);
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Mark notification as read
     */
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await pool.query(
                'UPDATE admin_notifications SET is_read = 1 WHERE id = ?',
                [id]
            );
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(req, res) {
        try {
            await pool.query('UPDATE admin_notifications SET is_read = 1 WHERE is_read = 0');
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Clear/delete notification
     */
    async clearNotification(req, res) {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM admin_notifications WHERE id = ?', [id]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Get unread count
     */
    async getUnreadCount(req, res) {
        try {
            const [result] = await pool.query(
                'SELECT COUNT(*) as count FROM admin_notifications WHERE is_read = 0'
            );
            res.json({ count: result[0].count });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

/**
 * Helper function to format time ago
 */
function formatTimeAgo(minutes) {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Create notification helper (to be used by other services)
 */
async function createAdminNotification(type, title, message, referenceId = null, referenceType = null) {
    try {
        await pool.query(
            `INSERT INTO admin_notifications (type, title, message, reference_id, reference_type, is_read, created_at)
             VALUES (?, ?, ?, ?, ?, 0, NOW())`,
            [type, title, message, referenceId, referenceType]
        );
        console.log(`[Notification] Created admin notification: ${title}`);
    } catch (error) {
        console.error('[Notification] Failed to create admin notification:', error);
    }
}

module.exports = {
    ...adminNotificationController,
    createAdminNotification
};
