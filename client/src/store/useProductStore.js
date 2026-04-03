import { create } from 'zustand';

const useProductStore = create((set) => ({
  // Client-only state
  products: [],
  product: null,
  hasFetched: false,
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },

  // Setter methods for query hooks to sync data
  setProducts: (products) => set({ products }),
  setProduct: (product) => set({ product }),
  setPagination: (pagination) => set({ pagination }),
  setHasFetched: (hasFetched) => set({ hasFetched }),

  // Helpers for mutations
  addProduct: (newProduct) => set((state) => ({
    products: [newProduct, ...state.products],
  })),

  updateProductInStore: (id, updatedProduct) => set((state) => ({
    product: state.product?.id === id ? updatedProduct : state.product,
    products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
  })),

  markProductDeleted: (id) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, is_active: false } : p)),
    product: state.product?.id === id ? { ...state.product, is_active: false } : state.product,
  })),

  // Reset store
  reset: () => set({
    products: [],
    product: null,
    hasFetched: false,
    pagination: {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    },
  }),
}));

export default useProductStore;
