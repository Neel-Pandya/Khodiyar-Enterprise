import { create } from 'zustand';

const useCustomerStore = create((set) => ({
  // Client-only state
  customers: [],
  customer: null,
  hasFetched: false,
  stats: {
    total: 0,
    active: 0,
    newThisMonth: 0,
    totalRevenue: 0,
  },
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },

  // Setter methods for query hooks to sync data
  setCustomers: (customers) => set({ customers }),
  setCustomer: (customer) => set({ customer }),
  setPagination: (pagination) => set({ pagination }),
  setHasFetched: (hasFetched) => set({ hasFetched }),
  setStats: (stats) => set({ stats }),

  // Helpers for mutations
  addCustomer: (newCustomer) => set((state) => ({
    customers: [newCustomer, ...state.customers],
  })),

  updateCustomerInStore: (id, updatedCustomer) => set((state) => ({
    customer: state.customer?.id === id ? updatedCustomer : state.customer,
    customers: state.customers.map((c) => (c.id === id ? updatedCustomer : c)),
  })),

  markCustomerDeleted: (id) => set((state) => ({
    customers: state.customers.map((c) => (c.id === id ? { ...c, status: 'suspended' } : c)),
    customer: state.customer?.id === id ? { ...state.customer, status: 'suspended' } : state.customer,
  })),

  // Reset store
  reset: () => set({
    customers: [],
    customer: null,
    hasFetched: false,
    stats: {
      total: 0,
      active: 0,
      newThisMonth: 0,
      totalRevenue: 0,
    },
    pagination: {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    },
  }),
}));

export default useCustomerStore;