import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const cartIdParamSchema = z.object({
  cartId: z.string().uuid('Invalid cart ID'),
});

export const getCartQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
});
