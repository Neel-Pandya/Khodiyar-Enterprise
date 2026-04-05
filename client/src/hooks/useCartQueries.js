import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import useCartStore from '@/store/useCartStore';
import { success as toastSuccess, error as toastError } from '@/utils/toast';

// Query keys
export const cartKeys = {
  all: ['cart'],
  lists: () => [...cartKeys.all, 'list'],
  list: (params) => [...cartKeys.lists(), { params }],
  count: () => [...cartKeys.all, 'count'],
};

// Add to Cart with isNewItem detection for toast messages
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  const { cartCount, setCartCount } = useCartStore();

  return useMutation({
    mutationFn: (productId) => cartApi.addToCart(productId),
    onSuccess: (response) => {
      const { isNewItem, cartItem } = response.data;

      // Toast message based on isNewItem flag from backend
      if (isNewItem) {
        toastSuccess(`Added to cart: ${cartItem.product.name}`);
        // Optimistically increment cart count for new items
        setCartCount(cartCount + 1);
      } else {
        toastSuccess(`Quantity updated: Increased ${cartItem.product.name}`);
      }

      // Invalidate queries to refresh cart data
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
    onError: (error) => {
      const message = error?.message || 'Failed to add to cart';
      toastError(message);

      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

// Fetch all cart items with pagination
export const useCartQuery = (params = {}) => {
  const { setCartItems, setPagination } = useCartStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: cartKeys.list(params),
    queryFn: async () => {
      const response = await cartApi.getCart(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Handle side effects when data changes
  useEffect(() => {
    if (query.data) {
      const responseData = query.data.data || query.data;
      if (responseData) {
        setCartItems(responseData.cartItems || []);
        setPagination(responseData.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });

        // Show toast if any items were removed (out of stock or inactive)
        if (responseData.removedCount > 0) {
          toastError(`${responseData.removedCount} item(s) removed from cart (unavailable or out of stock)`);
          // Invalidate count query since items were removed
          queryClient.invalidateQueries({ queryKey: cartKeys.count() });
        }
      }
    }
  }, [query.data, setCartItems, setPagination, queryClient]);

  return query;
};

// Get cart count for badge
export const useCartCountQuery = () => {
  const { setCartCount } = useCartStore();

  const query = useQuery({
    queryKey: cartKeys.count(),
    queryFn: async () => {
      const response = await cartApi.getCartCount();
      return response.data.count;
    },
    staleTime: 1 * 60 * 1000,
  });

  // Handle side effects when data changes
  useEffect(() => {
    if (query.data !== undefined) {
      setCartCount(query.data);
    }
  }, [query.data, setCartCount]);

  return query;
};

// Update quantity mutation
export const useUpdateQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, quantity }) => cartApi.updateQuantity(cartId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      // toastSuccess('Quantity updated');
    },
    onError: (error) => {
      const message = error?.message || 'Failed to update quantity';
      toastError(message);

      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

// Remove from cart mutation
export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  const { cartCount, setCartCount } = useCartStore();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      // Optimistically decrement cart count
      setCartCount(Math.max(0, cartCount - 1));
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      toastSuccess('Item removed from cart');
    },
    onError: (error) => {
      toastError(error.response?.data?.message || 'Failed to remove item');
    },
  });
};

// Clear cart mutation
export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toastSuccess('Cart cleared');
    },
    onError: (error) => {
      toastError(error.response?.data?.message || 'Failed to clear cart');
    },
  });
};
