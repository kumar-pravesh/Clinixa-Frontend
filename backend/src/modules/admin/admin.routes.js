const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');


router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:id', adminController.updateDoctor);

router.get('/stats', adminController.getDashboardStats);
router.get('/patients', adminController.getPatients);
router.get('/appointments', adminController.getAppointments);
router.get('/appointments/today', adminController.getTodaysAppointments);
router.patch('/appointments/:id/status', adminController.updateAppointmentStatus);
router.patch('/appointments/:id/assign', adminController.assignDoctor);
router.get('/notifications', adminController.getNotifications);
router.patch('/notifications/:id/read', adminController.markRead);

module.exports = router;
