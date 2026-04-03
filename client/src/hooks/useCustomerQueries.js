import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { customerApi } from '@/api/customerApi';
import useCustomerStore from '@/store/useCustomerStore';

// Query keys
export const customerKeys = {
  all: ['customers'],
  lists: () => [...customerKeys.all, 'list'],
  list: (params) => [...customerKeys.lists(), { params }],
  details: () => [...customerKeys.all, 'detail'],
  detail: (id) => [...customerKeys.details(), id],
};

// Fetch all customers with pagination
export const useCustomersQuery = (params = {}, options = {}) => {
  const { setCustomers, setPagination, setHasFetched } = useCustomerStore();

  const query = useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async () => {
      const response = await customerApi.getAllCustomers(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setCustomers(query.data.users || []);
      setPagination(query.data.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
      setHasFetched(true);
    }
  }, [query.data, setCustomers, setPagination, setHasFetched]);

  return query;
};

// Fetch single customer by ID
export const useCustomerQuery = (id) => {
  const { setCustomer } = useCustomerStore();

  const query = useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => {
      const response = await customerApi.getCustomer(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setCustomer(query.data);
    }
  }, [query.data, setCustomer]);

  return query;
};

// Create customer mutation
export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { addCustomer } = useCustomerStore();

  return useMutation({
    mutationFn: async (customerData) => {
      const response = await customerApi.createCustomer(customerData);
      return response.data;
    },
    onSuccess: (data) => {
      addCustomer(data);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};

// Update customer mutation
export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { updateCustomerInStore } = useCustomerStore();

  return useMutation({
    mutationFn: async ({ id, customerData }) => {
      const response = await customerApi.updateCustomer(id, customerData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      updateCustomerInStore(variables.id, data);
      queryClient.setQueryData(customerKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};

// Delete customer mutation
export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { markCustomerDeleted } = useCustomerStore();

  return useMutation({
    mutationFn: async (id) => {
      await customerApi.deleteCustomer(id);
      return id;
    },
    onSuccess: (id) => {
      markCustomerDeleted(id);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.removeQueries({ queryKey: customerKeys.detail(id) });
    },
  });
};
