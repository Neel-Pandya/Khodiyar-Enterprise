import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(2, 'Product name must be at least 2 characters long')
    .max(255, 'Product name must not exceed 255 characters'),
  price: z.coerce
    .number({ required_error: 'Price is required' })
    .positive('Price must be a positive number'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
  category_id: z.uuid({ error: 'Invalid category ID format' }),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters long'),
  included: z
    .string({ required_error: 'Included items are required' })
    .trim()
    .min(2, 'Included field must be at least 2 characters long'),
  specification: z
    .string({ required_error: 'Specification is required' })
    .trim()
    .min(2, 'Specification must be at least 2 characters long'),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters long')
    .max(255, 'Product name must not exceed 255 characters')
    .optional(),
  price: z.coerce
    .number()
    .positive('Price must be a positive number')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
  category_id: z.string().uuid('Invalid category ID format').optional(),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long')
    .optional(),
  included: z
    .string()
    .trim()
    .min(2, 'Included field must be at least 2 characters long')
    .optional(),
  specification: z
    .string()
    .trim()
    .min(2, 'Specification must be at least 2 characters long')
    .optional(),
  images: z.array(z.string().url()).min(1).max(4).optional(),
});

export const getProductsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(['active', 'inactive']).optional(),
  category_id: z.uuid('Invalid category ID format').optional(),
  search: z.string().trim().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export const productIdSchema = z.object({
  id: z.uuid({ error: 'Invalid product ID format' }),
});
