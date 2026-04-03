import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class FavoriteService {
  /**
   * Toggle favorite status for a product
   * If already favorited, remove it. If not, add it.
   * @param {string} userId
   * @param {string} productId
   * @returns {Promise<{ isFavorite: boolean, product: object | null }>}
   */
  async toggleFavorite(userId, productId) {
    try {
      // Check if product exists and is active
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      if (!product.is_active) {
        throw new ApiError(400, 'Product is not available');
      }

      // Check if already favorited
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });

      if (existingFavorite) {
        // Remove from favorites
        await prisma.favorite.delete({
          where: {
            user_id_product_id: {
              user_id: userId,
              product_id: productId,
            },
          },
        });

        return { isFavorite: false, product: null };
      } else {
        // Add to favorites
        await prisma.favorite.create({
          data: {
            user_id: userId,
            product_id: productId,
          },
        });

        return { isFavorite: true, product };
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to toggle favorite', {
        error: error.message,
        userId,
        productId,
        service: 'favorite-service',
      });
      throw new ApiError(500, 'Failed to toggle favorite');
    }
  }

  /**
   * Get all favorites for a user with pagination
   * @param {string} userId
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{ favorites: Array, pagination: Object }>}
   */
  async getUserFavorites(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    try {
      const [favorites, total] = await prisma.$transaction([
        prisma.favorite.findMany({
          where: { user_id: userId },
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        prisma.favorite.count({
          where: { user_id: userId },
        }),
      ]);

      return {
        favorites,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      logger.error('Failed to get user favorites', {
        error: error.message,
        userId,
        service: 'favorite-service',
      });
      throw new ApiError(500, 'Failed to get favorites');
    }
  }

  /**
   * Check if a product is favorited by the user
   * @param {string} userId
   * @param {string} productId
   * @returns {Promise<boolean>}
   */
  async isFavorite(userId, productId) {
    try {
      const favorite = await prisma.favorite.findUnique({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });

      return !!favorite;
    } catch (error) {
      logger.error('Failed to check favorite status', {
        error: error.message,
        userId,
        productId,
        service: 'favorite-service',
      });
      throw new ApiError(500, 'Failed to check favorite status');
    }
  }
}

export default new FavoriteService();
