import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  addToCartSchema,
  updateQuantitySchema,
  cartIdParamSchema,
  getCartQuerySchema,
} from '../validations/cart.validation.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * @route POST /api/cart
 * @desc Add item to cart (or increment quantity if exists)
 * @access Private
 */
router.post('/', validate(addToCartSchema), cartController.addToCart);

/**
 * @route GET /api/cart
 * @desc Get user's cart with pagination
 * @access Private
 */
router.get('/', validate(getCartQuerySchema, 'query'), cartController.getCart);

/**
 * @route GET /api/cart/count
 * @desc Get cart items count
 * @access Private
 */
router.get('/count', cartController.getCartCount);

/**
 * @route PATCH /api/cart/:cartId
 * @desc Update cart item quantity
 * @access Private
 */
router.patch(
  '/:cartId',
  validate(cartIdParamSchema, 'params'),
  validate(updateQuantitySchema),
  cartController.updateQuantity
);

/**
 * @route DELETE /api/cart/:cartId
 * @desc Remove item from cart
 * @access Private
 */
router.delete(
  '/:cartId',
  validate(cartIdParamSchema, 'params'),
  cartController.removeItem
);

/**
 * @route DELETE /api/cart
 * @desc Clear user's cart
 * @access Private
 */
router.delete('/', cartController.clearCart);

export default router;
