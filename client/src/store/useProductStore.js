import { create } from 'zustand';
import { productApi } from '../api/productApi';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  hasFetched: false,
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,

  // Fetch all products with pagination
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getAllProducts(params);
      set({
        products: response.data?.products || [],
        pagination: response.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 },
        isLoading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch products',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch product by ID
  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getProduct(id);
      set({
        product: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch product',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await productApi.createProduct(productData);
      set(state => ({
        products: [response.data, ...state.products],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to create product',
      });
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await productApi.updateProduct(id, productData);
      set(state => ({
        product: response.data,
        products: state.products.map(p => p.id === id ? response.data : p),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to update product',
      });
      throw error;
    }
  },

  // Delete product (set is_active to false)
  deleteProduct: async (id) => {
    try {
      await productApi.deleteProduct(id);
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, is_active: false } : p),
        product: state.product && state.product.id === id ? { ...state.product, is_active: false } : state.product,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error?.message || 'Failed to delete product',
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    products: [],
    product: null,
    hasFetched: false,
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    },
  }),
}));

export default useProductStore;
