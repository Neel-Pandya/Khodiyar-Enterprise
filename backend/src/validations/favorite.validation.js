import { z } from 'zod';

/**
 * Schema for toggling favorite status
 */
export const toggleFavoriteSchema = z.object({
  product_id: z.string().uuid({ message: 'Invalid product ID' }),
});

/**
 * Schema for product ID parameter
 */
export const productIdSchema = z.object({
  productId: z.string().uuid({ message: 'Invalid product ID' }),
});
