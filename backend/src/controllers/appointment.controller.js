const appointmentService = require('../services/appointment.service');

const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;
        const result = await appointmentService.createAppointment(req.user.id, doctorId, date, timeSlot);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const result = await appointmentService.getAppointments(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailability = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) {
            return res.status(400).json({ message: 'doctorId and date are required' });
        }
        const result = await appointmentService.getAvailability(doctorId, date);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAvailability
};
