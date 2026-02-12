/**
 * Admin Routes
 * All routes require authentication with admin role
 */
const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const adminNotificationController = require('./admin.notification.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardSummary);

// Doctor Management
router.get('/doctors', adminController.getAllDoctors);
router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:id', adminController.updateDoctor);
router.delete('/doctors/:id', adminController.deleteDoctor);

// Department Management
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.put('/departments/:id', adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Patient Management
router.get('/patients', adminController.getPatients);

// Billing Management
router.get('/invoices', adminController.getInvoices);

// Appointment Management
router.get('/appointments', adminController.getAppointments);
router.put('/appointments/:id/approve', adminController.approveAppointment);
router.put('/appointments/:id/reject', adminController.rejectAppointment);
router.put('/appointments/:id/status', adminController.updateAppointmentStatus);

// Notification Management
router.get('/notifications', adminNotificationController.getNotifications);
router.put('/notifications/:id/read', adminNotificationController.markAsRead);
router.put('/notifications/read-all', adminNotificationController.markAllAsRead);
router.delete('/notifications/:id', adminNotificationController.clearNotification);
router.get('/notifications/unread-count', adminNotificationController.getUnreadCount);

module.exports = router;

