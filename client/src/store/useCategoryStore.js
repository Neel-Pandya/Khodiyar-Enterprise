import { create } from 'zustand';
import { categoryApi } from '../api/categoryApi';

const useCategoryStore = create((set, get) => ({
  categories: [],
  category: null,
  hasFetched: false,
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,

  // Fetch all categories with pagination
  fetchCategories: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.getAllCategories(params);
      // response is the ApiResponse object: { statusCode, message, data, success }
      set({
        categories: response.data?.categories || [],
        pagination: response.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 },
        isLoading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch categories',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch category by ID
  fetchCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.getCategory(id);
      set({
        category: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch category',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.createCategory(categoryData);
      set(state => ({
        categories: [response.data, ...state.categories],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to create category',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    set({ error: null });
    try {
      const response = await categoryApi.updateCategory(id, categoryData);
      set(state => ({
        category: response.data,
        categories: state.categories.map(c => c.id === id ? response.data : c),
      }));
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to update category',
      });
      throw error;
    }
  },

  // Delete category (soft delete - sets status to inactive)
  deleteCategory: async (id) => {
    try {
      await categoryApi.deleteCategory(id);
      set(state => ({
        categories: state.categories.map(c => c.id === id ? { ...c, status: 'inactive' } : c),
        category: state.category && state.category.id === id ? { ...state.category, status: 'inactive' } : state.category,
      }));
      return true;
    } catch (error) {
      set({
        error: error?.message || 'Failed to delete category',
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    categories: [],
    category: null,
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

export default useCategoryStore;
