import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { favoriteApi } from '@/api/favoriteApi';
import useFavoriteStore from '@/store/useFavoriteStore';

// Query keys
export const favoriteKeys = {
  all: ['favorites'],
  lists: () => [...favoriteKeys.all, 'list'],
  list: (params) => [...favoriteKeys.lists(), { params }],
  check: (productId) => [...favoriteKeys.all, 'check', productId],
};

// Fetch all favorites with pagination
export const useFavoritesQuery = (params = {}, options = {}) => {
  const { setFavorites, setFavoriteIds, setPagination } = useFavoriteStore();

  const query = useQuery({
    queryKey: favoriteKeys.list(params),
    queryFn: async () => {
      const response = await favoriteApi.getFavorites(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      const { favorites, pagination } = query.data;
      const favoriteIds = new Set(
        (favorites || []).map((f) => f.product_id || f.product?.id)
      );
      setFavorites(favorites || []);
      setFavoriteIds(favoriteIds);
      setPagination(pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
    }
  }, [query.data, setFavorites, setFavoriteIds, setPagination]);

  return query;
};

// Check if a product is favorited
export const useCheckFavoriteQuery = (productId) => {
  const { setFavoriteId } = useFavoriteStore();

  const query = useQuery({
    queryKey: favoriteKeys.check(productId),
    queryFn: async () => {
      const response = await favoriteApi.checkFavorite(productId);
      return response.data;
    },
    enabled: !!productId,
    staleTime: 1 * 60 * 1000, // 1 minute for check
  });

  // Sync to store
  useEffect(() => {
    if (query.data?.isFavorite !== undefined && productId) {
      setFavoriteId(productId, query.data.isFavorite);
    }
  }, [query.data, productId, setFavoriteId]);

  return query;
};

// Toggle favorite mutation (preserves optimistic updates in store)
export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const response = await favoriteApi.toggleFavorite(productId);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
    },
  });
};

// Remove favorite mutation
export const useRemoveFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      await favoriteApi.toggleFavorite(productId);
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      queryClient.removeQueries({ queryKey: favoriteKeys.check(productId) });
    },
  });
};
