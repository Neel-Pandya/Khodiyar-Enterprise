import apiClient from './apiClient';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyOTP: (data) => apiClient.post('/auth/verify-otp', data),
  resendOTP: (data) => apiClient.post('/auth/resend-otp', data),
};