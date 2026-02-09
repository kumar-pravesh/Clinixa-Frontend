const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');


router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:id', adminController.updateDoctor);

module.exports = router;
