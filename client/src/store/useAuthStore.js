import { create } from 'zustand';
import { authApi } from '../api/authApi';
import * as toast from '../utils/toast';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  navigate: null,
  setNavigate: (nav) => set({ navigate: nav }),
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
  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      await authApi.forgotPassword(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  verifyResetOTP: async (data) => {
    set({ isLoading: true });
    try {
      await authApi.verifyResetOTP(data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resetPassword: async (data) => {
    set({ isLoading: true });
    try {
      await authApi.resetPassword(data);
      get().navigate('/login');
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
