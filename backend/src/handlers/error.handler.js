import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - Custom ApiError instances  → structured JSON response
 *  - Multer errors              → file upload error response
 *  - Unexpected errors          → generic 500 response
 */
const errorHandler = (err, req, res, next) => {
  // ── Known ApiError ────────────────────────────────────────────────────────
  if (err instanceof ApiError) {
    logger.warn(err.message, {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
      errors: err.errors,
      message: err.message,
    });
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // ── Multer File Upload Error ──────────────────────────────────────────────
  if (err.name === 'MulterError') {
    let message = 'File upload failed';
    let statusCode = 400;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large. Maximum file size is 500 KB.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else if (err.code === 'LIMIT_PART_COUNT') {
      message = 'Too many parts in the upload';
    }

    logger.warn(message, {
      error: message,
      code: err.code,
      ip: req.ip,
    });

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: [],
    });
  }

  // ── JSON Syntax Error ─────────────────────────────────────────────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid JSON format in request body',
      errors: { body: [err.message] },
    });
  }

  // ── Unexpected / Unhandled Error ──────────────────────────────────────────
  logger.error('Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    ip: req.ip,
    message: err.message,
  });

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal Server Error',
    errors: [],
  });
};

export { errorHandler };
