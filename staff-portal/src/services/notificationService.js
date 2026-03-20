import api from '../api/axios';

const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/api/staff/notifications');
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.patch(`/api/staff/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.patch('/api/staff/notifications/read-all');
        return response.data;
    }
};

export default notificationService;
