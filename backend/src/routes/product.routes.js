import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  productIdSchema,
} from '../validations/product.validation.js';
import { Roles } from '../configs/roles.js';
import {
  uploadProductImages,
  validateImageCount,
} from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @route GET /api/products
 * @desc Get all products with pagination and filters
 * @access Public
 */
router.get(
  '/',
  validate(getProductsSchema, 'query'),
  productController.getProducts
);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get(
  '/:id',
  validate(productIdSchema, 'params'),
  productController.getProduct
);

// ── Admin Only Routes ──────────────────────────────────────────────────────────

router.use(authenticate);
router.use(authorize(Roles.ADMIN));

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Admin
 */
router.post(
  '/',
  uploadProductImages,
  validateImageCount,
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @route PATCH /api/products/:id
 * @desc Update an existing product
 * @access Admin
 */
router.patch(
  '/:id',
  uploadProductImages,
  validateImageCount,
  validate(productIdSchema, 'params'),
  validate(updateProductSchema),
  productController.updateProduct
);
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete a product (soft delete)
 * @access Admin
 */
router.delete(
  '/:id',
  validate(productIdSchema, 'params'),
  productController.deleteProduct
);

export default router;
