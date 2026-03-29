import { create } from 'zustand';
import { authApi } from '../api/authApi';

const useAuthStore = create((set) => ({
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
      throw error;
    }
  },
  verifyOTP: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authApi.verifyOTP(data);
      localStorage.setItem('token', res.data.accessToken);
      set({ user: res.data.user, token: res.data.accessToken, isLoading: false });
      sessionStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.data.accessToken);
      set({ user: res.data.user, token: res.data.accessToken, isLoading: false });
      sessionStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resendOTP: async (data) => {
    set({ isLoading: true });
    try {
      await authApi.resendOTP(data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
