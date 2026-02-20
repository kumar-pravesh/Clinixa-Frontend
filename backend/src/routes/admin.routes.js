const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const fs = require('fs');

// Image filter helper
const imageFilter = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    if (filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase())) {
        return cb(null, true);
    }
    cb(new Error('Only JPG, PNG and WEBP files are allowed!'));
};

// File Upload Configuration for Doctor Profile Pictures
const doctorStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/doctors';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'doctor-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: doctorStorage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: imageFilter });

// File Upload Configuration for Department Images
const deptStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/departments';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'dept-' + Date.now() + path.extname(file.originalname));
    }
});
const uploadDept = multer({ storage: deptStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });

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
router.post('/departments', uploadDept.single('image'), adminController.createDepartment);
router.put('/departments/:id', uploadDept.single('image'), adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Patients
router.get('/patients', adminController.getPatients);
router.delete('/patients/:id', adminController.deletePatient);


// Appointments
router.get('/appointments', adminController.getAppointments);
router.put('/appointments/:id/approve', adminController.approveAppointment);
router.put('/appointments/:id/reject', adminController.rejectAppointment);

// Dashboard & Finance
router.get('/dashboard', adminController.getDashboardSummary);
router.get('/invoices', adminController.getInvoices);
router.put('/invoices/:id/status', adminController.updateInvoiceStatus);

module.exports = router;
