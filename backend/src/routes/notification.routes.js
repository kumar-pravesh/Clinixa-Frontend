const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/notifications', authenticateToken, authorizeRoles('admin', 'doctor', 'receptionist', 'lab_technician', 'patient'), notificationController.getNotifications);
router.patch('/notifications/:id/read', authenticateToken, notificationController.markAsRead);
router.patch('/notifications/read-all', authenticateToken, notificationController.markAllAsRead);

module.exports = router;
