import { z } from 'zod';

export const registerSchema = z.strictObject(
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
  },
  { error: 'Invalid registration credentials' }
);

export const loginSchema = z.strictObject(
  {
    email: z.string().trim().email('Invalid email format'),
    password: z.string().trim().min(1, 'Password is required').max(100),
  },
  { error: 'Invalid login credentials' }
);

export const verifyOTPSchema = z.strictObject(
  {
    token: z.string().trim().min(1, 'Token is required'),
    otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
  },
  { error: 'Invalid OTP verification credentials' }
);

export const resendOTPSchema = z.strictObject(
  {
    token: z.string().trim().min(1, 'Token is required'),
  },
  { error: 'Invalid OTP resend credentials' }
);

export const forgotPasswordSchema = z.strictObject(
  {
    email: z.string().trim().email('Invalid email format'),
  },
  { error: 'Invalid forgot password credentials' }
);

export const verifyResetOTPSchema = z.strictObject(
  {
    token: z.string().trim().min(1, 'Token is required'),
    otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
  },
  { error: 'Invalid reset OTP verification credentials' }
);

export const resetPasswordSchema = z.strictObject(
  {
    token: z.string().trim().min(1, 'Token is required'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  },
  { error: 'Invalid password reset credentials' }
);

export const updateProfileSchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50)
      .optional(),
    avatar: z.string().trim().optional(),
  },
  { error: 'Invalid profile update data' }
);

export const changePasswordSchema = z.strictObject(
  {
    currentPassword: z.string().trim().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .trim()
      .min(8, 'New password must be at least 8 characters long')
      .max(100, 'New password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  },
  { error: 'Invalid password change data' }
);
