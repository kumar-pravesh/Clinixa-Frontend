const PatientModel = require('../models/patient.model');

const calculateHealthScore = (patient) => {
    try {
        let score = 95; // Starting base for ideal health

        // 1. BMI Calculation & Penalty (Ideal BMI 18.5 - 24.9)
        const height = parseFloat(patient.height);
        const weight = parseFloat(patient.weight);

        if (!isNaN(height) && !isNaN(weight) && height > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);

            if (!isNaN(bmi)) {
                if (bmi < 18.5) {
                    score -= (18.5 - bmi) * 2; // Underweight penalty
                } else if (bmi > 24.9) {
                    score -= (bmi - 24.9) * 1.5; // Overweight/Obese penalty
                }
            }
        } else {
            score -= 5;
        }

        // 2. Blood Pressure Penalty (Ideal 120/80)
        const sys = parseInt(patient.bp_systolic);
        const dia = parseInt(patient.bp_diastolic);

        if (!isNaN(sys) && !isNaN(dia)) {
            if (sys > 130) score -= (sys - 130) * 0.5;
            if (dia > 85) score -= (dia - 85) * 0.8;
            if (sys < 100) score -= 5;
        } else {
            score -= 5;
        }

        const finalScore = Math.floor(score);
        return isNaN(finalScore) ? 80 : Math.max(60, Math.min(100, finalScore));
    } catch (e) {
        console.error('[HealthScore] Error:', e);
        return 80;
    }
};

const patientService = {
    async getProfile(userId) {
        console.log(`[PatientService] Fetching profile for user ${userId}`);
        return PatientModel.getProfile(userId);
    },

    async updateProfile(userId, updateData) {
        console.log(`[PatientService] Updating profile for user ${userId}`);
        return PatientModel.updateByUserId(userId, updateData);
    },

    async getDashboardStats(userId) {
        console.log(`[PatientService] Getting stats for user ${userId}`);
        try {
            const patient = await PatientModel.getProfile(userId);
            if (!patient) {
                console.log('[PatientService] No user/patient found');
                return null;
            }

            if (!patient.id) {
                console.log('[PatientService] Patient record missing, returning default stats');
                return {
                    healthScore: 85,
                    nextAppointment: null,
                    todayCount: 0,
                    totalRecords: 0,
                    status: 'Pending Vitals'
                };
            }

            // Move requires back to method level to prevent potential circular hangs
            const AppointmentModel = require('../models/appointment.model');
            const PrescriptionModel = require('../models/prescription.model');
            const LabModel = require('../models/lab.model');

            console.log('[PatientService] Fetching related data...');
            const results = await Promise.all([
                AppointmentModel.findNextByUserId(userId),
                AppointmentModel.countTodayByUserId(userId),
                PrescriptionModel.countByPatientId(patient.id),
                LabModel.countByPatientId(patient.id)
            ]);

            const [nextAppointment, todayCount, prescriptionCount, labCount] = results;
            console.log('[PatientService] Data fetched successfully');

            return {
                healthScore: calculateHealthScore(patient),
                nextAppointment,
                todayCount,
                totalRecords: (prescriptionCount || 0) + (labCount || 0),
                status: 'Active'
            };
        } catch (error) {
            console.error('[PatientService] Error in getDashboardStats:', error);
            // Return minimal stats instead of hanging or crashing
            return {
                healthScore: 80,
                nextAppointment: null,
                todayCount: 0,
                totalRecords: 0,
                status: 'Error'
            };
        }
    },

    async getMedicalRecords(userId) {
        try {
            const patient = await PatientModel.getProfile(userId);
            if (!patient || !patient.id) return [];

            const AppointmentModel = require('../models/appointment.model');
            const PrescriptionModel = require('../models/prescription.model');
            const LabModel = require('../models/lab.model');

            const [prescriptions, labReports, appointments] = await Promise.all([
                PrescriptionModel.findByPatientId(patient.id),
                LabModel.findByPatientId(patient.id),
                AppointmentModel.findAll({ patient_id: patient.id })
            ]);

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

            return records.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('[PatientService] Error in getMedicalRecords:', error);
            return [];
        }
    }
};

module.exports = patientService;
