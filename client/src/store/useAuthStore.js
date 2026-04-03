import { create } from 'zustand';
import { queryClient } from '../lib/queryClient';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  navigate: null,
  setNavigate: (nav) => set({ navigate: nav }),
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: async () => {
    localStorage.removeItem('token');
    await queryClient.cancelQueries();
    queryClient.clear();
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
