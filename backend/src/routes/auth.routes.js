import { Router } from 'express';
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
  checkVerificationStatusSchema,
  initiateLoginVerificationSchema,
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
router.post(
  '/login',
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
router.patch(
  '/me',
  authenticate,
  uploadAvatar,
  validate(updateProfileSchema),
  authController.updateProfile
);

/**
 * @route POST /api/auth/change-password
 * @desc Change current user password
 * @access Private
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * @route POST /api/auth/check-verification-status
 * @desc Check verification link status for inactive user
 * @access Public
 */
router.post(
  '/check-verification-status',
  validate(checkVerificationStatusSchema),
  authController.checkVerificationStatus
);

/**
 * @route POST /api/auth/initiate-login-verification
 * @desc Send verification email when user tries to login with inactive email
 * @access Public
 */
router.post(
  '/initiate-login-verification',
  validate(initiateLoginVerificationSchema),
  authController.initiateLoginVerification
);

export default router;
