import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Phase 1: Send OTP to email for registration verification
    sendRegistrationOtp: async (data) => {
        const response = await api.post('/auth/register/send-otp', data);
        return response.data;
    },

    // Phase 2: Verify OTP and complete registration
    verifyRegistrationOtp: async (email, otp) => {
        const response = await api.post('/auth/register/verify-otp', { email, otp });
        return response.data;
    },

    // Legacy direct register (fallback when OTP is disabled on backend)
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        window.location.href = '/login';
    },

    // Forgot password — backend delegates to JWT link flow automatically
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password — supports both JWT token and legacy OTP flows
    resetPassword: async ({ token, newPassword, email, otp }) => {
        // JWT token flow (new)
        if (token) {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            return response.data;
        }
        // Legacy OTP flow (fallback)
        const response = await api.post('/auth/reset-password', { email, otp, newPassword });
        return response.data;
    },

    googleAuth: async (token) => {
        const response = await api.post('/auth/google', { token });
        return response.data;
    },
};
