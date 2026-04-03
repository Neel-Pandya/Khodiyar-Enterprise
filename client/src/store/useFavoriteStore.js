import { create } from 'zustand';

const useFavoriteStore = create((set, get) => ({
  // Client-only state
  favorites: [],
  favoriteIds: new Set(),
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  togglingIds: new Set(), // Track which products are being toggled

  // Setter methods for query hooks to sync data
  setFavorites: (favorites) => set({ favorites }),
  setFavoriteIds: (favoriteIds) => set({ favoriteIds }),
  setPagination: (pagination) => set({ pagination }),
  setFavoriteId: (productId, isFavorite) => {
    const { favoriteIds } = get();
    const newFavoriteIds = new Set(favoriteIds);
    if (isFavorite) {
      newFavoriteIds.add(productId);
    } else {
      newFavoriteIds.delete(productId);
    }
    set({ favoriteIds: newFavoriteIds });
  },

  // Check if a product is currently favorited (local state)
  isFavorite: (productId) => {
    return get().favoriteIds.has(productId);
  },

  // Check if a product is currently being toggled
  isToggling: (productId) => {
    return get().togglingIds.has(productId);
  },

  // Optimistic toggle favorite (used by components for instant UI feedback)
  optimisticToggle: (productId) => {
    const { favoriteIds, togglingIds } = get();
    if (togglingIds.has(productId)) return null;

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

    return { wasFavorited, newFavoriteIds, newTogglingIds };
  },

  // Complete toggle (after API call)
  completeToggle: (productId, isFavorite, productData = null) => {
    const { favorites, togglingIds } = get();
    let newFavorites = favorites;

    if (isFavorite && productData) {
      const favoriteItem = {
        id: `${productId}-fav`,
        product_id: productId,
        product: productData,
      };
      newFavorites = [favoriteItem, ...favorites];
    } else if (!isFavorite) {
      newFavorites = favorites.filter(
        (f) => f.product_id !== productId && f.product?.id !== productId
      );
    }

    const finalTogglingIds = new Set(togglingIds);
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
  },

  // Rollback toggle on error
  rollbackToggle: (productId, wasFavorited) => {
    const { favoriteIds, togglingIds } = get();
    const rollbackFavoriteIds = new Set(favoriteIds);
    const rollbackTogglingIds = new Set(togglingIds);

    // Restore original state
    if (wasFavorited) {
      rollbackFavoriteIds.add(productId);
    } else {
      rollbackFavoriteIds.delete(productId);
    }
    rollbackTogglingIds.delete(productId);

    set({
      favoriteIds: rollbackFavoriteIds,
      togglingIds: rollbackTogglingIds,
    });
  },

  // Optimistic remove favorite
  optimisticRemove: (productId) => {
    const { favorites, favoriteIds, pagination } = get();

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

    // Return previous state for rollback
    return { favorites, favoriteIds, pagination };
  },

  // Rollback remove on error
  rollbackRemove: (previousState) => {
    set({
      favorites: previousState.favorites,
      favoriteIds: previousState.favoriteIds,
      pagination: previousState.pagination,
    });
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
      togglingIds: new Set(),
    });
  },
}));

export default useFavoriteStore;
