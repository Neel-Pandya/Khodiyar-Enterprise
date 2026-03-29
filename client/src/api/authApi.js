import apiClient from './apiClient';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyOTP: (data) => apiClient.post('/auth/verify-otp', data),
  resendOTP: (data) => apiClient.post('/auth/resend-otp', data),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  verifyResetOTP: (data) => apiClient.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};