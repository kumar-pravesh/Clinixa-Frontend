const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/reports/');
    },
    filename: (req, file, cb) => {
        cb(null, 'report-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, JPG, and PNG files are allowed!'));
    }
});

// Auth Routes
router.post('/login', doctorController.login);

// Protected Staff Routes
router.get('/profile', authenticateToken, authorizeRoles('doctor'), doctorController.getProfile);
router.get('/appointments', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.getAppointments);
router.get('/patients', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.getPatients);
router.get('/patients/search', authenticateToken, authorizeRoles('doctor'), doctorController.searchPatients);
router.get('/prescriptions', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.getPrescriptions);
router.post('/prescriptions', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.createPrescription);
router.post('/prescriptions/add-medicines', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.addMedicines);
router.get('/lab-reports', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.getLabReports);
router.post('/lab-reports', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), upload.single('file'), doctorController.uploadLabReport);
router.post('/lab-tests/request', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.requestLabTest);
router.post('/appointments/follow-up', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.setFollowUp);
router.put('/appointments/:id/status', authenticateToken, authorizeRoles('doctor', 'receptionist', 'lab_technician', 'admin'), doctorController.updateAppointmentStatus);

// Public Routes (Legacy but used by Public Website)
// Note: These might be better in a public.routes.js but keeping here for now to mirror old structure
// Adjusting paths for public usage if mounted at /api/public/doctors or similar
// But app.js mounts this at /api/staff/doctor AND /doctor. 
// Public website calls /doctors (plural).
// app.js: app.use('/doctors', publicDoctorRoutes);
// So I should create public.routes.js too or handle it here?
// I'll stick to what I have for Staff Doctor.
// The public routes are handled separately in `public.routes.js` or `doctor/public.routes.js` (Legacy).

module.exports = router;
