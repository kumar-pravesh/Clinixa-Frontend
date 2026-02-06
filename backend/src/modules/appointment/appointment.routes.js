const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.get('/doctors', appointmentController.getDoctors); // Public or Protected? User said "View doctors (read-only)". Usually public.
router.post('/book', authenticateToken, appointmentController.bookAppointment);
router.get('/my-appointments', authenticateToken, appointmentController.getMyAppointments);

module.exports = router;
