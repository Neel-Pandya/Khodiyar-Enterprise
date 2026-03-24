import { Router } from 'express';
import profileController from '../controllers/profile.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/profile.validation.js';

const router = Router();

/**
 * @route PATCH /api/profile
 * @desc Update own profile (name, phone, avatar)
 * @access Authenticated users (both admin and regular users)
 */
router.patch(
  '/',
  authenticate,
  uploadAvatar,
  validate(updateProfileSchema),
  profileController.updateProfile
);

/**
 * @route PATCH /api/profile/change-password
 * @desc Change user password
 * @access Authenticated users (both admin and regular users)
 */
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  profileController.changePassword
);

export default router;
