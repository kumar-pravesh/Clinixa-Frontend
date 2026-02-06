import api from './api';

export const patientService = {
    getProfile: async () => {
        const response = await api.get('/patient/profile');
        return response.data;
    },

    // Doctors are public but also needed here for booking
    getDoctors: async () => {
        const response = await api.get('/appointment/doctors');
        return response.data;
    },

    bookAppointment: async (data) => {
        const response = await api.post('/appointment/book', data);
        return response.data;
    },

    getMyAppointments: async () => {
        const response = await api.get('/appointment/my-appointments');
        return response.data;
    },

    // Payment
    initiatePayment: async (appointmentId) => {
        const response = await api.post('/payment/initiate', { appointmentId });
        return response.data;
    },

    confirmPayment: async (paymentId, status) => {
        const response = await api.post('/payment/confirm', { paymentId, status });
        return response.data;
    }
};
