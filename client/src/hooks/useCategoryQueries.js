import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { categoryApi } from '@/api/categoryApi';
import useCategoryStore from '@/store/useCategoryStore';

// Query keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (params) => [...categoryKeys.lists(), { params }],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
};

// Fetch all categories with pagination
export const useCategoriesQuery = (params = {}, options = {}) => {
  const { setCategories, setPagination, setHasFetched } = useCategoryStore();

  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await categoryApi.getAllCategories(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setCategories(query.data.categories || []);
      setPagination(query.data.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
      setHasFetched(true);
    }
  }, [query.data, setCategories, setPagination, setHasFetched]);

  return query;
};

// Fetch single category by ID
export const useCategoryQuery = (id) => {
  const { setCategory } = useCategoryStore();

  const query = useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await categoryApi.getCategory(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Sync data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setCategory(query.data);
    }
  }, [query.data, setCategory]);

  return query;
};

// Create category mutation
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { addCategory } = useCategoryStore();

  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await categoryApi.createCategory(categoryData);
      return response.data;
    },
    onSuccess: (data) => {
      addCategory(data);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Update category mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { updateCategoryInStore } = useCategoryStore();

  return useMutation({
    mutationFn: async ({ id, categoryData }) => {
      const response = await categoryApi.updateCategory(id, categoryData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      updateCategoryInStore(variables.id, data);
      queryClient.setQueryData(categoryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Delete category mutation
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { markCategoryDeleted } = useCategoryStore();

  return useMutation({
    mutationFn: async (id) => {
      await categoryApi.deleteCategory(id);
      return id;
    },
    onSuccess: (id) => {
      markCategoryDeleted(id);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
};
