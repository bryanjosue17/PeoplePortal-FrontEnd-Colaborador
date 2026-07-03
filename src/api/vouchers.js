import apiClient from './client';

export const getMyVouchers = () => apiClient.get('/api/vouchers/me');
