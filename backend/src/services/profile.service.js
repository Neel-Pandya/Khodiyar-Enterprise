import prisma from '../db/prisma.js';
import imageService from './image.service.js';
import hashService from './hash.service.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Service class for handling user profile operations.
 * Generic service that works for both admin and regular users.
 */
class ProfileService {
  /**
   * Update user profile (name, phone, avatar)
   * @param {string} userId - The ID of the user to update
   * @param {Object} updateData - The data to update {name, phone}
   * @param {Object} file - The uploaded avatar file (optional)
   * @returns {Promise<Object>} The updated user data
   */
  async updateProfile(userId, updateData, file) {
    try {
      // 1. Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // 2. Build update data object
      const data = {};

      if (updateData.name) {
        data.name = updateData.name;
      }

      if (updateData.phone) {
        data.phone = updateData.phone;
      }

      // 3. Handle avatar upload if file is provided
      if (file) {
        const uploadResult = await imageService.uploadImages([file], 'avatars');
        if (uploadResult.imageUrls && uploadResult.imageUrls.length > 0) {
          data.avatar = uploadResult.imageUrls[0];
        }
      }

      // 4. Check if there's anything to update
      if (Object.keys(data).length === 0) {
        throw new ApiError(400, 'No valid fields provided for update');
      }

      // 5. Update user record
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
      // Handle Prisma unique constraint violation for phone
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Phone number already in use');
      }

      if (error instanceof ApiError) throw error;

      logger.error('Failed to update profile', {
        error: error.message,
        userId,
        service: 'profile-service',
      });
      throw new ApiError(500, 'Failed to update profile');
    }
  }

  /**
   * Change user password
   * @param {string} userId - The ID of the user
   * @param {string} currentPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Promise<void>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // 1. Fetch user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // 2. Verify current password
      const isCurrentPasswordValid = await hashService.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      // 3. Check new password is different from current
      const isSamePassword = await hashService.compare(
        newPassword,
        user.password
      );

      if (isSamePassword) {
        throw new ApiError(
          400,
          'New password must be different from current password'
        );
      }

      // 4. Hash new password
      const hashedPassword = await hashService.hash(newPassword);

      // 5. Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;

      logger.error('Failed to change password', {
        error: error.message,
        userId,
        service: 'profile-service',
      });
      throw new ApiError(500, 'Failed to change password');
    }
  }
}

export default new ProfileService();
