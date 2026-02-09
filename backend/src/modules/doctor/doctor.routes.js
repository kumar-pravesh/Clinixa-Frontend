const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const upload = require('../../config/multer.config');

// Public route
router.post('/login', doctorController.login);

// Protected routes (Require Login)
router.use(authenticateToken);

// Core Doctor Data
router.get('/profile', doctorController.getProfile);
router.get('/appointments', doctorController.getAppointments);
router.get('/patients', doctorController.getPatients);

// Prescriptions & Medicines
router.get('/prescriptions', doctorController.getPrescriptions);
router.get('/prescriptions/:appointmentId', doctorController.getPrescriptions);
router.post('/prescriptions', doctorController.createPrescription);
router.post('/medicines', doctorController.addMedicines);

// Lab Reports
router.post('/lab-reports', upload.single('reportFile'), doctorController.uploadLabReport);

// Follow-up
router.post('/follow-up', doctorController.setFollowUp);

module.exports = router;
