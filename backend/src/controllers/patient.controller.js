const patientService = require('../services/patient.service');

const getProfile = async (req, res) => {
    try {
        const result = await patientService.getProfile(req.user.id);
        if (!result) return res.status(404).json({ message: 'Profile not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const result = await patientService.getDashboardStats(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMedicalRecords = async (req, res) => {
    try {
        const result = await patientService.getMedicalRecords(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const result = await patientService.updateProfile(req.user.id, req.body);
        res.json({ message: 'Profile updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    getDashboardStats,
    getMedicalRecords,
    updateProfile
};
