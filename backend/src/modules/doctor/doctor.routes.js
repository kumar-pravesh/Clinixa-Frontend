const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');

router.get('/', doctorController.getAllDoctors);

module.exports = router;
