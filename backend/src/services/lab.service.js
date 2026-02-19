const LabTestModel = require('../models/lab-test.model');
const LabModel = require('../models/lab.model'); // Lab Report Model

const labService = {
    /**
     * Get test queue (pending and in-progress tests)
     */
    async getTestQueue() {
        return LabTestModel.getQueue();
    },

    /**
     * Get test history (completed tests)
     */
    async getTestHistory(limit = 50) {
        return LabTestModel.getHistory(limit);
    },

    /**
     * Update test status
     */
    async updateTestStatus(testId, status) {
        if (!testId) throw new Error('Test ID is required');
        const numericId = testId.toString().replace('LAB-', '');
        await LabTestModel.updateStatus(numericId, status);
        return { success: true, status };
    },

    /**
     * Upload lab report
     */
    async uploadReport(data, uploadedBy) {
        const { lab_test_id, patient_id, doctor_id, test_name, results, notes, file_path } = data;

        // Strip formatted prefixes to get numeric IDs
        const numericTestId = lab_test_id ? lab_test_id.toString().replace(/^LAB-0*/i, '') : null;
        // patient_id comes formatted as PID-XXXX from the queue
        const numericPatientId = patient_id ? patient_id.toString().replace(/^PID-0*/i, '') : null;
        // doctor_id is already a raw numeric ID from the queue
        const numericDoctorId = doctor_id ? doctor_id.toString().replace(/^DOC-0*/i, '') : null;

        if (!numericPatientId) throw new Error('Patient ID is required for lab report upload');
        if (!numericDoctorId) throw new Error('Doctor ID is required for lab report upload');

        // Create Report
        const reportId = await LabModel.create({
            labTestId: numericTestId,
            patientId: numericPatientId,
            doctorId: numericDoctorId,
            uploadedBy,
            testName: test_name,
            filePath: file_path,
            results: typeof results === 'object' ? JSON.stringify(results) : results,
            notes
        });

        // Update test status if linked
        if (numericTestId) {
            await LabTestModel.updateStatus(numericTestId, 'Delivered');
        }

        return {
            id: reportId,
            report_id: `RPT-${String(reportId).padStart(4, '0')}`,
            status: 'Delivered'
        };
    },

    /**
     * Get report by ID
     */
    async getReportById(reportId) {
        const numericId = reportId.toString().replace('RPT-', '');
        const report = await LabModel.findById(numericId);

        if (!report) return null;

        if (typeof report.results === 'string') {
            try {
                report.results = JSON.parse(report.results);
            } catch (e) {
                report.results = [];
            }
        }
        return report;
    },

    /**
     * Get lab reports for a patient
     */
    async getPatientReports(patientId) {
        const numericId = patientId.toString().replace('PID-', '');
        return LabModel.findByPatientId(numericId);
    }
};

module.exports = labService;
