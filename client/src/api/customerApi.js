import apiClient from './apiClient';

export const customerApi = {
  getAllCustomers: (params) => apiClient.get('/users', { params: { ...params, role: 'user' } }),
  getCustomer: (id) => apiClient.get(`/users/${id}`),
  createCustomer: (data) => apiClient.post('/users', data),
  updateCustomer: (id, data) => apiClient.patch(`/users/${id}`, data),
  deleteCustomer: (id) => apiClient.delete(`/users/${id}`),
};