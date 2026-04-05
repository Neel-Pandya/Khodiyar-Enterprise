import apiClient from './apiClient';

export const cartApi = {
  addToCart: (productId) => apiClient.post('/cart', { productId }),
  getCart: (params = {}) => apiClient.get('/cart', { params }),
  getCartCount: () => apiClient.get('/cart/count'),
  updateQuantity: (cartId, quantity) => apiClient.patch(`/cart/${cartId}`, { quantity }),
  removeItem: (cartId) => apiClient.delete(`/cart/${cartId}`),
  clearCart: () => apiClient.delete('/cart'),
};
