import api from '../api/axios';

const labService = {
    getQueue: async () => {
        const response = await api.get('/lab/tests/queue');
        return response.data;
    },

    getHistory: async (limit = 50) => {
        const response = await api.get(`/lab/tests/history?limit=${limit}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/lab/tests/${id}/status`, { status });
        return response.data;
    },

    uploadReport: async (formData) => {
        const response = await api.post('/lab/reports/upload', formData, {
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
        const response = await api.get(`/lab/patients/${patientId}/reports`);
        return response.data;
    }
};

export default labService;
