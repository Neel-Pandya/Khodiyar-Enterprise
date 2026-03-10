import pool from "../db/pool.js"
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";


class AuthRepository {
    /**
     * Initializes the AuthRepository with the provided pool.
     * @param {import("pg").Pool} pool - The database connection pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Create a new user
     * @param {Object} userData - The user data to create
     * @returns {Promise<Object>} The created user data
     * @throws {Error} Throws an error if the user creation fails
     */
    async createUser({ name, email, password, role, avatar }) {
        try {
            const query = `
                INSERT INTO users (name, email, password, role, avatar)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, email, role, avatar;
            `;
            const result = await this.pool.query(query, [
                name,
                email,
                password,
                role,
                avatar
            ]);
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to create user", {
                error: error.message,
                stack: error.stack,
                service: "auth-repository",
            });
            throw new ApiError(500, "Failed to create user", [error.message]);
        }
    }

    /**
     * Find user by email
     * @param {string} email - The email of the user to find
     * @returns {Promise<Object>} The found user data
     * @throws {Error} Throws an error if the user lookup fails
     */
    async findUserByEmail(email) {
        try {
            const query = `
                SELECT * FROM users WHERE email = $1;
            `;
            const result = await this.pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to find user by email", {
                error: error.message,
                stack: error.stack,
                service: "auth-repository",
            });
            throw new ApiError(500, "Failed to find user by email", [error.message]);
        }
    }

}

export default new AuthRepository(pool);