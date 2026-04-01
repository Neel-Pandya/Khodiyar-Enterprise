import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/auth.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  verifyResetOTPSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

// Rate limiters for different auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
});

const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP verification attempts per windowMs
  message:
    'Too many OTP verification attempts from this IP, please try again later.',
});

const resendOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 OTP resend requests per windowMs
  message: 'Too many OTP resend requests from this IP, please try again later.',
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 forgot password requests per windowMs
  message:
    'Too many password reset requests from this IP, please try again later.',
});

const verifyResetOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 OTP verification attempts per windowMs
  message:
    'Too many OTP verification attempts from this IP, please try again later.',
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 password reset attempts per windowMs
  message:
    'Too many password reset attempts from this IP, please try again later.',
});

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
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login
);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify account email OTP
 * @access Public
 */
router.post(
  '/verify-otp',
  verifyOTPLimiter,
  validate(verifyOTPSchema),
  authController.verifyOTP
);

/**
 * @route POST /api/auth/resend-otp
 * @desc Resend account verification OTP
 * @access Public
 */
router.post(
  '/resend-otp',
  resendOTPLimiter,
  validate(resendOTPSchema),
  authController.resendOTP
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset OTP
 * @access Public
 */
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
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
  verifyResetOTPLimiter,
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
  resetPasswordLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @route GET /api/auth/me
 * @desc Get current user data
 * @access Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route PATCH /api/auth/me
 * @desc Update current user profile
 * @access Private
 */
router.patch('/me', authenticate, uploadAvatar, validate(updateProfileSchema), authController.updateProfile);

/**
 * @route POST /api/auth/change-password
 * @desc Change current user password
 * @access Private
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
