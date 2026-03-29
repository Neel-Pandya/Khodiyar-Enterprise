import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      signup: async (data) => {
        set({ isLoading: true });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error.response?.data?.message || error.message;
        }
      },
      verifyOTP: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.verifyOTP(data);
          set({ user: res.user, token: res.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error.response?.data?.message || error.message;
        }
      },
      login: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login(data);
          set({ user: res.user, token: res.accessToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error.response?.data?.message || error.message;
        }
      },
      resendOTP: async (data) => {
        set({ isLoading: true });
        try {
          await authApi.resendOTP(data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error.response?.data?.message || error.message;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'token',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;