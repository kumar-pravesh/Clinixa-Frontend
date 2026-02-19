const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DoctorModel = require('../models/doctor.model');
const UserModel = require('../models/user.model');
const AppointmentModel = require('../models/appointment.model');
const PatientModel = require('../models/patient.model');
const PrescriptionModel = require('../models/prescription.model');
const LabModel = require('../models/lab.model');
const LabTestModel = require('../models/lab-test.model');

// Helper to generate tokens
const generateTokens = (user, doctorId) => {
    const accessToken = jwt.sign(
        { id: user.id, role: 'doctor', name: user.name, doctorId: doctorId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return { accessToken };
};

const authenticateDoctor = async (email, password, ip) => {
    // We can't use UserModel.findByEmail here because we need to filter by role='doctor' 
    // and ensuring we get user data. UserModel.findByEmail returns user logic is same.
    // Logic: verify user, verify role, verify password, verify doctor profile exists.

    // 1. Get User
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    if (user.role !== 'doctor') throw new Error('Invalid credentials'); // security through obscurity

    // Check Status
    if (user.status === 'Inactive') throw new Error('Account is inactive. Please contact admin.');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid credentials');

    // 2. Get Doctor Profile
    const doctor = await DoctorModel.findByUserId(user.id);
    if (!doctor) throw new Error('Doctor profile not found');

    // Log login
    await DoctorModel.logLogin(doctor.id, ip);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'doctor',
            status: user.status,
            doctorId: doctor.id
        },
        ...generateTokens(user, doctor.id)
    };
};

const getDoctorProfile = async (userId) => {
    return DoctorModel.getProfile(userId);
};

const getAppointments = async (doctorId) => {
    return AppointmentModel.findByDoctorId(doctorId);
};

const getPatients = async (doctorId) => {
    return DoctorModel.getPatientsByDoctorId(doctorId);
};

const searchPatients = async (query) => {
    return PatientModel.findAll(query);
};

const getPrescriptions = async (doctorId) => {
    return PrescriptionModel.findByDoctorId(doctorId);
};

const getLabReports = async (doctorId) => {
    return LabModel.findByDoctorId(doctorId);
};

const doctorService = require('../services/notification.service'); // Wait, naming conflict with doctorService! 
// Actually, it's notificationService. Let's use it correctly.
const notificationService = require('./notification.service');

const createPrescription = async (doctorId, data) => {
    const { patientId, medications } = data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const prescriptionId = await PrescriptionModel.create({
            doctorId,
            patientId,
            date: new Date()
        }, connection);

        if (medications && medications.length > 0) {
            const values = medications.map(m => [prescriptionId, m.name, m.dosage, m.frequency, m.duration]);
            await PrescriptionModel.addItems(values, connection);
        }

        await connection.commit();

        // Create persistent notification for the doctor
        const doctor = await DoctorModel.findById(doctorId);
        if (doctor) {
            await notificationService.createNotification(doctor.user_id, {
                type: 'success',
                title: 'Prescription Issued',
                message: `You successfully issued a prescription (ID: ${prescriptionId})`,
                link: `/doctor/prescriptions`
            });
        }

        return { id: prescriptionId, message: 'Prescription created successfully' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const addMedicines = async (doctorId, data) => {
    const { prescriptionId, medications } = data;

    // Verify ownership
    const pres = await PrescriptionModel.findByIdAndDoctor(prescriptionId, doctorId);
    if (!pres) throw new Error('Prescription not found or unauthorized');

    if (medications && medications.length > 0) {
        const values = medications.map(m => [prescriptionId, m.name, m.dosage, m.frequency, m.duration]);
        await PrescriptionModel.addItems(values);
    }
    return { message: 'Medicines added successfully' };
};

const uploadLabReport = async (doctorId, data) => {
    const { patientId, testName, filePath } = data;
    const reportId = await LabModel.create({
        doctorId,
        patientId,
        testName,
        filePath,
        date: new Date()
    });

    const doctor = await DoctorModel.findById(doctorId);
    if (doctor) {
        await notificationService.createNotification(doctor.user_id, {
            type: 'lab',
            title: 'Report Uploaded',
            message: `Lab report for ${testName} uploaded successfully.`,
            link: `/doctor/lab-reports`
        });
    }

    return { id: reportId, message: 'Report uploaded successfully' };
};

const setFollowUp = async (doctorId, data) => {
    const { patientId, date, time, type } = data;
    const id = await AppointmentModel.create({
        doctorId,
        patientId,
        date,
        time,
        type: type || 'Follow-up',
        status: 'Scheduled'
    });

    const doctor = await DoctorModel.findById(doctorId);
    if (doctor) {
        await notificationService.createNotification(doctor.user_id, {
            type: 'appointment',
            title: 'Appointment Set',
            message: `New ${type || 'Follow-up'} scheduled for ${date} at ${time}`,
            link: `/doctor/appointments`
        });
    }

    return { id, message: 'Appointment set successfully' };
};

const updateAppointmentStatus = async (doctorId, appointmentId, status) => {
    const appt = await AppointmentModel.findByIdAndDoctor(appointmentId, doctorId);
    if (!appt) throw new Error('Appointment not found or unauthorized');

    await AppointmentModel.updateStatus(appointmentId, status);

    const doctor = await DoctorModel.findById(doctorId);
    if (doctor) {
        await notificationService.createNotification(doctor.user_id, {
            type: 'info',
            title: 'Appointment Updated',
            message: `Appointment status updated to ${status}`,
            link: `/doctor/appointments`
        });
    }

    return { message: 'Appointment status updated' };
};

const requestLabTest = async (doctorId, data) => {
    const { patientId, testName, category, priority, notes } = data;

    const doctor = await DoctorModel.findById(doctorId);

    const testId = await LabTestModel.create({
        patient_id: patientId,
        doctor_id: doctorId,
        test_name: testName,
        category,
        department: doctor?.specialization || null,
        priority: priority || 'Routine',
        notes
    });

    if (doctor) {
        await notificationService.createNotification(doctor.user_id, {
            type: 'lab',
            title: 'Lab Test Ordered',
            message: `You ordered ${testName} (ID: LAB-${String(testId).padStart(4, '0')})`,
            link: `/doctor/lab-reports`
        });
    }

    return { id: testId, message: 'Lab test ordered successfully' };
};

const getPublicDoctors = async () => {
    return DoctorModel.getPublicDoctors();
};

const getDoctorById = async (doctorId) => {
    const cleanId = String(doctorId).replace('DOC-', '');
    const doctor = await DoctorModel.getPublicDoctorById(cleanId);
    return doctor;
};

module.exports = {
    authenticateDoctor,
    getDoctorProfile,
    getAppointments,
    getPatients,
    searchPatients,
    getPrescriptions,
    getLabReports,
    createPrescription,
    addMedicines,
    uploadLabReport,
    requestLabTest,
    setFollowUp,
    updateAppointmentStatus,
    getPublicDoctors,
    getDoctorById
};
