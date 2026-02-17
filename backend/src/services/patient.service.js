const PatientModel = require('../models/patient.model');

const patientService = {
    async getProfile(userId) {
        return PatientModel.getProfile(userId);
    },

    async getDashboardStats(userId) {
        const patient = await PatientModel.getProfile(userId);
        if (!patient) return null;

        const nextAppointment = await require('../models/appointment.model').findNextByUserId(userId);
        const todayCount = await require('../models/appointment.model').countTodayByUserId(userId);
        const prescriptionCount = await require('../models/prescription.model').countByPatientId(patient.id);
        const labCount = await require('../models/lab.model').countByPatientId(patient.id);

        return {
            healthScore: Math.min(85 + (prescriptionCount + labCount) * 2, 99), // Semi-real derivation
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
