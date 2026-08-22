/**
 * General utility helpers
 */

/**
 * Safely parse a decimal/float from a string or number
 */
export function parseDecimal(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

/**
 * Generate a random alphanumeric token
 */
export function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Strip sensitive user fields for public responses
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Build pagination metadata
 */
export function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

/**
 * Convert Prisma Decimal to plain number
 */
export function toNumber(decimal) {
  if (decimal === null || decimal === undefined) return null;
  return Number(decimal);
}

/**
 * Sanitize trip data - convert Decimals and strip owner info for public
 */
export function sanitizeTrip(trip, isPublic = false) {
  const sanitized = {
    ...trip,
    budget: toNumber(trip.budget),
  };

  if (isPublic && sanitized.user) {
    sanitized.user = {
      name: sanitized.user.name,
      profileImageUrl: sanitized.user.profileImageUrl,
    };
  }

  if (sanitized.stops) {
    sanitized.stops = sanitized.stops.map(stop => ({
      ...stop,
      activities: stop.activities?.map(a => ({
        ...a,
        price: toNumber(a.price),
      })),
      accommodations: stop.accommodations?.map(a => ({
        ...a,
        pricePerNight: toNumber(a.pricePerNight),
        totalPrice: toNumber(a.totalPrice),
      })),
    }));
  }

  if (sanitized.transports) {
    sanitized.transports = sanitized.transports.map(t => ({
      ...t,
      price: toNumber(t.price),
    }));
  }

  if (sanitized.expenses) {
    sanitized.expenses = sanitized.expenses.map(e => ({
      ...e,
      estimatedAmount: toNumber(e.estimatedAmount),
      actualAmount: toNumber(e.actualAmount),
    }));
  }

  return sanitized;
}
