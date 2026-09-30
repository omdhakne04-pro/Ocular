const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ocular_development_jwt_secret_key_2026_secure';

/**
 * Middleware to authenticate requests using signed JSON Web Tokens.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Missing or malformed authorization token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
}

module.exports = authMiddleware;
