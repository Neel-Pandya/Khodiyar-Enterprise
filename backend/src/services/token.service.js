import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

class TokenService {
  /**
   * Generate Access Token
   * @param {Object} payload - The payload to generate access token
   * @returns {string} The access token
   */
  generateAccessToken(payload) {
    try {
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
      });
    } catch (error) {
      logger.error('Failed to generate access token', {
        error: error.message,
        service: 'token-service',
      });
      throw new ApiError(500, 'Failed to generate access token');
    }
  }

  /**
   * Generate Refresh Token
   * @param {Object} payload - The payload to generate refresh token
   * @returns {string} The refresh token
   */
  generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      logger.error('Failed to generate refresh token', {
        error: error.message,
        service: 'token-service',
      });
      throw new ApiError(500, 'Failed to generate refresh token');
    }
  }
}

export default new TokenService();
