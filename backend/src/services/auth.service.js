import prisma from '../db/prisma.js';
import emailService from './email.service.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateSafeAvatar } from '../utils/avatar.generator.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';

class AuthService {
  /**
   * Generate 6 digit OTP
   * @returns {string} The generated OTP
   * @private
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate Access Token
   * @param {Object} payload - The payload to generate access token
   * @returns {Promise<string>} The access token
   * @throws {Error} Throws an error if the access token generation fails
   * @private
   */
  async generateAccessToken(payload) {
    try {
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });
      return accessToken;
    } catch (error) {
      logger.error('Failed to generate access token', {
        error: error.message,
        stack: error.stack,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to generate access token', [
        error.message,
      ]);
    }
  }

  /**
   * Generate Refresh Token
   * @param {Object} payload - The payload to generate refresh token
   * @returns {Promise<string>} The refresh token
   * @throws {Error} Throws an error if the refresh token generation fails
   * @private
   */
  async generateRefreshToken(payload) {
    try {
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      return refreshToken;
    } catch (error) {
      logger.error('Failed to generate refresh token', {
        error: error.message,
        stack: error.stack,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to generate refresh token', [
        error.message,
      ]);
    }
  }

  /**
   * Register a new user with hashed password and generated avatar
   * @param {Object} userData - The user data to register
   * @returns {Promise<Object>} The created user data
   * @throws {Error} Throws an error if the user registration fails
   */
  async register(userData) {
    try {
      // 1. Check if user already exists
      const userExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (userExists) {
        throw new ApiError(409, 'User already exists', [
          'Email is already registered',
        ]);
      }

      // 2. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // 3. Generate safe avatar
      const avatar = generateSafeAvatar(
        {
          name: userData.name,
          email: userData.email,
        },
        'initials'
      );

      // 4. Create user in database
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

      // 5. Generate OTP and Token for verification
      const otp = this.generateOTP();
      const token = crypto.randomUUID();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes OTP expiry
      const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours link expiry

      await prisma.verification.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          otp,
          token,
          otp_expires_at: otpExpiresAt,
          token_expires_at: tokenExpiresAt,
        },
        update: {
          otp,
          token,
          otp_expires_at: otpExpiresAt,
          token_expires_at: tokenExpiresAt,
          last_resent_at: new Date(),
        },
      });

      // 6. Send verification email
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        token,
        otp
      );

      return {
        ...user,
        verificationToken: token, // Return token for frontend redirect if needed
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to register user', {
        error: error.message,
        stack: error.stack,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to register user', [error.message]);
    }
  }

  /**
   * Verify OTP
   * @param {string} token - The verification token
   * @param {string} otp - The OTP to verify
   */
  async verifyOTP(token, otp) {
    try {
      const verification = await prisma.verification.findFirst({
        where: { token },
      });

      if (!verification) {
        throw new ApiError(404, 'Invalid or expired verification link');
      }

      if (new Date() > new Date(verification.token_expires_at)) {
        await prisma.verification.delete({
          where: { user_id: verification.user_id },
        });
        throw new ApiError(
          400,
          'Verification link has expired. Please register again.'
        );
      }

      if (verification.otp !== otp) {
        throw new ApiError(400, 'Invalid OTP');
      }

      if (new Date() > new Date(verification.otp_expires_at)) {
        throw new ApiError(400, 'OTP has expired. Please resend a new OTP.');
      }

      // Move database changes to a transaction to ensure atomic execution
      await prisma.$transaction([
        prisma.user.update({
          where: { id: verification.user_id },
          data: { is_verified: true },
        }),
        prisma.verification.delete({
          where: { user_id: verification.user_id },
        }),
      ]);

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to verify OTP', { error: error.message });
      throw new ApiError(500, 'Verification failed');
    }
  }

  /**
   * Resend OTP
   * @param {string} token - The verification token
   */
  async resendOTP(token) {
    try {
      const verification = await prisma.verification.findFirst({
        where: { token },
        include: { user: { select: { name: true, email: true } } },
      });

      if (!verification) {
        throw new ApiError(404, 'Verification session not found');
      }

      if (new Date() > new Date(verification.token_expires_at)) {
        throw new ApiError(
          400,
          'Verification link has expired. Please register again.'
        );
      }

      // Rate limit: 60 seconds
      const lastResent = new Date(verification.last_resent_at).getTime();
      const now = new Date().getTime();
      const diff = (now - lastResent) / 1000;

      if (diff < 60) {
        throw new ApiError(
          429,
          `Please wait ${Math.ceil(60 - diff)} seconds before resending`
        );
      }

      const newOtp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.verification.update({
        where: { user_id: verification.user_id },
        data: {
          otp: newOtp,
          otp_expires_at: otpExpiresAt,
          last_resent_at: new Date(),
        },
      });

      await emailService.sendVerificationEmail(
        verification.user.email,
        verification.user.name,
        token,
        newOtp
      );

      return { message: 'OTP resent successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to resend OTP', { error: error.message });
      throw new ApiError(500, 'Resend failed');
    }
  }

  /**
   * Login user
   * @param {Object} userData - The user data to login
   * @returns {Promise<Object>} The logged in user data
   * @throws {Error} Throws an error if the user login fails
   */
  async login(userData) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        throw new ApiError(404, 'User not found', ['User not found']);
      }

      if (!user.is_verified) {
        throw new ApiError(403, 'User is not verified', [
          'Please verify your email first',
        ]);
      }

      const isPasswordValid = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password', ['Invalid password']);
      }

      const accessToken = await this.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = await this.generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove password before returning
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
        stack: error.stack,
        service: 'auth-service',
      });
      throw new ApiError(500, 'Failed to login user', [error.message]);
    }
  }
}

export default new AuthService();
