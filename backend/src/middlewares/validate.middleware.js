import { z } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate request body against a Zod schema.
 * @param {z.ZodSchema} schema - The Zod schema to validate against.
 * @returns {Function} - Express middleware function.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const flattened = z.flattenError(result.error);
    const errors = flattened.fieldErrors;

    // Extract the first error message from the issues
    const message = 'Validation failed';

    throw new ApiError(400, message, errors);
  }

  req.body = result.data;
  next();
};

export default validate;
