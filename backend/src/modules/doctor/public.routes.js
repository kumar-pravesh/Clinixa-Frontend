/**
 * Public Doctor Routes
 * Available without authentication for patient booking and admin listing
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/db');

/**
 * GET /doctors
 * Get all doctors (for booking page and admin management)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name,
                u.email,
                u.phone,
                u.status,
                d.specialization as dept,
                d.experience_years,
                d.consultation_fee,
                d.qualification,
                dep.name as department_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE u.role = 'doctor'
            ORDER BY u.name
        `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

/**
 * GET /doctors/:id
 * Get single doctor details
 */
router.get('/:id', async (req, res) => {
  try {
    const doctorId = req.params.id.replace('DOC-', '');

    const [rows] = await pool.query(`
            SELECT 
                CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
                u.name,
                u.email,
                u.phone,
                u.status,
                d.specialization as dept,
                d.experience_years,
                d.consultation_fee,
                d.qualification,
                dep.name as department_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN departments dep ON d.department_id = dep.id
            WHERE d.id = ?
        `, [doctorId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
});

module.exports = router;
