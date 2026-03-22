import { z } from 'zod';

export const createCategorySchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters long')
      .max(100, 'Category name must not exceed 100 characters'),
    status: z.enum(['active', 'inactive']).optional(),
  },
  { error: 'Invalid category creation data' }
);

export const updateCategorySchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters long')
      .max(100, 'Category name must not exceed 100 characters')
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
  },
  { error: 'Invalid category update data' }
);

export const getCategoriesSchema = z.object(
  {
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(['active', 'inactive']).optional(),
    search: z.string().trim().optional(),
  },
  { error: 'Invalid query parameters' }
);

export const categoryIdSchema = z.object({
  id: z.string().uuid('Invalid category ID format'),
});
