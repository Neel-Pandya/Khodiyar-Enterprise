import apiClient from './apiClient';

export const paymentApi = {
  createRazorpayOrder: () => apiClient.post('/payments/create-order'),
  verifyPayment: (data) => apiClient.post('/payments/verify-payment', data),
};
