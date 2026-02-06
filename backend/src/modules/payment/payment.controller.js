const paymentService = require('./payment.service');

const initiate = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const result = await paymentService.initiatePayment(req.user.id, appointmentId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const confirm = async (req, res) => {
    try {
        const { paymentId, verificationData } = req.body;
        const result = await paymentService.confirmPayment(paymentId, verificationData);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    initiate,
    confirm
};
