import apiClient from './apiClient';

export const categoryApi = {
  getAllCategories: (params) => apiClient.get('/categories', { params }),
  getCategory: (id) => apiClient.get(`/categories/${id}`),
  createCategory: (data) => apiClient.post('/categories', data),
  updateCategory: (id, data) => apiClient.patch(`/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
};
