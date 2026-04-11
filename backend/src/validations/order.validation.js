import { z } from 'zod';

// Email NOT included - comes from auth token, not request body
export const createOrderSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(10, 'Phone number is required').max(20),
  address: z.string().min(5, 'Address is required').max(255),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(6, 'Valid pincode required').max(10),
  payment_type: z.enum(['cod', 'online']).default('cod'),
});

export const orderIdParamSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
});

export const getOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val) : 10;
      return Math.min(Math.max(parsed, 1), 100); // Bounds: 1-100
    }),
  status: z
    .enum([
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ])
    .optional(),
  sort_by: z
    .enum(['created_at', 'total_amount', 'status'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});
