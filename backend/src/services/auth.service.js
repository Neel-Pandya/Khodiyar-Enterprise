import prisma from '../db/prisma.js';
import hashService from './hash.service.js';
import tokenService from './token.service.js';
import verificationService from './verification.service.js';
import { generateSafeAvatar } from '../utils/avatar.generator.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - The user data {name, email, password}
   * @returns {Promise<Object>} The created user data
   */
  async register(userData) {
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
          role: 'user',
          avatar,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      });

      const { token } = await verificationService.createVerification(user);

      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to register user', {
        error: error.message,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to register user');
    }
  }

  /**
   * Login user
   * @param {Object} userData - The user data {email, password}
   * @returns {Promise<Object>} The logged in user data
   */
  async login(userData) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      if (user.status === 'inactive') {
        const verification = await prisma.verification.findUnique({
          where: { user_id: user.id },
        });

        const verificationMetadata = {
          verificationExists: !!verification,
          isExpired: verification
            ? new Date() > new Date(verification.token_expires_at)
            : null,
        };

        const error = new ApiError(403, 'Email not verified', [
          'Please verify your email to activate your account',
        ]);
        error.metadata = verificationMetadata;
        throw error;
      }

      if (user.status === 'suspended') {
        throw new ApiError(403, 'Account suspended', [
          'Your account has been suspended. Please contact higher authority for assistance.',
        ]);
      }

      const isPasswordValid = await hashService.compare(
        userData.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = tokenService.generateAccessToken(payload);
      const refreshToken = tokenService.generateRefreshToken(payload);

      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to login user', {
        error: error.message,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to login user');
    }
  }

  /**
   * Change password for logged-in user
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Verify current password
      const isPasswordValid = await hashService.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      // Hash and update new password
      const hashedPassword = await hashService.hash(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to change password', {
        error: error.message,
        userId,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to change password');
    }
  }
}

export default new AuthService();
