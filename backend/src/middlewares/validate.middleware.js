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
      // For query and params, we need to delete existing properties first
      // then assign the validated data to ensure type coercion works
      const sourceObj = req[source];
      for (const key of Object.keys(sourceObj)) {
        delete sourceObj[key];
      }
      Object.assign(sourceObj, result.data);
    }
    next();
  };

export default validate;
