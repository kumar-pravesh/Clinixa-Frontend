const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const logger = require('./lib/logger');
const fs = require('fs');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Import routes
const authRoutes = require('./routes/auth.routes');
const staffAuthRoutes = require('./routes/staff-auth.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const doctorRoutes = require('./routes/doctor.routes');
const publicDoctorRoutes = require('./routes/doctor.public.routes');
const publicRoutes = require('./routes/public.routes');
const receptionistRoutes = require('./routes/receptionist.routes');
const labRoutes = require('./routes/lab.routes');
const notificationRoutes = require('./routes/notification.routes');
const otpAuthRoutes = require('./routes/otp-auth.routes');

const app = express();

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/reports', 'uploads/lab'];
uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`[App] Created missing directory: ${dir}`);
    }
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: logger.stream }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================================
// PUBLIC API ROUTES (Public Website)
// ============================================
app.use('/api/public', publicRoutes);           // Public departments, doctors

// ============================================
// STAFF PORTAL API ROUTES
// ============================================
app.use('/api/staff/auth', staffAuthRoutes);    // Staff authentication
app.use('/api/staff', notificationRoutes);      // Staff notifications
app.use('/api/staff/admin', adminRoutes);       // Admin module
app.use('/api/staff/receptionist', receptionistRoutes);  // Receptionist module
app.use('/api/staff/doctor', doctorRoutes);     // Doctor module
app.use('/api/staff/lab', labRoutes);           // Lab module

// ============================================
// SHARED ROUTES (Both Portals)
// ============================================
app.use('/auth', authRoutes);                   // Authentication
app.use('/patient', patientRoutes);             // Patient operations
app.use('/appointment', appointmentRoutes);     // Appointments
app.use('/payments', paymentRoutes);            // Payments
app.use('/auth', otpAuthRoutes);                // OTP Registration + JWT Forgot Password
app.use('/api', notificationRoutes);            // Shared notifications

// ============================================
// LEGACY ROUTES (Backward Compatibility)
// TODO: Remove these after frontend migration
// ============================================
app.use('/admin', adminRoutes);                 // Legacy admin routes
app.use('/doctor', doctorRoutes);               // Legacy doctor routes
app.use('/doctors', publicDoctorRoutes);        // Legacy public doctors
app.use('/receptionist', receptionistRoutes);   // Legacy receptionist routes
app.use('/lab', labRoutes);                     // Legacy lab routes

// Public Departments (Legacy - will be removed)
// Public Departments (Legacy - will be removed)
// Route removed as public-website uses /api/public/departments

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Clinixa Hospital Management System API',
        version: '1.0.0',
        status: 'running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;

// ─── Startup Initialization (runs after module load) ─────────
try {
    const { registerEventListeners } = require('./services/event-listeners');
    registerEventListeners();
} catch (error) {
    console.error('[App] Failed to register event listeners (non-fatal):', error.message);
}

try {
    const { startScheduler } = require('./services/scheduler/reminder.scheduler');
    startScheduler();
} catch (error) {
    console.error('[App] Failed to start reminder scheduler (non-fatal):', error.message);
}

