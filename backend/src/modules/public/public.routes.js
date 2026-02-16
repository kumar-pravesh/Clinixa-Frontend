const express = require('express');
const router = express.Router();
const adminService = require('../admin/admin.service');

/**
 * Public API Routes
 * These routes are used by the public-facing website (patient portal)
 * No authentication required
 */

// Get all departments (for homepage display)
router.get('/departments', async (req, res) => {
    try {
        const departments = await adminService.getDepartments();
        // Filter to only return active departments for public
        const activeDepartments = departments.filter(d => d.status === 'Active' || !d.status);
        res.json(activeDepartments);
    } catch (error) {
        console.error('Error fetching public departments:', error);
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
});

// Get all active doctors (for doctors page)
router.get('/doctors', async (req, res) => {
    try {
        const doctorService = require('../doctor/doctor.service');
        const doctors = await doctorService.getPublicDoctors();
        // Filter and map for frontend
        const activeDoctors = doctors
            .filter(d => d.status === 'Active')
            .map(d => ({
                ...d,
                experience: d.experience_years, // Map for frontend convenience
                specialization: d.dept // Ensure specialization is present
            }));
        res.json(activeDoctors);
    } catch (error) {
        console.error('Error fetching public doctors:', error);
        res.status(500).json({ message: 'Failed to fetch doctors' });
    }
});

module.exports = router;
