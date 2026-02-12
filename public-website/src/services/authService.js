import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        window.location.href = '/login';
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (email, otp, newPassword) => {
        const response = await api.post('/auth/reset-password', { email, otp, newPassword });
        return response.data;
    },

    googleAuth: async (token) => {
        const response = await api.post('/auth/google', { token });
        return response.data;
    },
};
