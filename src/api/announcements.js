import apiClient from './client';

export const getActiveAnnouncements = () => apiClient.get('/api/announcements');
