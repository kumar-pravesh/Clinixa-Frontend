/**
 * Lab Technician Controller
 * Handles HTTP requests for lab operations
 */
const labService = require('./lab.service');
const path = require('path');

const labController = {
  /**
   * Get test queue
   * GET /lab/queue
   */
  async getTestQueue(req, res) {
    try {
      const tests = await labService.getTestQueue();
      res.json(tests);
    } catch (error) {
      console.error('Error fetching test queue:', error);
      res.status(500).json({ message: 'Failed to fetch test queue', error: error.message });
    }
  },

  /**
   * Get test history
   * GET /lab/history
   */
  async getTestHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const tests = await labService.getTestHistory(limit);
      res.json(tests);
    } catch (error) {
      console.error('Error fetching test history:', error);
      res.status(500).json({ message: 'Failed to fetch test history', error: error.message });
    }
  },

  /**
   * Update test status
   * PUT /lab/queue/:id/status
   */
  async updateTestStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      const result = await labService.updateTestStatus(req.params.id, status);
      res.json(result);
    } catch (error) {
      console.error('Error updating test status:', error);
      res.status(500).json({ message: 'Failed to update test status', error: error.message });
    }
  },

  /**
   * Upload lab report
   * POST /lab/reports
   */
  async uploadReport(req, res) {
    try {
      const { lab_test_id, patient_id, doctor_id, test_name, results, notes } = req.body;

      if (!patient_id || !doctor_id || !test_name) {
        return res.status(400).json({
          message: 'patient_id, doctor_id, and test_name are required'
        });
      }

      // Handle file upload
      let file_path = null;
      if (req.file) {
        file_path = `/uploads/lab/${req.file.filename}`;
      }

      const report = await labService.uploadReport({
        lab_test_id,
        patient_id,
        doctor_id,
        test_name,
        results: results ? JSON.parse(results) : [],
        notes,
        file_path
      }, req.user.id);

      res.status(201).json(report);
    } catch (error) {
      console.error('Error uploading report:', error);
      res.status(500).json({ message: 'Failed to upload report', error: error.message });
    }
  },

  /**
   * Get report by ID
   * GET /lab/reports/:id
   */
  async getReportById(req, res) {
    try {
      const report = await labService.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: 'Failed to fetch report', error: error.message });
    }
  },

  /**
   * Get patient reports
   * GET /lab/patient/:patientId/reports
   */
  async getPatientReports(req, res) {
    try {
      const reports = await labService.getPatientReports(req.params.patientId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      res.status(500).json({ message: 'Failed to fetch patient reports', error: error.message });
    }
  }
};

module.exports = labController;
