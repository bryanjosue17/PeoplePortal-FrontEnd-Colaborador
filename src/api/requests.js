import apiClient from './client';

export const getMyRequests = () => apiClient.get('/api/requests/me');
export const createVacation = (data) => apiClient.post('/api/requests/vacation', data);
export const createCertificate = (data) => apiClient.post('/api/requests/certificate', data);
export const createVoucher = (data) => apiClient.post('/api/requests/voucher', data);
export const cancelRequest = (id) => apiClient.post(`/api/requests/${id}/cancel`);
