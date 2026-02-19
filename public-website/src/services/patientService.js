import api from './api';

export const patientService = {
    // Profile (protected)
    getProfile: async () => {
        const res = await api.get('/patient/profile');
        return res.data;
    },

    updateProfile: async (profileData) => {
        const res = await api.put('/patient/profile', profileData);
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
    bookAppointment: async (bookingData) => {
        const res = await api.post('/appointment/book', bookingData);
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
            ...verificationData
        });
        return res.data;
    },

    getPublicDepartments: async () => {
        const res = await api.get('/api/public/departments');
        return res.data;
    },

    // Public stats (kept for reference, but dashboard now uses private stats)
    getPublicStats: async () => {
        const res = await api.get('/api/public/stats');
        return res.data;
    },

    // 🏥 Real Patient Data
    getDashboardStats: async () => {
        const res = await api.get('/patient/dashboard-stats');
        return res.data;
    },

    getMedicalRecords: async () => {
        const res = await api.get('/patient/medical-records');
        return res.data;
    },

    // 🔔 Notifications
    getNotifications: async () => {
        const res = await api.get('/api/notifications');
        return res.data;
    },

    markNotificationAsRead: async (id) => {
        const res = await api.patch(`/api/notifications/${id}/read`);
        return res.data;
    },

    markAllNotificationsAsRead: async () => {
        const res = await api.patch('/api/notifications/read-all');
        return res.data;
    }
};
