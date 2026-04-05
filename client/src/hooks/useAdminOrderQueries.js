import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrderApi } from '@/api/adminOrderApi';

// Query keys
export const adminOrderKeys = {
  all: ['adminOrders'],
  lists: () => [...adminOrderKeys.all, 'list'],
  list: (params) => [...adminOrderKeys.lists(), { params }],
  details: () => [...adminOrderKeys.all, 'detail'],
  detail: (id) => [...adminOrderKeys.details(), id],
};

// Fetch all orders with pagination
export const useAdminOrdersQuery = (params = {}, options = {}) => {
  // Clean params - remove empty values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  );

  return useQuery({
    queryKey: adminOrderKeys.list(cleanParams),
    queryFn: async () => {
      const response = await adminOrderApi.getAllOrders(cleanParams);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Fetch single order by ID
export const useAdminOrderQuery = (orderId, options = {}) => {
  return useQuery({
    queryKey: adminOrderKeys.detail(orderId),
    queryFn: async () => {
      const response = await adminOrderApi.getOrderById(orderId);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Update order status mutation
export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }) => {
      const response = await adminOrderApi.updateOrderStatus(orderId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific order detail
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.detail(variables.orderId),
      });
    },
  });
};
