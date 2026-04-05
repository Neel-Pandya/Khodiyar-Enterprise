import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // State
  cartItems: [],
  cartCount: 0,
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },

  // Setter methods
  setCartItems: (cartItems) => set({ cartItems }),
  setCartCount: (count) => set({ cartCount: count }),
  setPagination: (pagination) => set({ pagination }),

  // Optimistic updates
  addItemOptimistic: (cartItem) => set((state) => ({
    cartItems: [cartItem, ...state.cartItems],
    cartCount: state.cartCount + 1,
  })),

  updateItemOptimistic: (cartId, quantity) => set((state) => ({
    cartItems: state.cartItems.map((item) =>
      item.id === cartId ? { ...item, quantity } : item
    ),
  })),

  removeItemOptimistic: (cartId) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== cartId),
    cartCount: Math.max(0, state.cartCount - 1),
  })),

  clearCartOptimistic: () => set({ cartItems: [], cartCount: 0 }),

  // Reset store
  reset: () =>
    set({
      cartItems: [],
      cartCount: 0,
      pagination: {
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
      },
    }),
}));

export default useCartStore;
