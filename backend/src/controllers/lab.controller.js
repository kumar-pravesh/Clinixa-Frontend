const labService = require('../services/lab.service');

const getTestQueue = async (req, res) => {
    try {
        const result = await labService.getTestQueue();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTestHistory = async (req, res) => {
    try {
        const result = await labService.getTestHistory();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await labService.updateTestStatus(req.params.id, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const uploadReport = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        let results = [];
        if (req.body.results) {
            try {
                results = typeof req.body.results === 'string' ? JSON.parse(req.body.results) : req.body.results;
            } catch (e) {
                console.warn('[LabController] Failed to parse results JSON:', e.message);
                results = [];
            }
        }

        const data = {
            ...req.body,
            file_path: `/uploads/reports/${req.file.filename}`,
            results
        };

        const result = await labService.uploadReport(data, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getReportById = async (req, res) => {
    try {
        const result = await labService.getReportById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Report not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientReports = async (req, res) => {
    try {
        const result = await labService.getPatientReports(req.params.patientId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTestQueue,
    getTestHistory,
    updateTestStatus,
    uploadReport,
    getReportById,
    getPatientReports
};
