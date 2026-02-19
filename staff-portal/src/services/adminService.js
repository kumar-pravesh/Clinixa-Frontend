import api from '../api/axios';

const adminService = {
    // Doctors
    getAllDoctors: async () => {
        const response = await api.get('/admin/doctors');
        return response.data;
    },

    createDoctor: async (data, hasImage = false) => {
        let config = {};
        if (hasImage) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post('/admin/doctors', data, config);
        return response.data;
    },

    updateDoctor: async (id, data, hasImage = false) => {
        let config = {};
        if (hasImage) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.put(`/admin/doctors/${id}`, data, config);
        return response.data;
    },

    deleteDoctor: async (id) => {
        const response = await api.delete(`/admin/doctors/${id}`);
        return response.data;
    },

    // Departments
    getDepartments: async () => {
        const response = await api.get('/admin/departments');
        return response.data;
    },

    // Patients
    getPatients: async (search = '', limit = 100) => {
        const response = await api.get(`/admin/patients?search=${search}&limit=${limit}`);
        return response.data;
    },

    deletePatient: async (id) => {
        const response = await api.delete(`/admin/patients/${id}`);
        return response.data;
    },


    // Dashboard
    getDashboardSummary: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    }
};

export default adminService;
