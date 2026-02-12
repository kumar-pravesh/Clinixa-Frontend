import api from '../api/axios';

const receptionService = {
    // Patient Management
    searchPatient: async (query) => {
        const response = await api.get(`/receptionist/patients/search?query=${query}`);
        return response.data;
    },

    registerWalkIn: async (patientData) => {
        const response = await api.post('/receptionist/patients', patientData);
        return response.data;
    },

    // Token Management
    getTokens: async () => {
        const response = await api.get('/receptionist/tokens');
        return response.data;
    },

    generateToken: async (tokenData) => {
        const response = await api.post('/receptionist/tokens', tokenData);
        return response.data;
    },

    updateTokenStatus: async (id, status) => {
        const response = await api.put(`/receptionist/tokens/${id}`, { status });
        return response.data;
    },

    deleteToken: async (id) => {
        const response = await api.delete(`/receptionist/tokens/${id}`);
        return response.data;
    },

    // Billing
    getInvoices: async () => {
        const response = await api.get('/receptionist/invoices');
        return response.data;
    },

    createInvoice: async (invoiceData) => {
        const response = await api.post('/receptionist/invoices', invoiceData);
        return response.data;
    },

    getInvoiceById: async (id) => {
        const response = await api.get(`/receptionist/invoices/${id}`);
        return response.data;
    }
};

export default receptionService;
