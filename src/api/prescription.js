import apiClient from './apiClient';

export const createPrescription = (prescriptionData) => apiClient.post('/prescription', prescriptionData);
