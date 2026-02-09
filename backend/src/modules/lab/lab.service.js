/**
 * Lab Technician Service
 * Database operations for lab module
 */
const { pool } = require('../../config/db');
const path = require('path');
const fs = require('fs');

const labService = {
  /**
   * Get test queue (pending and in-progress tests)
   */
  async getTestQueue() {
    const [rows] = await pool.query(`
            SELECT 
                lt.id,
                CONCAT('LAB-', LPAD(lt.id, 4, '0')) as test_id,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                u.name as doctor,
                lt.test_name as testType,
                lt.priority,
                lt.status,
                lt.category,
                lt.department,
                DATE_FORMAT(lt.created_at, '%h:%i %p') as time,
                DATE_FORMAT(lt.created_at, '%Y-%m-%d') as date
            FROM lab_tests lt
            JOIN patients p ON lt.patient_id = p.id
            JOIN doctors d ON lt.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE lt.status IN ('Pending', 'In Progress')
            ORDER BY 
                CASE lt.priority WHEN 'STAT' THEN 1 WHEN 'Urgent' THEN 2 ELSE 3 END,
                lt.created_at ASC
        `);
    return rows;
  },

  /**
   * Get test history (completed tests)
   */
  async getTestHistory(limit = 50) {
    const [rows] = await pool.query(`
            SELECT 
                lt.id,
                CONCAT('LAB-', LPAD(lt.id, 4, '0')) as test_id,
                p.name as patient,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                du.name as doctor,
                lt.test_name as testType,
                lt.priority,
                lt.status,
                lt.category,
                DATE_FORMAT(lt.updated_at, '%Y-%m-%d') as completedDate,
                DATE_FORMAT(lt.updated_at, '%h:%i %p') as completedTime,
                lr.id as report_id,
                lr.file_url,
                tu.name as technician
            FROM lab_tests lt
            JOIN patients p ON lt.patient_id = p.id
            JOIN doctors d ON lt.doctor_id = d.id
            JOIN users du ON d.user_id = du.id
            LEFT JOIN lab_reports lr ON lr.lab_test_id = lt.id
            LEFT JOIN users tu ON lr.uploaded_by = tu.id
            WHERE lt.status IN ('Completed', 'Delivered')
            ORDER BY lt.updated_at DESC
            LIMIT ?
        `, [limit]);
    return rows;
  },

  /**
   * Update test status
   */
  async updateTestStatus(testId, status) {
    const numericId = testId.toString().replace('LAB-', '');

    await pool.query(`
            UPDATE lab_tests SET status = ?, updated_at = NOW()
            WHERE id = ?
        `, [status, numericId]);

    return { success: true, status };
  },

  /**
   * Upload lab report
   */
  async uploadReport(data, uploadedBy) {
    const { lab_test_id, patient_id, doctor_id, test_name, results, notes, file_path } = data;

    const numericTestId = lab_test_id ? lab_test_id.toString().replace('LAB-', '') : null;
    const numericPatientId = patient_id.toString().replace('PID-', '');
    const numericDoctorId = doctor_id.toString().replace('DOC-', '');

    // Insert lab report
    const [result] = await pool.query(`
            INSERT INTO lab_reports (
                lab_test_id, patient_id, doctor_id, uploaded_by,
                test_name, file_url, results, notes, report_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
        `, [
      numericTestId, numericPatientId, numericDoctorId, uploadedBy,
      test_name, file_path, JSON.stringify(results || []), notes
    ]);

    // Update test status if linked to a test
    if (numericTestId) {
      await pool.query(`
                UPDATE lab_tests SET status = 'Delivered', updated_at = NOW()
                WHERE id = ?
            `, [numericTestId]);
    }

    return {
      id: result.insertId,
      report_id: `RPT-${String(result.insertId).padStart(4, '0')}`,
      status: 'Delivered'
    };
  },

  /**
   * Get report by ID
   */
  async getReportById(reportId) {
    const numericId = reportId.toString().replace('RPT-', '');

    const [rows] = await pool.query(`
            SELECT 
                lr.id,
                CONCAT('RPT-', LPAD(lr.id, 4, '0')) as report_id,
                lr.test_name,
                lr.file_url,
                lr.results,
                lr.notes,
                lr.report_date,
                p.name as patient_name,
                CONCAT('PID-', LPAD(p.id, 4, '0')) as patient_id,
                u.name as doctor_name,
                tu.name as technician_name
            FROM lab_reports lr
            JOIN patients p ON lr.patient_id = p.id
            JOIN doctors d ON lr.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN users tu ON lr.uploaded_by = tu.id
            WHERE lr.id = ?
        `, [numericId]);

    if (rows.length === 0) return null;

    const report = rows[0];
    if (report.results) {
      report.results = JSON.parse(report.results);
    }
    return report;
  },

  /**
   * Get lab reports for a patient
   */
  async getPatientReports(patientId) {
    const numericId = patientId.toString().replace('PID-', '');

    const [rows] = await pool.query(`
            SELECT 
                CONCAT('RPT-', LPAD(lr.id, 4, '0')) as report_id,
                lr.test_name,
                lr.file_url,
                lr.report_date,
                u.name as doctor_name
            FROM lab_reports lr
            JOIN doctors d ON lr.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE lr.patient_id = ?
            ORDER BY lr.report_date DESC
        `, [numericId]);

    return rows;
  }
};

module.exports = labService;
