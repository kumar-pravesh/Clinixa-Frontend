const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const patientRoutes = require('./modules/patient/patient.routes');
const appointmentRoutes = require('./modules/appointment/appointment.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const doctorRoutes = require('./modules/doctor/doctor.routes');
const publicDoctorRoutes = require('./modules/doctor/public.routes');
const publicRoutes = require('./modules/public/public.routes');
const receptionistRoutes = require('./modules/receptionist/receptionist.routes');
const labRoutes = require('./modules/lab/lab.routes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================================
// PUBLIC API ROUTES (Public Website)
// ============================================
app.use('/api/public', publicRoutes);           // Public departments, doctors

// ============================================
// STAFF PORTAL API ROUTES
// ============================================
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
const adminService = require('./modules/admin/admin.service');
app.get('/departments', async (req, res) => {
    try {
        const rows = await adminService.getDepartments();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
});

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
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;

