import apiClient from './apiClient';

export const favoriteApi = {
  toggleFavorite: (productId) =>
    apiClient.post('/favorites/toggle', { product_id: productId }),

  getFavorites: (params = {}) => apiClient.get('/favorites', { params }),

  checkFavorite: (productId) =>
    apiClient.get(`/favorites/check/${productId}`),
};
