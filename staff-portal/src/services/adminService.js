import api from '../api/axios';

export const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getPatients: async () => {
        const response = await api.get('/admin/patients');
        return response.data;
    },
    getAppointments: async () => {
        const response = await api.get('/admin/appointments');
        return response.data;
    },
    getTodaysAppointments: async () => {
        const response = await api.get('/admin/appointments/today');
        return response.data;
    },
    updateAppointmentStatus: async (id, status) => {
        const response = await api.patch(`/admin/appointments/${id}/status`, { status });
        return response.data;
    },
    assignDoctor: async (id, doctorId) => {
        const response = await api.patch(`/admin/appointments/${id}/assign`, { doctorId });
        return response.data;
    },
    getNotifications: async () => {
        const response = await api.get('/admin/notifications');
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.patch(`/admin/notifications/${id}/read`);
        return response.data;
    }
};
