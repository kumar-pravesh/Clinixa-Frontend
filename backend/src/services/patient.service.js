const PatientModel = require('../models/patient.model');

const calculateHealthScore = (patient) => {
    let score = 95; // Starting base for ideal health

    // 1. BMI Calculation & Penalty (Ideal BMI 18.5 - 24.9)
    if (patient.height && patient.weight) {
        const heightInMeters = patient.height / 100;
        const bmi = patient.weight / (heightInMeters * heightInMeters);

        if (bmi < 18.5) {
            score -= (18.5 - bmi) * 2; // Underweight penalty
        } else if (bmi > 24.9) {
            score -= (bmi - 24.9) * 1.5; // Overweight/Obese penalty
        }
    } else {
        score -= 5; // Penalty for missing data
    }

    // 2. Blood Pressure Penalty (Ideal 120/80)
    if (patient.bp_systolic && patient.bp_diastolic) {
        if (patient.bp_systolic > 130) score -= (patient.bp_systolic - 130) * 0.5;
        if (patient.bp_diastolic > 85) score -= (patient.bp_diastolic - 85) * 0.8;
        if (patient.bp_systolic < 100) score -= 5;
    } else {
        score -= 5; // Penalty for missing data
    }

    // Ensure score is within realistic bounds (e.g., 60-100)
    return Math.max(60, Math.min(100, Math.floor(score)));
};

const patientService = {
    async getProfile(userId) {
        return PatientModel.getProfile(userId);
    },

    async updateProfile(userId, updateData) {
        return PatientModel.updateByUserId(userId, updateData);
    },

    async getDashboardStats(userId) {
        const patient = await PatientModel.getProfile(userId);
        if (!patient) return null;

        const nextAppointment = await require('../models/appointment.model').findNextByUserId(userId);
        const todayCount = await require('../models/appointment.model').countTodayByUserId(userId);
        const prescriptionCount = await require('../models/prescription.model').countByPatientId(patient.id);
        const labCount = await require('../models/lab.model').countByPatientId(patient.id);

        return {
            healthScore: calculateHealthScore(patient),
            nextAppointment,
            todayCount,
            totalRecords: prescriptionCount + labCount,
            status: 'Active'
        };
    },

    async getMedicalRecords(userId) {
        const patient = await PatientModel.getProfile(userId);
        if (!patient) return [];

        const prescriptions = await require('../models/prescription.model').findByPatientId(patient.id);
        const labReports = await require('../models/lab.model').findByPatientId(patient.id);
        const appointments = await require('../models/appointment.model').findAll({ patient_id: patient.id });

        const records = [
            ...prescriptions.map(p => ({
                id: `pr-${p.id}`,
                type: 'Prescription',
                title: p.diagnosis || 'General Consultation',
                doctor: p.doctor_name,
                date: p.date,
                icon: 'Pill',
                color: 'primary'
            })),
            ...labReports.map(l => ({
                id: `lr-${l.id}`,
                type: 'Lab Report',
                title: l.test_name,
                doctor: l.doctor_name || 'Lab',
                date: l.test_date,
                file_url: l.file_url,
                icon: 'FlaskConical',
                color: 'accent'
            })),
            ...appointments.map(a => ({
                id: `ap-${a.id}`,
                type: 'Consultation',
                title: a.reason || 'General Checkup',
                doctor: `Dr. ${a.doctor || 'Consultant'}`,
                date: a.date,
                icon: 'Stethoscope',
                color: 'primary'
            }))
        ];

        // Sort by date desc
        return records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};

module.exports = patientService;
