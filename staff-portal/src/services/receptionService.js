import api, { rootApi } from '../api/axios';

const receptionService = {
    // Public Data
    getDepartments: async () => {
        const response = await rootApi.get('/api/public/departments');
        return response.data;
    },

    // Patient Management
    searchPatient: async (query) => {
        const response = await api.get(`/api/staff/receptionist/patients/search?query=${query}`);
        return response.data;
    },

    registerWalkIn: async (patientData) => {
        const response = await api.post('/api/staff/receptionist/patients/register', patientData);
        return response.data;
    },

    // Token Management
    getTokens: async () => {
        const response = await api.get('/api/staff/receptionist/tokens');
        return response.data;
    },

    generateToken: async (tokenData) => {
        const response = await api.post('/api/staff/receptionist/tokens/generate', tokenData);
        return response.data;
    },

    updateTokenStatus: async (id, status) => {
        const response = await api.put(`/api/staff/receptionist/tokens/${id}/status`, { status });
        return response.data;
    },

    deleteToken: async (id) => {
        const response = await api.delete(`/api/staff/receptionist/tokens/${id}`);
        return response.data;
    },

    // Billing
    getInvoices: async () => {
        const response = await api.get('/api/staff/receptionist/invoices');
        return response.data;
    },

    createInvoice: async (invoiceData) => {
        const response = await api.post('/api/staff/receptionist/invoices/create', invoiceData);
        return response.data;
    },

    getInvoiceById: async (id) => {
        const response = await api.get(`/api/staff/receptionist/invoices/${id}`);
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await api.get('/api/staff/receptionist/dashboard/stats');
        return response.data;
    }
};

export default receptionService;
