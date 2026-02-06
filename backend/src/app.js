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
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/payment', paymentRoutes);
// app.use('/medical', medicalRoutes);

app.get('/', (req, res) => {
    res.send('Hospital Management System API');
});

module.exports = app;
