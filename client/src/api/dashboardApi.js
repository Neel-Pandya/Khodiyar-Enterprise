import apiClient from './apiClient';

export const dashboardApi = {
  getStats: () => apiClient.get('/admin/dashboard/stats'),
  getRecentOrders: (limit = 10) =>
    apiClient.get('/admin/dashboard/recent-orders', { params: { limit } }),
};