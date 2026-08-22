import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import prisma from '../config/db.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * JWT authentication middleware
 * Extracts token from Authorization header, verifies it,
 * and attaches user to req.user
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        preferredCurrency: true,
        preferredLanguage: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    next(err);
  }
}

/**
 * Optional authentication - sets req.user if token exists, continues otherwise
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, profileImageUrl: true },
    });

    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
}
