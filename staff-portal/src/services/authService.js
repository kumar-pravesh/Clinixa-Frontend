import api from '../api/axios';
import { rootApi } from '../api/axios';

const authService = {
    login: async (credentials) => {
        // Use staff-specific login endpoint
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    logout: async () => {
        // Use staff-specific logout endpoint
        const response = await api.post('/auth/logout');
        return response.data;
    },
    register: async (userData) => {
        // Staff registration not supported - use admin panel
        throw new Error('Staff registration must be done through admin panel');
    },
    refresh: async () => {
        // Use staff-specific refresh endpoint
        const response = await api.post('/auth/refresh');
        return response.data;
    },
    // Forgot password — uses root API (auth endpoints are at root level)
    forgotPassword: async (email) => {
        const response = await rootApi.post('/auth/forgot-password', { email });
        return response.data;
    },
    // Reset password — supports JWT token flow
    resetPassword: async ({ token, newPassword }) => {
        const response = await rootApi.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },
};

export default authService;

