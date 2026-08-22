import { AppError } from '../utils/errors.js';

/**
 * Global error handling middleware
 */
export function errorHandler(err, req, res, _next) {
  // Log error in development (never log sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${err.message}`);
    if (!err.isOperational) {
      console.error(err.stack);
    }
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
    };
    if (err.validationErrors) {
      response.errors = err.validationErrors;
    }
    return res.status(err.statusCode).json(response);
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default: Internal server error
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
}
