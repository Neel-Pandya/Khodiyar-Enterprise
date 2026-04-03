import { Router } from 'express';
import favoriteController from '../controllers/favorite.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  toggleFavoriteSchema,
  productIdSchema,
} from '../validations/favorite.validation.js';

const router = Router();

// All favorite routes require authentication
router.use(authenticate);

/**
 * @route POST /api/favorites/toggle
 * @desc Toggle favorite status for a product
 * @access Private
 */
router.post(
  '/toggle',
  validate(toggleFavoriteSchema),
  favoriteController.toggleFavorite
);

/**
 * @route GET /api/favorites
 * @desc Get all favorites for the authenticated user
 * @access Private
 */
router.get('/', favoriteController.getFavorites);

/**
 * @route GET /api/favorites/check/:productId
 * @desc Check if a specific product is favorited
 * @access Private
 */
router.get(
  '/check/:productId',
  validate(productIdSchema, 'params'),
  favoriteController.checkFavorite
);

export default router;
