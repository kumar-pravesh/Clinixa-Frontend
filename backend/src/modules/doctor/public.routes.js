const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');

/**
 * GET /doctors
 * Get all doctors (for booking page and admin management)
 */
router.get('/', async (req, res) => {
  try {
    const rows = await doctorService.getPublicDoctors();
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
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
});

module.exports = router;
