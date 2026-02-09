const appointmentService = require('./appointment.service');

const getDoctors = async (req, res) => {
    try {
        const doctors = await appointmentService.getDoctors();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;

        // Handle DOC- prefix if present
        const parsedDoctorId = doctorId.toString().replace('DOC-', '');

        const appointment = await appointmentService.createAppointment(req.user.id, parsedDoctorId, date, timeSlot);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAppointments(req.user.id);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDoctors,
    bookAppointment,
    getMyAppointments
};
