const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// File Upload Configuration for Doctor Profile Pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'doctor-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only JPG, PNG and WEBP files are allowed!'));
    }
});

// Middleware for all routes: Authenticated Admin
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Doctors
router.get('/doctors', adminController.getAllDoctors);
router.post('/doctors', upload.single('image'), adminController.createDoctor);
router.put('/doctors/:id', upload.single('image'), adminController.updateDoctor);
router.delete('/doctors/:id', adminController.deleteDoctor);

// Departments
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.put('/departments/:id', adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Patients
router.get('/patients', adminController.getPatients);

// Appointments
router.get('/appointments', adminController.getAppointments);
router.put('/appointments/:id/approve', adminController.approveAppointment);
router.put('/appointments/:id/reject', adminController.rejectAppointment);

// Dashboard & Finance
router.get('/dashboard', adminController.getDashboardSummary);
router.get('/invoices', adminController.getInvoices);
router.put('/invoices/:id/status', adminController.updateInvoiceStatus);

module.exports = router;
