import apiClient from './apiClient';

export const getInvoices = () => apiClient.get('/invoice');
