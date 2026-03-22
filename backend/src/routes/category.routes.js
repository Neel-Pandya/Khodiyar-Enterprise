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

// Public routes (if any, but usually list is public)
router.get(
  '/',
  validate(getCategoriesSchema, 'query'),
  categoryController.getCategories
);
router.get(
  '/:id',
  validate(categoryIdSchema, 'params'),
  categoryController.getCategory
);

// Private routes (requires authentication and admin role)
router.use(authenticate);
router.use(authorize(Roles.ADMIN));

router.post(
  '/',
  validate(createCategorySchema),
  categoryController.createCategory
);
router.patch(
  '/:id',
  validate(categoryIdSchema, 'params'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  validate(categoryIdSchema, 'params'),
  categoryController.deleteCategory
);

export default router;
