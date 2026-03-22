/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express's next() error middleware.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { asyncHandler };
