import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { productApi } from '@/api/productApi';
import useProductStore from '@/store/useProductStore';

// Query keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (params) => [...productKeys.lists(), { params }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

// Fetch all products with pagination
export const useProductsQuery = (params = {}, options = {}) => {
  const { setProducts, setPagination, setHasFetched } = useProductStore();

  // Clean params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  );

  const query = useQuery({
    queryKey: productKeys.list(cleanParams),
    queryFn: async () => {
      const response = await productApi.getAllProducts(cleanParams);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setProducts(query.data.products || []);
      setPagination(query.data.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
      setHasFetched(true);
    }
  }, [query.data, setProducts, setPagination, setHasFetched]);

  return query;
};

// Fetch single product by ID
export const useProductQuery = (id) => {
  const { setProduct } = useProductStore();

  const query = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await productApi.getProduct(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setProduct(query.data);
    }
  }, [query.data, setProduct]);

  return query;
};

// Create product mutation
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const { addProduct, setPagination, pagination } = useProductStore();

  return useMutation({
    mutationFn: async (productData) => {
      const response = await productApi.createProduct(productData);
      return response.data;
    },
    onSuccess: (data) => {
      addProduct(data);
      setPagination({ ...pagination, total: pagination.total + 1 });
      // Invalidate products list to refresh
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const { updateProductInStore } = useProductStore();

  return useMutation({
    mutationFn: async ({ id, productData }) => {
      const response = await productApi.updateProduct(id, productData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      updateProductInStore(variables.id, data);
      // Update cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { markProductDeleted } = useProductStore();

  return useMutation({
    mutationFn: async (id) => {
      await productApi.deleteProduct(id);
      return id;
    },
    onSuccess: (id) => {
      markProductDeleted(id);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
};
