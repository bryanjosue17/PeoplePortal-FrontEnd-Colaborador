import apiClient from './client';

export const getTeamRequests    = ()         => apiClient.get('/api/manager/requests');
export const approveTeamRequest = (id, data) => apiClient.patch(`/api/manager/requests/${id}/status`, data);
