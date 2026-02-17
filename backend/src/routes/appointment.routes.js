const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken); // Patient protected routes

router.post('/book', appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getAppointments);
router.get('/availability', appointmentController.getAvailability);

module.exports = router;
