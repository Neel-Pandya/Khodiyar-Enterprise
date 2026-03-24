import { z } from 'zod';
import { passwordField } from './common.validation.js';

/**
 * Validation schema for profile update
 * All fields are optional, but at least one field or file must be provided
 * Used by both admin and regular users
 */
export const updateProfileSchema = z
  .strictObject(
    {
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must not exceed 50 characters')
        .optional(),
      phone: z
        .union([
          z
            .string()
            .trim()
            .regex(/^\d{10,15}$/, 'Phone must be 10-15 digits')
            .optional(),
          z.literal(''),
        ])
        .optional()
        .transform((val) => (val === '' ? null : val)),
    },
    { error: 'Invalid profile update data' }
  )
  .refine((data) => data.name || data.phone !== undefined, {
    message:
      'At least one field (name, phone, or avatar file) must be provided',
  });

/**
 * Validation schema for password change
 * Requires current password, new password, and confirm password
 */
export const changePasswordSchema = z
  .strictObject(
    {
      currentPassword: z.string().trim().min(1, 'Current password is required'),
      newPassword: passwordField,
      confirmPassword: z.string().trim().min(1, 'Confirm password is required'),
    },
    { error: 'Invalid password change data' }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password must match',
    path: ['confirmPassword'],
  });
