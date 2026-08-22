import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { success } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new NotFoundError('User');
    success(res, { user: sanitizeUser(user) });
  } catch (err) { next(err); }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email, profileImageUrl, preferredCurrency, preferredLanguage } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
    if (preferredCurrency !== undefined) updateData.preferredCurrency = preferredCurrency;
    if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    success(res, { user: sanitizeUser(user) }, 'Profile updated');
  } catch (err) { next(err); }
}

export async function deleteAccount(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    success(res, null, 'Account deleted');
  } catch (err) { next(err); }
}
