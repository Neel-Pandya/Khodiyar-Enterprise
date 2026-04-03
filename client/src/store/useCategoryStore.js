import { create } from 'zustand';

const useCategoryStore = create((set) => ({
  // Client-only state
  categories: [],
  category: null,
  hasFetched: false,
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },

  // Setter methods for query hooks to sync data
  setCategories: (categories) => set({ categories }),
  setCategory: (category) => set({ category }),
  setPagination: (pagination) => set({ pagination }),
  setHasFetched: (hasFetched) => set({ hasFetched }),

  // Helpers for mutations
  addCategory: (newCategory) => set((state) => ({
    categories: [newCategory, ...state.categories],
  })),

  updateCategoryInStore: (id, updatedCategory) => set((state) => ({
    category: state.category?.id === id ? updatedCategory : state.category,
    categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
  })),

  markCategoryDeleted: (id) => set((state) => ({
    categories: state.categories.map((c) => (c.id === id ? { ...c, status: 'inactive' } : c)),
    category: state.category?.id === id ? { ...state.category, status: 'inactive' } : state.category,
  })),

  // Reset store
  reset: () => set({
    categories: [],
    category: null,
    hasFetched: false,
    pagination: {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    },
  }),
}));

export default useCategoryStore;
