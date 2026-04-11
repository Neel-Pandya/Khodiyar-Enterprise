import { z } from 'zod';

// Order ID param validation
export const orderIdParamSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
});

// Update order status schema
export const updateOrderStatusSchema = z
  .object({
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
    payment_status: z
      .enum(['pending', 'completed', 'failed', 'refunded'])
      .optional(),
  })
  .refine((data) => data.status || data.payment_status, {
    message: 'At least one of status or payment_status must be provided',
  });

// Get all orders query schema
export const getAdminOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val, 10) : 10;
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
  payment_status: z
    .enum(['pending', 'completed', 'failed', 'refunded'])
    .optional(),
  payment_type: z.enum(['cod', 'online']).optional(),
  sort_by: z
    .enum(['created_at', 'total_amount', 'status'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});
