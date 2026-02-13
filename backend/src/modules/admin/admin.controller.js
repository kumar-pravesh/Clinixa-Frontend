/**
 * Admin Controller
 * Handles HTTP requests for admin operations
 */
const adminService = require('./admin.service');

const adminController = {
    // Doctor Management
    async getAllDoctors(req, res) {
        try {
            const doctors = await adminService.getAllDoctors();
            res.json(doctors);
        } catch (error) {
            console.error('[AdminController Error] getAllDoctors:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async createDoctor(req, res) {
        try {
            const doctorData = { ...req.body };
            if (req.file) {
                doctorData.image_url = req.file.path.replace(/\\/g, '/'); // Normalize path for web
            }
            const result = await adminService.createDoctor(doctorData);
            res.status(201).json({ message: 'Doctor registered successfully', data: result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDoctor(req, res) {
        try {
            const updateData = { ...req.body };
            if (req.file) {
                updateData.image_url = req.file.path.replace(/\\/g, '/');
            }
            const result = await adminService.updateDoctor(req.params.id, updateData);
            res.json({ message: 'Doctor updated successfully', data: result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDoctor(req, res) {
        try {
            await adminService.deleteDoctor(req.params.id);
            res.json({ message: 'Doctor deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Department Management
    async getDepartments(req, res) {
        try {
            const departments = await adminService.getDepartments();
            res.json(departments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createDepartment(req, res) {
        try {
            const result = await adminService.createDepartment(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDepartment(req, res) {
        try {
            const result = await adminService.updateDepartment(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDepartment(req, res) {
        try {
            await adminService.deleteDepartment(req.params.id);
            res.json({ message: 'Department deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Patient Management
    async getPatients(req, res) {
        try {
            const { search, limit } = req.query;
            const patients = await adminService.getPatients(search, parseInt(limit) || 100);
            res.json(patients);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Appointment Management
    async getAppointments(req, res) {
        try {
            const { date, status, doctor_id, limit } = req.query;
            const appointments = await adminService.getAppointments({
                date, status, doctor_id, limit: parseInt(limit) || 100
            });
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async approveAppointment(req, res) {
        try {
            const result = await adminService.approveAppointment(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async rejectAppointment(req, res) {
        try {
            const result = await adminService.rejectAppointment(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateAppointmentStatus(req, res) {
        try {
            const { status } = req.body;
            const result = await adminService.updateAppointmentStatus(req.params.id, status);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getInvoices(req, res) {
        try {
            const { limit } = req.query;
            const invoices = await adminService.getInvoices(parseInt(limit) || 100);
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Dashboard
    async getDashboardSummary(req, res) {
        try {
            const summary = await adminService.getDashboardSummary();
            res.json(summary);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = adminController;
