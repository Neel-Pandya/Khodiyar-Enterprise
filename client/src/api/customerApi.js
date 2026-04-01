import apiClient from './apiClient';

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const customerApi = {
  getAllCustomers: (params) => apiClient.get('/users', { params: { ...params, role: 'user' } }),
  getCustomer: (id) => apiClient.get(`/users/${id}`),
  createCustomer: (data) => {
    const hasFile = data.avatar instanceof File;
    if (hasFile) {
      const formData = createFormData(data);
      return apiClient.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.post('/users', data);
  },
  updateCustomer: (id, data) => {
    const hasFile = data.avatar instanceof File;
    if (hasFile) {
      const formData = createFormData(data);
      return apiClient.patch(`/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.patch(`/users/${id}`, data);
  },
  deleteCustomer: (id) => apiClient.delete(`/users/${id}`),
};