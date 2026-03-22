import prisma from '../db/prisma.js';
import emailService from './email.service.js';
import hashService from './hash.service.js';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class PasswordResetService {
  /**
   * Initiate password reset
   * @param {string} email - User email
   */
  async initiatePasswordReset(email) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      // Security hardending: Don't reveal if user exists
      if (!user) {
        // Return success even if user not found to prevent enumeration
        return {
          message:
            'If your email is registered, you will receive an OTP shortly',
        };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = hashService.hashOTP(otp);
      const token = crypto.randomUUID();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.passwordReset.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          otp: hashedOtp,
          token,
          otp_expires_at: otpExpiresAt,
          token_expires_at: tokenExpiresAt,
          is_otp_verified: false,
        },
        update: {
          otp: hashedOtp,
          token,
          otp_expires_at: otpExpiresAt,
          token_expires_at: tokenExpiresAt,
          is_otp_verified: false,
        },
      });

      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        token,
        otp
      );
      // Remove token from return object
      return {
        message: 'If your email is registered, you will receive an OTP shortly',
      };
    } catch (error) {
      logger.error('Failed to initiate password reset', {
        error: error.message,
        email,
        service: 'password-reset.service',
      });
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Failed to initiate password reset');
    }
  }

  /**
   * Verify Reset OTP
   * @param {string} token - Reset token
   * @param {string} otp - OTP
   */
  async verifyResetOTP(token, otp) {
    try {
      const resetInfo = await prisma.passwordReset.findFirst({
        where: { token },
      });
      if (!resetInfo) {
        throw new ApiError(404, 'Invalid or expired reset link');
      }

      if (new Date() > new Date(resetInfo.token_expires_at)) {
        await prisma.passwordReset.delete({ where: { id: resetInfo.id } });
        throw new ApiError(400, 'Reset link has expired');
      }

      const isOtpValid = hashService.compareOTP(otp, resetInfo.otp);
      if (!isOtpValid) {
        throw new ApiError(400, 'Invalid OTP');
      }

      if (new Date() > new Date(resetInfo.otp_expires_at)) {
        throw new ApiError(400, 'OTP has expired');
      }

      await prisma.passwordReset.update({
        where: { id: resetInfo.id },
        data: { is_otp_verified: true },
      });

      // No longer return token in response body
      return { message: 'OTP verified successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to verify reset OTP', {
        error: error.message,
        service: 'password-reset.service',
      });
      throw new ApiError(500, 'Verification failed');
    }
  }

  /**
   * Execute Password Reset
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   */
  async executePasswordReset(token, newPassword) {
    try {
      const resetInfo = await prisma.passwordReset.findFirst({
        where: { token },
      });
      if (!resetInfo) {
        throw new ApiError(404, 'Invalid or expired reset session');
      }

      if (new Date() > new Date(resetInfo.token_expires_at)) {
        await prisma.passwordReset.delete({ where: { id: resetInfo.id } });
        throw new ApiError(400, 'Reset session has expired');
      }

      if (!resetInfo.is_otp_verified) {
        throw new ApiError(
          403,
          'OTP must be verified before resetting password'
        );
      }

      const hashedPassword = await hashService.hash(newPassword);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetInfo.user_id },
          data: { password: hashedPassword },
        }),
        prisma.passwordReset.delete({ where: { id: resetInfo.id } }),
      ]);

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Failed to execute password reset', {
        error: error.message,
        service: 'password-reset.service',
      });
      throw new ApiError(500, 'Password reset failed');
    }
  }
}

export default new PasswordResetService();
