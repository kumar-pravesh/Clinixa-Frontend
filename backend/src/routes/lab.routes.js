const express = require('express');
const router = express.Router();
const labController = require('../controllers/lab.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/reports/');
    },
    filename: (req, file, cb) => {
        cb(null, 'lab-report-' + Date.now() + path.extname(file.originalname));
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

// Middleware for all routes: Authenticated Lab Tech
// Note: Some routes might be accessible by Doctors too (like viewing reports), 
// but this specific router is for Lab Module workflow.
// Doctor routes handle their own report viewing using DoctorService.
router.use(authenticateToken);
router.use(authorizeRoles('lab_technician', 'admin'));

// Test Queue & History
router.get('/tests/queue', labController.getTestQueue);
router.get('/tests/history', labController.getTestHistory);
router.put('/tests/:id/status', labController.updateTestStatus);

// Reports
router.post('/reports/upload', upload.single('file'), labController.uploadReport);
router.get('/reports/:id', labController.getReportById);
router.get('/patients/:patientId/reports', labController.getPatientReports);

module.exports = router;
