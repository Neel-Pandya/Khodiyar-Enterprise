import pool from "../db/pool.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

class VerificationRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async upsertVerification({ userId, otp, token, otpExpiresAt, tokenExpiresAt }) {
        try {
            const query = `
                INSERT INTO verifications (user_id, otp, token, otp_expires_at, token_expires_at, last_resent_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id) DO UPDATE SET
                    otp = EXCLUDED.otp,
                    token = EXCLUDED.token,
                    otp_expires_at = EXCLUDED.otp_expires_at,
                    token_expires_at = COALESCE(EXCLUDED.token_expires_at, verifications.token_expires_at),
                    last_resent_at = EXCLUDED.last_resent_at
                RETURNING *;
            `;
            const result = await this.pool.query(query, [userId, otp, token, otpExpiresAt, tokenExpiresAt]);
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to upsert verification", {
                error: error.message,
                userId,
            });
            throw new ApiError(500, "Failed to save verification data");
        }
    }

    async findVerificationByToken(token) {
        try {
            const query = `SELECT * FROM verifications WHERE token = $1;`;
            const result = await this.pool.query(query, [token]);
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to find verification by token", { error: error.message });
            throw new ApiError(500, "Failed to lookup verification token");
        }
    }

    async findVerificationByUserId(userId) {
        try {
            const query = `SELECT * FROM verifications WHERE user_id = $1;`;
            const result = await this.pool.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            logger.error("Failed to find verification by user id", { error: error.message });
            throw new ApiError(500, "Failed to lookup verification");
        }
    }

    async deleteVerification(userId) {
        try {
            const query = `DELETE FROM verifications WHERE user_id = $1;`;
            await this.pool.query(query, [userId]);
        } catch (error) {
            logger.error("Failed to delete verification", { error: error.message });
        }
    }
}

export default new VerificationRepository(pool);
