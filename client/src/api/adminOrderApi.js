import apiClient from './apiClient';

export const adminOrderApi = {
  getAllOrders: (params = {}) => apiClient.get('/admin/orders', { params }),
  getOrderById: (orderId) => apiClient.get(`/admin/orders/${orderId}`),
  updateOrderStatus: (orderId, data) => apiClient.patch(`/admin/orders/${orderId}/status`, data),
};
