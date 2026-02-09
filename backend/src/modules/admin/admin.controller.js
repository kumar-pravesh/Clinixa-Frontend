const adminService = require('./admin.service');

const createDoctor = async (req, res) => {
    try {
        const result = await adminService.createDoctor(req.body);
        res.status(201).json({ message: 'Doctor registered successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.updateDoctor(id, req.body);
        res.json({ message: 'Doctor updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await adminService.getPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await adminService.getAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTodaysAppointments = async (req, res) => {
    try {
        const appointments = await adminService.getTodaysAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await adminService.updateAppointmentStatus(id, status);
        res.json({ message: `Appointment ${status.toLowerCase()} successfully`, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const assignDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorId } = req.body;
        const result = await adminService.assignDoctor(id, doctorId);
        res.json({ message: 'Doctor assigned successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await adminService.getNotifications();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.markRead(id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createDoctor,
    updateDoctor,
    getDashboardStats,
    getPatients,
    getAppointments,
    getTodaysAppointments,
    updateAppointmentStatus,
    getNotifications,
    markRead,
    assignDoctor
};
