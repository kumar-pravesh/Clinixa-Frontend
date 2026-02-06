const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.get('/profile', authenticateToken, patientController.getProfile);

module.exports = router;
