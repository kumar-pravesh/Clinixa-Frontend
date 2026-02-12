const doctorService = require('./doctor.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const data = await doctorService.authenticateDoctor(email, password, ip);
        res.json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const profile = await doctorService.getDoctorProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await doctorService.getAppointments(req.user.doctorId);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await doctorService.getPatients(req.user.doctorId);
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPrescriptions = async (req, res) => {
    try {
        // Can filter by appointmentId if query param exists
        const appointmentId = req.params.appointmentId || req.query.appointmentId;
        const prescriptions = await doctorService.getPrescriptions(req.user.doctorId, appointmentId);
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLabReports = async (req, res) => {
    try {
        const reports = await doctorService.getLabReports(req.user.doctorId);
        res.json(reports);
    } catch (error) {
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
        if (!req.file) throw new Error('No file uploaded');

        const data = {
            patientId: req.body.patientId,
            testName: req.body.testName,
            filePath: req.file.path
        };

        // Basic validation
        if (!data.patientId || !data.testName) {
            throw new Error('Patient ID and Test Name are required');
        }

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

module.exports = {
    login,
    getProfile,
    getAppointments,
    getPatients,
    getPrescriptions,
    getLabReports,
    createPrescription,
    addMedicines,
    uploadLabReport,
    setFollowUp,
    updateAppointmentStatus
};
