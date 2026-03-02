import { ApiError } from "../utils/ApiError.js";

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - Custom ApiError instances  → structured JSON response
 *  - Zod validation errors      → 400 with field details
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

    // ── Unexpected / Unhandled Error ──────────────────────────────────────────
    console.error("[Unhandled Error]", err);

    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        errors: [],
    });
};

export { errorHandler };
