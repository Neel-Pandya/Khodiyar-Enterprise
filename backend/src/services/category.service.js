import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - {name, status}
   * @returns {Promise<Object>}
   */
  async createCategory(categoryData) {
    try {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          status: categoryData.status || 'active',
        },
      });

      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Category already exists');
      }
      if (error instanceof ApiError) throw error;
      logger.error('Failed to create category', {
        error: error.message,
        service: 'category-service',
      });
      throw new ApiError(500, 'Failed to create category');
    }
  }

  /**
   * Get all categories with pagination and filters
   * @param {Object} query - {page, limit, status, search}
   * @returns {Promise<Object>}
   */
  async getCategories(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    try {
      const [categories, total] = await prisma.$transaction([
        prisma.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        }),
        prisma.category.count({ where }),
      ]);

      return {
        categories,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      logger.error('Failed to get categories', {
        error: error.message,
        service: 'category-service',
      });
      throw new ApiError(500, 'Failed to get categories');
    }
  }

  /**
   * Get category by ID
   * @param {string} categoryId
   * @returns {Promise<Object>}
   */
  async getCategoryById(categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    return category;
  }

  /**
   * Update category
   * @param {string} categoryId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateCategory(categoryId, updateData) {
    try {
      const data = { ...updateData };

      // If status is being updated to active, reset deleted_at
      if (data.status === 'active') {
        data.deleted_at = null;
      }

      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data,
      });

      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Category name already exists');
      }
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Category not found');
      }
      if (error instanceof ApiError) throw error;
      logger.error('Failed to update category', {
        error: error.message,
        categoryId,
        service: 'category-service',
      });
      throw new ApiError(500, 'Failed to update category');
    }
  }

  /**
   * Delete category (Soft delete)
   * @param {string} categoryId
   * @returns {Promise<Object>}
   */
  async deleteCategory(categoryId) {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          status: 'inactive',
          deleted_at: new Date(),
        },
      });

      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Category not found');
      }
      if (error instanceof ApiError) throw error;
      logger.error('Failed to delete category', {
        error: error.message,
        categoryId,
        service: 'category-service',
      });
      throw new ApiError(500, 'Failed to delete category');
    }
  }
}

export default new CategoryService();
