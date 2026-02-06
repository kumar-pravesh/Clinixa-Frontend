const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.post('/initiate', authenticateToken, paymentController.initiate);
router.post('/confirm', authenticateToken, paymentController.confirm);

module.exports = router;
