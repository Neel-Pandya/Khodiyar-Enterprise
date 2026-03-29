import { z } from 'zod';

export const createUserSchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50),
    email: z.string().trim().email('Invalid email format'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    role: z.enum(['admin', 'user']).optional(),
  },
  { error: 'Invalid user creation data' }
);

export const updateUserSchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50)
      .optional(),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .optional(),
    role: z.enum(['admin', 'user']).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  },
  { error: 'Invalid user update data' }
);

export const getUsersSchema = z.object(
  {
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    role: z.enum(['admin', 'user']).optional(),
  },
  { error: 'Invalid pagination parameters' }
);
