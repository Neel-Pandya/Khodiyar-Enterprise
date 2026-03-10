import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";
import { generateSafeAvatar } from "../utils/avatar.generator.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken"
class AuthService {
    /**
     * Initializes the AuthService with the provided authRepository.
     * @param authRepository - The auth repository to use for database operations
     */
    constructor(authRepository) {
        this.authRepository = authRepository;
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
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            });
            return accessToken;
        } catch (error) {
            logger.error("Failed to generate access token", {
                error: error.message,
                stack: error.stack,
                service: "auth-service",
            });
            throw new ApiError(500, "Failed to generate access token", [error.message]);
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
            logger.error("Failed to generate refresh token", {
                error: error.message,
                stack: error.stack,
                service: "auth-service",
            });
            throw new ApiError(500, "Failed to generate refresh token", [error.message]);
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
            const userExists = await this.authRepository.findUserByEmail(userData.email);
            if (userExists) {
                throw new ApiError(409, "User already exists", ["Email is already registered"]);
            }

            // 2. Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // 3. Generate safe avatar
            const avatar = generateSafeAvatar({
                name: userData.name,
                email: userData.email,
            }, 'initials');

            // 4. Create user in database
            const user = await this.authRepository.createUser({
                ...userData,
                password: hashedPassword,
                role: "user",
                avatar, // Add generated avatar
            });

            return user;
        } catch (error) {
            // Re-throw ApiError as-is
            if (error instanceof ApiError) {
                throw error;
            }

            // Log and wrap unexpected errors
            logger.error("Failed to register user", {
                error: error.message,
                stack: error.stack,
                service: "auth-service",
            });
            throw new ApiError(500, "Failed to register user", [error.message]);
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
            // 1. Check if user exists
            const userExists = await this.authRepository.findUserByEmail(userData.email);
            if (!userExists) {
                throw new ApiError(404, "User not found", ["User not found"]);
            }

            // 2. check if user is verified
            if (!userExists.is_verified) {
                throw new ApiError(403, "User is not verified", ["User is not verified"]);
            }
            
            // 3. Compare password
            const isPasswordValid = await bcrypt.compare(userData.password, userExists.password);
            if (!isPasswordValid) {
                throw new ApiError(401, "Invalid password", ["Invalid password"]);
            }

            // 4. Generate access token
            const accessToken = await this.generateAccessToken({
                id: userExists.id,
                email: userExists.email,
                role: userExists.role,
            });

            // 5. Generate refresh token
            const refreshToken = await this.generateRefreshToken({
                id: userExists.id,
                email: userExists.email,
                role: userExists.role,
            });

            // 6. Remove password before returning
            delete userExists.password;

            return {
                user: userExists,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            // Re-throw ApiError as-is
            if (error instanceof ApiError) {
                throw error;
            }

            // Log and wrap unexpected errors
            logger.error("Failed to login user", {
                error: error.message,
                stack: error.stack,
                service: "auth-service",
            });
            throw new ApiError(500, "Failed to login user", [error.message]);
        }
    }

}

export default new AuthService(authRepository);