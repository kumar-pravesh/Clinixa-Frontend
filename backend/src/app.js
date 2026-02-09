const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const patientRoutes = require('./modules/patient/patient.routes');
const appointmentRoutes = require('./modules/appointment/appointment.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const doctorRoutes = require('./modules/doctor/doctor.routes');
const publicDoctorRoutes = require('./modules/doctor/public.routes');
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

// Routes
app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/doctors', publicDoctorRoutes);       // Public doctors list
app.use('/receptionist', receptionistRoutes);  // Receptionist module
app.use('/lab', labRoutes);                    // Lab technician module

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

