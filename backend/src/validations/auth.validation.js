import { z } from 'zod';
import { passwordField } from './common.validation.js';

export const registerSchema = z.strictObject(
  {
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50),
    email: z.string().trim().email('Invalid email format'),
    password: passwordField,
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
    password: passwordField,
  },
  { error: 'Invalid password reset credentials' }
);
