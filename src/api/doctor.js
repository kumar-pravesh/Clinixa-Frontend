import apiClient from './apiClient';

export const getDoctors = () => apiClient.get('/doctors');
