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

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', validate(resendOTPSchema), authController.resendOTP);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/verify-reset-otp',
  validate(verifyResetOTPSchema),
  authController.verifyResetOTP
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
