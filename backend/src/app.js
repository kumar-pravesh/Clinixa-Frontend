const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const patientRoutes = require('./modules/patient/patient.routes');
const appointmentRoutes = require('./modules/appointment/appointment.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
// const medicalRoutes = require('./modules/medical/medical.routes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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
app.use('/admin', require('./modules/admin/admin.routes'));
app.use('/doctors', require('./modules/doctor/doctor.routes'));
// app.use('/medical', medicalRoutes);

app.get('/', (req, res) => {
    res.send('Hospital Management System API');
});

module.exports = app;
