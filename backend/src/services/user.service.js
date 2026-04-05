import prisma from '../db/prisma.js';
import hashService from './hash.service.js';
import { generateSafeAvatar } from '../utils/avatar.generator.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class UserService {
  /**
   * Create a new user (Admin only)
   * @param {Object} userData - The user data {name, email, password, role}
   * @returns {Promise<Object>} The created user data
   */
  async createUser(userData) {
    try {
      const userExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (userExists) {
        throw new ApiError(409, 'User already exists', [
          'Email is already registered',
        ]);
      }

      const hashedPassword = await hashService.hash(userData.password);

      const avatar = generateSafeAvatar(
        {
          name: userData.name,
          email: userData.email,
        },
        'initials'
      );

      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'user',
          avatar,
          status: 'active', // Admin created users are active by default
        },
        omit: {
          password: true,
          created_at: true,
          updated_at: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to create user', {
        error: error.message,
        service: 'user-service',
      });
      throw new ApiError(500, 'Failed to create user');
    }
  }

  /**
   * Update an existing user (Admin only)
   * @param {string} userId - The ID of the user to update
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated user data
   */
  async updateUser(userId, updateData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      const data = { ...updateData };

      if (updateData.password) {
        data.password = await hashService.hash(updateData.password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        omit: {
          password: true,
          created_at: true,
          updated_at: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to update user', {
        error: error.message,
        userId,
        service: 'user-service',
      });
      throw new ApiError(500, 'Failed to update user');
    }
  }

  /**
   * Get all users (Admin only) with pagination, search, and status filter
   * @param {Object} query - Query parameters {page, limit, role, status, search}
   * @returns {Promise<Object>} Users and pagination metadata
   */
  async getAllUsers(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      // Build dynamic where clause
      const where = {};

      // Role filter
      if (query.role) {
        where.role = query.role;
      }

      // Status filter (ignore 'all' or undefined)
      if (query.status && query.status !== 'all') {
        where.status = query.status;
      }

      // Search by name or email (case-insensitive)
      if (query.search && query.search.trim()) {
        const searchTerm = query.search.trim();
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          omit: {
            password: true,
            created_at: true,
            updated_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to get all users', {
        error: error.message,
        service: 'user-service',
      });
      throw new ApiError(500, 'Failed to get all users');
    }
  }

  /**
   * Get user by ID
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Delete user (Admin only) - Soft delete by setting status to suspended
   * @param {string} userId - The ID of the user to delete
   * @returns {Promise<Object>} The deleted user data
   */
  async deleteUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      if (user.role === 'admin') {
        throw new ApiError(
          403,
          'Admins cannot be deleted/suspended by other admins'
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'suspended' },
        omit: {
          password: true,
          created_at: true,
          updated_at: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to delete user', {
        error: error.message,
        userId,
        service: 'user-service',
      });
      throw new ApiError(500, 'Failed to delete user');
    }
  }
}

export default new UserService();
