const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.get('/dashboard-stats', patientController.getDashboardStats);
router.get('/medical-records', patientController.getMedicalRecords);

module.exports = router;
