const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

// Public Doctor Routes (No Auth)
router.get('/', doctorController.getPublicDoctors);
router.get('/:id', doctorController.getPublicDoctorById);

module.exports = router;
