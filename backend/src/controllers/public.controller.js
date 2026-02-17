const adminService = require('../services/admin.service');
const doctorService = require('../services/doctor.service');

const getDepartments = async (req, res) => {
    try {
        const departments = await adminService.getDepartments();
        // Filter to only return active departments for public
        const activeDepartments = departments.filter(d => d.status === 'Active' || !d.status);
        res.json(activeDepartments);
    } catch (error) {
        console.error('❌ Error fetching public departments:', error);
        res.status(500).json({
            message: 'Failed to fetch departments',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getDoctors = async (req, res) => {
    try {
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
        console.error('❌ Error fetching public doctors:', error);
        res.status(500).json({
            message: 'Failed to fetch doctors',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardSummary();
        res.json({
            accuracy: "99%", // Success rate can be calculated or static for now
            support: "24/7",
            doctors: `${stats.doctors}+`,
            transformations: `${stats.patients}+`,
            raw: stats
        });
    } catch (error) {
        console.error('❌ Error fetching public stats:', error);
        res.status(500).json({ message: 'Failed to fetch clinical metrics' });
    }
};

module.exports = {
    getDepartments,
    getDoctors,
    getStats
};
