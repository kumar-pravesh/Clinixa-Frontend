import { rootApi } from '../api/axios';

const authService = {
    login: async (credentials) => {
        const response = await rootApi.post('/auth/login', credentials);
        return response.data;
    },
    logout: async () => {
        const response = await rootApi.post('/auth/logout');
        return response.data;
    },
    register: async (userData) => {
        const response = await rootApi.post('/auth/register', userData);
        return response.data;
    },
    refresh: async () => {
        const response = await rootApi.post('/auth/refresh');
        return response.data;
    },
};

export default authService;
