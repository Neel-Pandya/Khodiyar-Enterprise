import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - Custom ApiError instances  → structured JSON response
 *  - Unexpected errors          → generic 500 response
 */
const errorHandler = (err, req, res, next) => {
    // ── Known ApiError ────────────────────────────────────────────────────────
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
        });
    }

    // ── JSON Syntax Error ─────────────────────────────────────────────────────
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Invalid JSON format in request body",
            errors: { body: [err.message] },
        });
    }

    // ── Unexpected / Unhandled Error ──────────────────────────────────────────
    logger.error("Unhandled error occurred", {
        error: err.message,
        stack: err.stack,
        ip: req.ip,
        message: err.message,
    });

    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        errors: [],
    });
};

export { errorHandler };
