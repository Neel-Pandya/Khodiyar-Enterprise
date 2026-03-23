import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesSchema,
  categoryIdSchema,
} from '../validations/category.validation.js';
import { Roles } from '../configs/roles.js';

const router = Router();

// Public routes
/**
 * @route GET /api/categories
 * @desc Get all categories with pagination
 * @access Public
 */
router.get(
  '/',
  validate(getCategoriesSchema, 'query'),
  categoryController.getCategories
);

/**
 * @route GET /api/categories/:id
 * @desc Get category by ID
 * @access Public
 */
router.get(
  '/:id',
  validate(categoryIdSchema, 'params'),
  categoryController.getCategory
);

// Private routes (requires authentication and admin role)
router.use(authenticate);
router.use(authorize(Roles.ADMIN));

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Admin
 */
router.post(
  '/',
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @route PATCH /api/categories/:id
 * @desc Update category details
 * @access Admin
 */
router.patch(
  '/:id',
  validate(categoryIdSchema, 'params'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete category (soft delete)
 * @access Admin
 */
router.delete(
  '/:id',
  validate(categoryIdSchema, 'params'),
  categoryController.deleteCategory
);

export default router;
