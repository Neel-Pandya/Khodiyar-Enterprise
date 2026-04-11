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
  stock_quantity: z.coerce
    .number({ required_error: 'Stock quantity is required' })
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative'),
  category_id: z.string().uuid({ message: 'Invalid category ID format' }),
  is_active: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
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
  stock_quantity: z.coerce
    .number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative')
    .optional(),
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
  existing_images: z.string().optional(), // JSON string of existing image URLs
  is_active: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

export const getProductsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(['available', 'out_of_stock']).optional(),
  is_active: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  category_id: z.string().uuid('Invalid category ID format').optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(['id', 'name', 'price', 'status', 'created_at', 'updated_at'])
    .default('created_at')
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export const productIdSchema = z.object({
  id: z.uuid({ error: 'Invalid product ID format' }),
});
