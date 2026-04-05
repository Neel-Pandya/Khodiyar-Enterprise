import apiClient from './apiClient';

export const orderApi = {
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrders: (params = {}) => apiClient.get('/orders', { params }),
  getOrderById: (orderId) => apiClient.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => apiClient.patch(`/orders/${orderId}/cancel`),
};
