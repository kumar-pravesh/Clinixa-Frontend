import apiClient from './apiClient';

export const createAppointment = (appointmentData) => apiClient.post('/appointments', appointmentData);
