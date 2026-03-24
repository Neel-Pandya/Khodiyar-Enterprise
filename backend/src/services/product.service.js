import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import cloudinaryService from './cloudinary.service.js';
import fs from 'node:fs/promises';
import { fileTypeFromFile } from 'file-type';

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData
   * @param {Array} files
   * @returns {Promise<Object>}
   */
  async createProduct(productData, files) {
    let imageUrls = [];
    let uploadedPublicIds = [];
    try {
      // 0. Early exit if category_id is invalid
      const category = await prisma.category.findUnique({
        where: { id: productData.category_id },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      // 1. Upload images to Cloudinary
      if (files && files.length > 0) {
        // Post-upload magic byte validation (Security enhancement)
        for (const file of files) {
          const type = await fileTypeFromFile(file.path);
          if (!type || !type.mime.startsWith('image/')) {
            throw new ApiError(
              400,
              `File ${file.originalname} is not a valid image`
            );
          }
        }

        const uploadPromises = files.map((file) =>
          cloudinaryService.uploadFile(file.path, 'products')
        );
        const settledResults = await Promise.allSettled(uploadPromises);

        imageUrls = [];
        uploadedPublicIds = [];

        for (const settledResult of settledResults) {
          if (settledResult.status === 'fulfilled' && settledResult.value) {
            const { secure_url, public_id } = settledResult.value;
            if (secure_url && public_id) {
              imageUrls.push(secure_url);
              uploadedPublicIds.push(public_id);
            }
          }
        }

        const hasFailedUploads = settledResults.some(
          (result) => result.status === 'rejected'
        );

        if (hasFailedUploads) {
          const deletePromises = uploadedPublicIds.map((publicId) =>
            cloudinaryService.deleteFile(publicId)
          );
          await Promise.all(deletePromises);
          throw new ApiError(
            500,
            'Some image uploads failed, rolled back all uploaded images'
          );
        }

        // 2. Delete local files
        const deletePromises = files.map((file) => fs.unlink(file.path));
        await Promise.all(deletePromises);
      }

      // 3. Create product in DB
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          price: productData.price,
          status: productData.status || 'active',
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
      // Cleanup Cloudinary uploads if they exist
      if (uploadedPublicIds.length > 0) {
        for (const publicId of uploadedPublicIds) {
          try {
            await cloudinaryService.deleteFile(publicId);
          } catch (e) {
            logger.error('Failed to cleanup Cloudinary image', {
              publicId,
              error: e.message,
              service: 'product-service',
            });
          }
        }
      }

      // Cleanup local files if they weren't deleted
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await fs.unlink(file.path);
          } catch (e) {
            // Already deleted or doesn't exist
          }
        }
      }

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

    const where = {
      deleted_at: null,
    };

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

      if (!product || product.deleted_at) {
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
    let uploadedPublicIds = [];
    try {
      // 0. Early exit if category_id is being updated and is invalid
      if (updateData.category_id) {
        const category = await prisma.category.findUnique({
          where: { id: updateData.category_id },
        });

        if (!category) {
          throw new ApiError(404, 'Category not found');
        }
      }

      const updatePayload = { ...updateData };

      // Handle new image uploads if provided
      if (files && files.length > 0) {
        // Post-upload magic byte validation (Security enhancement)
        for (const file of files) {
          const type = await fileTypeFromFile(file.path);
          if (!type || !type.mime.startsWith('image/')) {
            throw new ApiError(
              400,
              `File ${file.originalname} is not a valid image`
            );
          }
        }

        const uploadPromises = files.map((file) =>
          cloudinaryService.uploadFile(file.path, 'products')
        );
        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map((result) => result.secure_url);
        uploadedPublicIds = results.map((result) => result.public_id);

        // Delete local files
        const deletePromises = files.map((file) => fs.unlink(file.path));
        await Promise.all(deletePromises);

        updatePayload.images = imageUrls;
      }

      const product = await prisma.product.update({
        where: { id: productId, deleted_at: null },
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
      // Cleanup Cloudinary uploads if they exist
      if (uploadedPublicIds.length > 0) {
        for (const publicId of uploadedPublicIds) {
          try {
            await cloudinaryService.deleteFile(publicId);
          } catch (e) {
            logger.error('Failed to cleanup Cloudinary image', {
              publicId,
              error: e.message,
              service: 'product-service',
            });
          }
        }
      }

      // Cleanup local files if they weren't deleted
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await fs.unlink(file.path);
          } catch (e) {}
        }
      }

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
   * Delete product (Soft delete)
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async deleteProduct(productId) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          status: 'inactive',
          deleted_at: new Date(),
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
