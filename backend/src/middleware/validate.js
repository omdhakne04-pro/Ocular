/**
 * Middleware factory to validate request body using Zod schema.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: formattedErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

/**
 * Middleware factory to validate query parameters using Zod schema.
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: 'Query parameter validation failed',
        details: formattedErrors,
      });
    }
    req.query = result.data;
    next();
  };
}

module.exports = {
  validateBody,
  validateQuery,
};
