import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '@/api/paymentApi';
import { success as toastSuccess, error as toastError } from '@/utils/toast';
import { cartKeys } from './useCartQueries';
import { orderKeys } from './useOrderQueries';

// Create Razorpay order mutation
export const useCreateRazorpayOrderMutation = () => {
  return useMutation({
    mutationFn: () => paymentApi.createRazorpayOrder(),
    onError: (error) => {
      const message = error?.message || 'Failed to initialize payment';
      toastError(message);
    },
  });
};

// Verify payment and create order mutation
export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => paymentApi.verifyPayment(data),
    onSuccess: () => {
      toastSuccess('Payment successful! Order placed.');
      // Invalidate cart queries (cart is cleared after order)
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      const message = error?.message || 'Payment verification failed';
      toastError(message);
    },
  });
};
