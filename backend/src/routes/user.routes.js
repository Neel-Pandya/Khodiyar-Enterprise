import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  getUsersSchema,
} from '../validations/user.validation.js';
import { Roles } from '../configs/roles.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';

const router = Router();

// All routes here require authentication and admin role
router.use(authenticate);
router.use(authorize(Roles.ADMIN));

/**
 * @route GET /api/users
 * @desc Get all users with pagination
 * @access Admin
 */
router.get('/', validate(getUsersSchema, 'query'), userController.getAllUsers);

/**
 * @route POST /api/users
 * @desc Create a new user
 * @access Admin
 */
router.post('/', validate(createUserSchema), userController.createUser);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Admin
 */
router.get('/:id', userController.getUser);

/**
 * @route PATCH /api/users/:id
 * @desc Update user details
 * @access Admin
 */
router.patch('/:id', uploadAvatar, validate(updateUserSchema), userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user (soft delete)
 * @access Admin
 */
router.delete('/:id', userController.deleteUser);

export default router;
