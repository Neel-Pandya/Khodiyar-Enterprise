import { asyncHandler } from '../handlers/async.handler.js';
import favoriteService from '../services/favorite.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Toggle favorite status for a product
 * Adds if not present, removes if present
 */
const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  const result = await favoriteService.toggleFavorite(userId, product_id);

  const message = result.isFavorite
    ? 'Product added to favorites'
    : 'Product removed from favorites';

  return res.status(200).json(new ApiResponse(200, message, result));
});

/**
 * Get all favorites for the authenticated user
 */
const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await favoriteService.getUserFavorites(userId, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Favorites retrieved successfully', result));
});

/**
 * Check if a specific product is favorited by the user
 */
const checkFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const isFavorite = await favoriteService.isFavorite(userId, productId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Favorite status retrieved', { isFavorite }));
});

export default {
  toggleFavorite,
  getFavorites,
  checkFavorite,
};
