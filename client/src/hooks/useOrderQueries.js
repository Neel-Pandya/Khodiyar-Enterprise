import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';
import { success as toastSuccess, error as toastError } from '@/utils/toast';
import { cartKeys } from './useCartQueries';

// Query keys
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (params) => [...orderKeys.lists(), { params }],
  detail: (id) => [...orderKeys.all, 'detail', id],
};

// Create order mutation
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => orderApi.createOrder(orderData),
    onSuccess: (response) => {
      toastSuccess('Order placed successfully!');
      // Invalidate cart queries (cart is cleared after order)
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      // Handle 409 stock conflict specifically
      if (error.response?.status === 409) {
        toastError(error.response?.data?.message || 'Some items are out of stock');
      } else {
        const message = error.response?.data?.message || 'Failed to place order';
        toastError(message);
      }
    },
  });
};

// Fetch user's orders with pagination
export const useOrdersQuery = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const response = await orderApi.getOrders(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch single order by ID
export const useOrderByIdQuery = (orderId) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
};

// Cancel order mutation
export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId) => orderApi.cancelOrder(orderId),
    onSuccess: (response) => {
      toastSuccess('Order cancelled successfully');
      // Invalidate specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toastError(message);
    },
  });
};
