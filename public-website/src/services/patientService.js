import api from './api';

export const patientService = {
    // Profile (protected)
    getProfile: async () => {
        const res = await api.get('/patient/profile');
        return res.data;
    },

    // Doctors (used for booking)
    getDoctors: async () => {
        const res = await api.get('/api/public/doctors');
        return res.data;
    },

    getAvailability: async (doctorId, date) => {
        const res = await api.get(`/appointment/availability?doctorId=${doctorId}&date=${date}`);
        return res.data;
    },

    // Book appointment
    bookAppointment: async (data) => {
        const res = await api.post('/appointment/book', data);
        return res.data;
    },

    // Patient appointments
    getMyAppointments: async () => {
        const res = await api.get('/appointment/my-appointments');
        return res.data;
    },

    // 🔐 PAYMENT — FIXED
    initiatePayment: async (appointmentId) => {
        const res = await api.post('/payments/initiate', {
            appointmentId
        });
        return res.data;
    },

    confirmPayment: async (paymentId, verificationData) => {
        const res = await api.post('/payments/confirm', {
            paymentId,
            verificationData
        });
        return res.data;
    },

    getPublicDepartments: async () => {
        const res = await api.get('/api/public/departments');
        return res.data;
    }
};
