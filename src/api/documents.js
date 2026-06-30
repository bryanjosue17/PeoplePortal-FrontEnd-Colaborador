import apiClient from './client';

export const getMyDocuments = () => apiClient.get('/api/documents/me');
