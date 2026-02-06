const paymentService = require('./payment.service');

const initiate = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const result = await paymentService.initiatePayment(req.user.id, appointmentId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const confirm = async (req, res) => {
    try {
        const { paymentId, status } = req.body; // status: 'SUCCESS' | 'FAILED'
        const result = await paymentService.confirmPayment(paymentId, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    initiate,
    confirm
};
