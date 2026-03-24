import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  verifyResetOTPSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify account email OTP
 * @access Public
 */
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);

/**
 * @route POST /api/auth/resend-otp
 * @desc Resend account verification OTP
 * @access Public
 */
router.post('/resend-otp', validate(resendOTPSchema), authController.resendOTP);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset OTP
 * @access Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @route POST /api/auth/verify-reset-otp
 * @desc Verify password reset OTP
 * @access Public
 */
router.post(
  '/verify-reset-otp',
  validate(verifyResetOTPSchema),
  authController.verifyResetOTP
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password using token
 * @access Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
