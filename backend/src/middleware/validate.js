import { ValidationError } from '../utils/errors.js';

/**
 * Zod validation middleware factory
 * Validates req.body, req.query, or req.params against a Zod schema
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = req[source];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new ValidationError('Validation failed', errors);
      }

      // Replace with parsed/coerced data
      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Validate multiple sources at once
 */
export function validateAll(schemas) {
  return (req, res, next) => {
    try {
      const allErrors = [];

      for (const [source, schema] of Object.entries(schemas)) {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
          result.error.issues.forEach(issue => {
            allErrors.push({
              field: `${source}.${issue.path.join('.')}`,
              message: issue.message,
            });
          });
        } else {
          req[source] = result.data;
        }
      }

      if (allErrors.length > 0) {
        throw new ValidationError('Validation failed', allErrors);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
