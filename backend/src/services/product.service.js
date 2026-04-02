import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import imageService from './image.service.js';

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData
   * @param {Array} files
   * @returns {Promise<Object>}
   */
  async createProduct(productData, files) {
    try {
      // 0. Early exit if category_id is invalid
      const category = await prisma.category.findUnique({
        where: { id: productData.category_id },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      // Only allow active categories
      if (category.status !== 'active' || category.deleted_at) {
        throw new ApiError(400, 'Category is not active');
      }

      // Calculate status based on stock quantity (already coerced to number by Zod)
      const stockQuantity = productData.stock_quantity || 0;
      const status = stockQuantity > 0 ? 'available' : 'out_of_stock';

      // 2. Upload images using image service
      const { imageUrls } = await imageService.uploadImages(files, 'products');

      // 3. Create product in DB
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          price: productData.price,
          status: status,
          is_active: productData.is_active ?? true,
          stock_quantity: stockQuantity,
          category_id: productData.category_id,
          description: productData.description,
          included: productData.included,
          specification: productData.specification,
          images: imageUrls,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ApiError(400, 'Product name already exists');
      }
      if (error.code === 'P2003') {
        throw new ApiError(400, 'Invalid category ID');
      }
      if (error instanceof ApiError) throw error;
      logger.error('Failed to create product', {
        error: error.message,
        service: 'product-service',
      });
      throw new ApiError(500, 'Failed to create product');
    }
  }

  /**
   * Get all products with pagination and filters
   * @param {Object} query
   * @returns {Promise<Object>}
   */
  async getProducts(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, category_id, search, sortBy, sortOrder } = query;

    const where = {};

    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy || 'created_at']: sortOrder || 'desc',
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      logger.error('Failed to get products', {
        error: error.message,
        service: 'product-service',
      });
      throw new ApiError(500, 'Failed to get products');
    }
  }

  /**
   * Get product by ID
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async getProductById(productId) {
    try {
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

      return product;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to get product', {
        error: error.message,
        productId,
        service: 'product-service',
      });
      throw new ApiError(500, 'Failed to get product');
    }
  }

  /**
   * Update product
   * @param {string} productId
   * @param {Object} updateData
   * @param {Array} files
   * @returns {Promise<Object>}
   */
  async updateProduct(productId, updateData, files) {
    try {
      // 0. Early exit if category_id is being updated and is invalid
      if (updateData.category_id) {
        const category = await prisma.category.findUnique({
          where: { id: updateData.category_id },
        });

        if (!category) {
          throw new ApiError(404, 'Category not found');
        }

        // Only allow active categories
        if (category.status !== 'active' || category.deleted_at) {
          throw new ApiError(400, 'Category is not active');
        }
      }

      const updatePayload = { ...updateData };

      // Calculate status if stock_quantity is being updated (already coerced to number by Zod)
      if (updateData.stock_quantity !== undefined) {
        // Remove status from payload if provided - it's auto-calculated
        delete updatePayload.status;
        const stockQuantity = updateData.stock_quantity || 0;
        updatePayload.stock_quantity = stockQuantity;
        updatePayload.status = stockQuantity > 0 ? 'available' : 'out_of_stock';
      }

      // Handle is_active toggle if provided
      if (updateData.is_active !== undefined) {
        updatePayload.is_active = updateData.is_active;
      }

      // Handle image updates - merge existing URLs with new uploads
      let existingImages = [];
      if (updateData.existing_images) {
        try {
          existingImages = JSON.parse(updateData.existing_images);
        } catch (e) {
          // Invalid JSON, ignore existing images
        }
      }
      delete updatePayload.existing_images; // Remove from payload before DB update
      
      let newImageUrls = [];
      if (files && files.length > 0) {
        const { imageUrls } = await imageService.uploadImages(
          files,
          'products'
        );
        newImageUrls = imageUrls;
      }
      
      // Merge existing + new images (only if there are any images)
      const totalImages = [...existingImages, ...newImageUrls];
      if (totalImages.length > 0) {
        updatePayload.images = totalImages;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: updatePayload,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ApiError(400, 'Product name already exists');
      }
      if (error.code === 'P2003') {
        throw new ApiError(400, 'Invalid category ID');
      }
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Product not found');
      }
      if (error instanceof ApiError) throw error;
      logger.error('Failed to update product', {
        error: error.message,
        productId,
        service: 'product-service',
      });
      throw new ApiError(500, 'Failed to update product');
    }
  }

  /**
   * Delete product (Set is_active to false)
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async deleteProduct(productId) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          is_active: false,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Product not found');
      }
      logger.error('Failed to delete product', {
        error: error.message,
        productId,
        service: 'product-service',
      });
      throw new ApiError(500, 'Failed to delete product');
    }
  }
}

export default new ProductService();
