import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import useAuthStore from '../store/useAuthStore';

// Query Keys
export const authKeys = {
  all: ['auth'],
  me: () => [...authKeys.all, 'me'],
};

// Get current user query
export const useCurrentUserQuery = () => {
  const token = localStorage.getItem('token');
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const res = await authApi.getCurrentUser();
      setUser(res.data.user);
      return res.data.user;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLoginMutation = () => {
  const { setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
      queryClient.setQueryData(authKeys.me(), res.data.user);
    },
  });
};

// Signup mutation
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

// Verify OTP mutation
export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyOTP,
  });
};

// Resend OTP mutation
export const useResendOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.resendOTP,
  });
};

// Forgot password mutation
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

// Verify reset OTP mutation
export const useVerifyResetOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyResetOTP,
  });
};

// Reset password mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

// Update profile mutation
export const useUpdateProfileMutation = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      setUser(res.data.user);
      queryClient.setQueryData(authKeys.me(), res.data.user);
    },
  });
};

// Change password mutation
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};
