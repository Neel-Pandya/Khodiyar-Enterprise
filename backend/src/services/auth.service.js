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

      await verificationService.createVerification(user);

      return {
        ...user,
      };
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

      if (!user.is_verified) {
        throw new ApiError(403, 'User is not verified', [
          'Please verify your email first',
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
}

export default new AuthService();
