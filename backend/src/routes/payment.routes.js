const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.post('/initiate', paymentController.initiatePayment);
router.post('/confirm', paymentController.confirmPayment);

module.exports = router;
