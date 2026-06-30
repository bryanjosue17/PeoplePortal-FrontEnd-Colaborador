import apiClient from './client';

export const getActiveBenefits = () => apiClient.get('/api/benefits');
