const patientService = require('./patient.service');

const getProfile = async (req, res) => {
    try {
        const profile = await patientService.getProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
};
