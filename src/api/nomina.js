import apiClient from './client';

export const getMyNomina = () => apiClient.get('/api/nomina/me');
