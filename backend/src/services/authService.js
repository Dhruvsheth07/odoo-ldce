import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import env from '../config/env.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
import { sanitizeUser } from '../utils/helpers.js';

const SALT_ROUNDS = 12;

export async function register({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const token = generateJWT(user.id);
  return { user: sanitizeUser(user), token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateJWT(user.id);
  return { user: sanitizeUser(user), token };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return sanitizeUser(user);
}

function generateJWT(userId) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
