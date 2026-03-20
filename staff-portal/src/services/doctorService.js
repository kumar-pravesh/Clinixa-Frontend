import api from '../api/axios';

const doctorService = {
    // Core Data
    getProfile: async () => {
        const response = await api.get('/api/staff/doctor/profile');
        return response.data;
    },

    getAppointments: async () => {
        const response = await api.get('/api/staff/doctor/appointments');
        return response.data;
    },

    getPatients: async () => {
        const response = await api.get('/api/staff/doctor/patients');
        return response.data;
    },

    searchPatients: async (query) => {
        const response = await api.get(`/api/staff/doctor/patients/search?query=${query}`);
        return response.data;
    },

    // Prescriptions
    getPrescriptions: async (appointmentId = null) => {
        const url = appointmentId
            ? `/api/staff/doctor/prescriptions?appointmentId=${appointmentId}`
            : '/api/staff/doctor/prescriptions';
        const response = await api.get(url);
        return response.data;
    },

    createPrescription: async (prescriptionData) => {
        const response = await api.post('/api/staff/doctor/prescriptions', prescriptionData);
        return response.data;
    },

    addMedicines: async (data) => {
        const response = await api.post('/api/staff/doctor/medicines', data);
        return response.data;
    },

    // Lab Reports
    getLabReports: async () => {
        const response = await api.get('/api/staff/doctor/lab-reports');
        return response.data;
    },

    uploadLabReport: async (formData) => {
        const response = await api.post('/api/staff/doctor/lab-reports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    requestLabTest: async (testData) => {
        const response = await api.post('/api/staff/doctor/lab-tests/request', testData);
        return response.data;
    },

    // Follow-up & Status
    setFollowUp: async (data) => {
        const response = await api.post('/api/staff/doctor/appointments/follow-up', data);
        return response.data;
    },

    updateAppointmentStatus: async (id, status) => {
        const response = await api.put(`/api/staff/doctor/appointments/${id}/status`, { status });
        return response.data;
    }
};

export default doctorService;
