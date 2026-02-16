import api from './api';

const doctorService = {
    getAllDoctors: async () => {
        // Public API endpoint for doctors is /api/public/doctors
        const response = await api.get('/api/public/doctors');
        return response.data;
    }
};

export default doctorService;
