import api from '../api/axios';

const labService = {
    getQueue: async () => {
        const response = await api.get('/lab/queue');
        return response.data;
    },

    getHistory: async (limit = 50) => {
        const response = await api.get(`/lab/history?limit=${limit}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/lab/queue/${id}/status`, { status });
        return response.data;
    },

    uploadReport: async (formData) => {
        const response = await api.post('/lab/reports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getReportById: async (id) => {
        const response = await api.get(`/lab/reports/${id}`);
        return response.data;
    },

    getPatientReports: async (patientId) => {
        const response = await api.get(`/lab/patient/${patientId}/reports`);
        return response.data;
    }
};

export default labService;
