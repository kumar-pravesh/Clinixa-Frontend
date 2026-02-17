const paymentService = require('../services/payment.service');

const initiatePayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const result = await paymentService.initiatePayment(req.user.id, appointmentId);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { paymentId, ...verificationData } = req.body;
        const result = await paymentService.confirmPayment(paymentId, verificationData);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    initiatePayment,
    confirmPayment
};
