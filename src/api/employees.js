import apiClient from './client';

export const getMyProfile = () => apiClient.get('/api/employees/me');
export const updateMyProfile = (data) => apiClient.put('/api/employees/me', data);
