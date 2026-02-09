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

module.exports = {
    createDoctor,
    updateDoctor
};
