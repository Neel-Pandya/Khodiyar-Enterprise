import { create } from 'zustand';
import { customerApi } from '../api/customerApi';

const useCustomerStore = create((set, get) => ({
  customers: [],
  customer: null,
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
  isLoading: false,
  error: null,

  // Fetch all customers with pagination
  fetchCustomers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.getAllCustomers(params);
      set({
        customers: response.data.users,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch customers',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch customer by ID
  fetchCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.getCustomer(id);
      set({
        customer: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to fetch customer',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.createCustomer(customerData);
      set({ isLoading: false });
      // Refresh the customers list
      await get().fetchCustomers();
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to create customer',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.updateCustomer(id, customerData);
      set(state => ({
        isLoading: false,
        customer: response.data,
        customers: state.customers.map(c => c.id === id ? response.data : c)
      }));
      // Refresh the customers list
      await get().fetchCustomers();
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to update customer',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customerApi.deleteCustomer(id);
      set({ isLoading: false });
      // Refresh the customers list
      await get().fetchCustomers();
    } catch (error) {
      set({
        error: error?.message || 'Failed to delete customer',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    customers: [],
    customer: null,
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

export default useCustomerStore;