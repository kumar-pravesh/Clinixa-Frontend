/**
 * Lab Technician Routes
 * All routes require authentication with lab_tech or admin role
 */
const express = require('express');
const router = express.Router();
const labController = require('./lab.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads/lab');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('lab_tech', 'admin', 'doctor'));

// Test queue
router.get('/queue', labController.getTestQueue);
router.put('/queue/:id/status', labController.updateTestStatus);

// Reports
router.post('/reports', upload.single('file'), labController.uploadReport);
router.get('/reports/:id', labController.getReportById);
router.get('/history', labController.getTestHistory);

// Patient reports (for doctors to view)
router.get('/patient/:patientId/reports', labController.getPatientReports);

module.exports = router;
