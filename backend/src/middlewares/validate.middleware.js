import { z } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate request data against a Zod schema.
 * @param {z.ZodSchema} schema - The Zod schema to validate against.
 * @param {string} source - The request object to validate ('body', 'query', 'params'). Default is 'body'.
 * @returns {import("express").RequestHandler} - Express middleware function.
 */
const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      const errors = flattened.fieldErrors;

      const message = 'Validation failed';

      throw new ApiError(400, message, { [source]: errors });
    }

    if (source === 'body') {
      req.body = result.data;
    } else {
      // For query and params, we update properties to avoid "only a getter" error
      // while still benefiting from Zod's coercion (e.g., string to number)
      Object.assign(req[source], result.data);
    }
    next();
  };

export default validate;
