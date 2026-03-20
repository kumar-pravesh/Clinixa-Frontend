import api from '../api/axios';

const labService = {
    getQueue: async () => {
        const response = await api.get('/api/staff/lab/tests/queue');
        return response.data;
    },

    getHistory: async (limit = 50) => {
        const response = await api.get(`/api/staff/lab/tests/history?limit=${limit}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/api/staff/lab/tests/${id}/status`, { status });
        return response.data;
    },

    uploadReport: async (formData) => {
        const response = await api.post('/api/staff/lab/reports/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getReportById: async (id) => {
        const response = await api.get(`/api/staff/lab/reports/${id}`);
        return response.data;
    },

    getPatientReports: async (patientId) => {
        const response = await api.get(`/api/staff/lab/patients/${patientId}/reports`);
        return response.data;
    }
};

export default labService;
