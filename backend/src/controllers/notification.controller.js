const notificationService = require('../services/notification.service');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        const notifications = await notificationService.getPollNotifications(role, userId);

        res.json({
            success: true,
            notifications,
            count: notifications.length
        });
    } catch (error) {
        console.error('[Notifications] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
