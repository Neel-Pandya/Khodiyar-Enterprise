import { create } from 'zustand';
import { favoriteApi } from '../api/favoriteApi';

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
  togglingIds: new Set(), // Track which products are being toggled

  // Fetch all favorites with pagination
  fetchFavorites: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await favoriteApi.getFavorites(params);
      const { favorites, pagination } = response.data;

      // Extract product IDs for quick lookup
      const favoriteIds = new Set(
        favorites.map((f) => f.product_id || f.product?.id)
      );

      set({
        favorites,
        favoriteIds,
        pagination,
        isLoading: false,
      });

      return { favorites, pagination };
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch favorites',
        isLoading: false,
      });
      throw error;
    }
  },

  // Check if a product is favorited
  checkFavorite: async (productId) => {
    try {
      const response = await favoriteApi.checkFavorite(productId);
      const { isFavorite } = response.data;

      // Update the local Set
      const { favoriteIds } = get();
      const newFavoriteIds = new Set(favoriteIds);

      if (isFavorite) {
        newFavoriteIds.add(productId);
      } else {
        newFavoriteIds.delete(productId);
      }

      set({ favoriteIds: newFavoriteIds });
      return isFavorite;
    } catch (error) {
      // Silently fail - product might not be favorited
      return false;
    }
  },

  // Toggle favorite status with optimistic update
  toggleFavorite: async (productId, productData = null) => {
    const { favoriteIds, togglingIds, favorites } = get();

    // Prevent double-clicks
    if (togglingIds.has(productId)) {
      return null;
    }

    // Optimistic update - immediately update UI
    const wasFavorited = favoriteIds.has(productId);
    const newFavoriteIds = new Set(favoriteIds);
    const newTogglingIds = new Set(togglingIds);

    if (wasFavorited) {
      newFavoriteIds.delete(productId);
    } else {
      newFavoriteIds.add(productId);
    }
    newTogglingIds.add(productId);

    set({
      favoriteIds: newFavoriteIds,
      togglingIds: newTogglingIds,
    });

    try {
      const response = await favoriteApi.toggleFavorite(productId);
      const { isFavorite, product } = response.data;

      // Update favorites list if needed
      let newFavorites = favorites;
      if (isFavorite && product) {
        // Add to favorites list (with product data if available)
        const favoriteItem = productData
          ? { id: `${productId}-fav`, product_id: productId, product: productData }
          : { id: `${productId}-fav`, product_id: productId, product };
        newFavorites = [favoriteItem, ...favorites];
      } else if (!isFavorite) {
        // Remove from favorites list
        newFavorites = favorites.filter(
          (f) => f.product_id !== productId && f.product?.id !== productId
        );
      }

      // Remove from toggling set
      const finalTogglingIds = new Set(newTogglingIds);
      finalTogglingIds.delete(productId);

      set({
        favorites: newFavorites,
        togglingIds: finalTogglingIds,
        pagination: {
          ...get().pagination,
          total: isFavorite
            ? get().pagination.total + 1
            : Math.max(0, get().pagination.total - 1),
        },
      });

      return isFavorite;
    } catch (error) {
      // Rollback on error - revert to original state
      const rollbackFavoriteIds = new Set(favoriteIds);
      const rollbackTogglingIds = new Set(togglingIds);
      rollbackTogglingIds.delete(productId);

      set({
        favoriteIds: rollbackFavoriteIds,
        togglingIds: rollbackTogglingIds,
        error: error?.message || 'Failed to toggle favorite',
      });

      throw error;
    }
  },

  // Check if a product is currently favorited (local state)
  isFavorite: (productId) => {
    return get().favoriteIds.has(productId);
  },

  // Check if a product is currently being toggled
  isToggling: (productId) => {
    return get().togglingIds.has(productId);
  },

  // Remove a favorite from the list (used in FavoritesPage)
  removeFavorite: async (productId) => {
    const { favorites, favoriteIds, pagination } = get();

    // Optimistic update
    const newFavoriteIds = new Set(favoriteIds);
    newFavoriteIds.delete(productId);

    const newFavorites = favorites.filter(
      (f) => f.product_id !== productId && f.product?.id !== productId
    );

    set({
      favorites: newFavorites,
      favoriteIds: newFavoriteIds,
      pagination: {
        ...pagination,
        total: Math.max(0, pagination.total - 1),
      },
    });

    // Make API call
    try {
      await favoriteApi.toggleFavorite(productId);
    } catch (error) {
      // Rollback on error
      set({
        favorites,
        favoriteIds,
        pagination,
        error: error?.message || 'Failed to remove favorite',
      });
      throw error;
    }
  },

  // Clear all favorites (used on logout)
  clearFavorites: () => {
    set({
      favorites: [],
      favoriteIds: new Set(),
      pagination: {
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
      },
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useFavoriteStore;
