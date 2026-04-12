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
  updateProfile: (data) => apiClient.patch('/auth/me', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
  checkVerificationStatus: (email) =>
    apiClient.post('/auth/check-verification-status', { email }),
  initiateLoginVerification: (email) =>
    apiClient.post('/auth/initiate-login-verification', { email }),
};