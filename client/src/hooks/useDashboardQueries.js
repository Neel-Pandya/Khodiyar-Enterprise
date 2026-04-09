import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboardApi';

export const dashboardKeys = {
  all: ['dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
  recentOrders: () => [...dashboardKeys.all, 'recentOrders'],
  recentOrdersList: (limit) => [...dashboardKeys.recentOrders(), { limit }],
};

export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const data = await dashboardApi.getStats();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useRecentOrders = (limit = 10, options = {}) => {
  const cleanLimit = typeof limit === 'number' ? limit : parseInt(limit, 10) || 10;

  return useQuery({
    queryKey: dashboardKeys.recentOrdersList(cleanLimit),
    queryFn: async () => {
      const data = await dashboardApi.getRecentOrders(cleanLimit);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};