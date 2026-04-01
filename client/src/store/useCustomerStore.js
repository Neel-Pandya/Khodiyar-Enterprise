import { create } from 'zustand';
import { customerApi } from '../api/customerApi';

const useCustomerStore = create((set, get) => ({
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
        hasFetched: true,
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
      set(state => ({
        customers: [response.data, ...state.customers],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        isLoading: false,
      }));
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
    try {
      const response = await customerApi.updateCustomer(id, customerData);
      set(state => ({
        customer: response.data,
        customers: state.customers.map(c => c.id === id ? response.data : c)
      }));
      return response.data;
    } catch (error) {
      set({
        error: error?.message || 'Failed to update customer',
      });
      throw error;
    }
  },

  // Delete customer (mark as suspended)
  deleteCustomer: async (id) => {
    try {
      await customerApi.deleteCustomer(id);
      set(state => ({
        customers: state.customers.map(c => c.id === id ? { ...c, status: 'suspended' } : c),
        customer: state.customer && state.customer.id === id ? { ...state.customer, status: 'suspended' } : state.customer,
      }));
      return true;
    } catch (error) {
      set({
        error: error?.message || 'Failed to delete customer',
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

export default useCustomerStore;