const doctorService = require('../services/doctor.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.ip;
        const result = await doctorService.authenticateDoctor(email, password, ip);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await doctorService.getDoctorProfile(req.user.id);
        if (!result) return res.status(404).json({ message: 'Profile not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const result = await doctorService.getAppointments(req.user.doctorId);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in getAppointments:', error);
        res.status(500).json({ message: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        const result = await doctorService.getPatients(req.user.doctorId);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in getPatients:', error);
        res.status(500).json({ message: error.message });
    }
};

const searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);
        const result = await doctorService.searchPatients(query);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in searchPatients:', error);
        res.status(500).json({ message: error.message });
    }
};

const getPrescriptions = async (req, res) => {
    try {
        const result = await doctorService.getPrescriptions(req.user.doctorId);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in getPrescriptions:', error);
        res.status(500).json({ message: error.message });
    }
};

const getLabReports = async (req, res) => {
    try {
        const result = await doctorService.getLabReports(req.user.doctorId);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in getLabReports:', error);
        res.status(500).json({ message: error.message });
    }
};

const createPrescription = async (req, res) => {
    try {
        const result = await doctorService.createPrescription(req.user.doctorId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addMedicines = async (req, res) => {
    try {
        const result = await doctorService.addMedicines(req.user.doctorId, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const uploadLabReport = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const data = {
            patientId: req.body.patient_id,
            testName: req.body.test_name,
            filePath: `/uploads/reports/${req.file.filename}`
        };

        const result = await doctorService.uploadLabReport(req.user.doctorId, data);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const setFollowUp = async (req, res) => {
    try {
        const result = await doctorService.setFollowUp(req.user.doctorId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await doctorService.updateAppointmentStatus(req.user.doctorId, req.params.id, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Public endpoints
const getPublicDoctors = async (req, res) => {
    try {
        const result = await doctorService.getPublicDoctors();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicDoctorById = async (req, res) => {
    try {
        const result = await doctorService.getDoctorById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Doctor not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestLabTest = async (req, res) => {
    try {
        const result = await doctorService.requestLabTest(req.user.doctorId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    login,
    getProfile,
    getAppointments,
    getPatients,
    searchPatients,
    getPrescriptions,
    getLabReports,
    createPrescription,
    addMedicines,
    uploadLabReport,
    requestLabTest,
    setFollowUp,
    updateAppointmentStatus,
    getPublicDoctors,
    getPublicDoctorById
};
