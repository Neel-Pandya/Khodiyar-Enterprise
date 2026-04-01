import { create } from 'zustand';
import { authApi } from '../api/authApi';

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
      await authApi.verifyOTP(data);
      set({ isLoading: false });
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
  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.getCurrentUser();
      set({ user: res.data.user, isLoading: false });
    } catch (error) {
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
      throw error;
    }
  },
  updateProfile: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await authApi.updateProfile(formData);
      set({ user: res.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  changePassword: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authApi.changePassword(data);
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
