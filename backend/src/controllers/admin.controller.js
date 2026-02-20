const adminService = require('../services/admin.service');

// Doctors
const createDoctor = async (req, res) => {
    try {
        const doctorData = { ...req.body };
        if (req.file) {
            doctorData.image_url = req.file.path.replace(/\\/g, '/');
        }
        const result = await adminService.createDoctor(doctorData);
        res.status(201).json({ data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const result = await adminService.getAllDoctors();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        }
        const result = await adminService.updateDoctor(req.params.id, updateData);
        res.json({ data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        await adminService.deleteDoctor(req.params.id);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Departments
const getDepartments = async (req, res) => {
    try {
        const result = await adminService.getDepartments();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const deptData = { ...req.body };
        if (req.file) {
            deptData.image_url = req.file.path.replace(/\\/g, '/');
        }
        const result = await adminService.createDepartment(deptData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        }
        const result = await adminService.updateDepartment(req.params.id, updateData);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        await adminService.deleteDepartment(req.params.id);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Overview & Management
const getPatients = async (req, res) => {
    try {
        const { search, limit } = req.query;
        const result = await adminService.getPatients(search, parseInt(limit) || 100);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        await adminService.deletePatient(req.params.id);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const result = await adminService.getAppointments(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveAppointment = async (req, res) => {
    try {
        const result = await adminService.approveAppointment(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const rejectAppointment = async (req, res) => {
    try {
        const result = await adminService.rejectAppointment(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDashboardSummary = async (req, res) => {
    try {
        const result = await adminService.getDashboardSummary();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInvoices = async (req, res) => {
    try {
        const result = await adminService.getInvoices();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInvoiceStatus = async (req, res) => {
    try {
        const result = await adminService.updateInvoiceStatus(req.params.id, req.body.status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getPatients,
    deletePatient,
    getAppointments,
    approveAppointment,
    rejectAppointment,
    getDashboardSummary,
    getInvoices,
    updateInvoiceStatus
};
