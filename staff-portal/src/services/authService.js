import api from '../api/axios';

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
};

export default authService;
