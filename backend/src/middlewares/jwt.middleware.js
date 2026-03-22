import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware function
 * @throws {ApiError} Throws 401 error if token is missing or invalid
 */
const authenticate = async (req, _res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    throw new ApiError(401, 'Authorization token missing');
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export default authenticate;
