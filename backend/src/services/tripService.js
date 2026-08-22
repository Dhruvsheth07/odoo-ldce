import prisma from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { sanitizeTrip } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all trips for a user with optional filters
 */
export async function getUserTrips(userId, { filter = 'all' } = {}) {
  const now = new Date();
  let where = { userId };

  if (filter === 'upcoming') {
    where.startDate = { gte: now };
  } else if (filter === 'past') {
    where.endDate = { lt: now };
  } else if (filter === 'active') {
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  }

  const trips = await prisma.trip.findMany({
    where,
    include: {
      stops: {
        include: { destination: true },
        orderBy: { orderIndex: 'asc' },
      },
      _count: { select: { expenses: true } },
    },
    orderBy: { startDate: 'asc' },
  });

  return trips.map(t => sanitizeTrip(t));
}

/**
 * Get a single trip with all related data
 */
export async function getTripById(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: { select: { id: true, name: true, profileImageUrl: true } },
      stops: {
        include: {
          destination: true,
          activities: { orderBy: [{ scheduledDate: 'asc' }, { dayOrder: 'asc' }] },
          accommodations: { orderBy: { checkIn: 'asc' } },
        },
        orderBy: { orderIndex: 'asc' },
      },
      transports: { orderBy: { departureTime: 'asc' } },
      expenses: { orderBy: { expenseDate: 'asc' } },
    },
  });

  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  return sanitizeTrip(trip);
}

/**
 * Create a new trip
 */
export async function createTrip(userId, data) {
  const trip = await prisma.trip.create({
    data: {
      userId,
      name: data.name,
      description: data.description || null,
      coverImageUrl: data.coverImageUrl || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      budget: data.budget || 0,
      currency: data.currency || 'USD',
      shareToken: uuidv4(),
    },
    include: {
      stops: { include: { destination: true } },
    },
  });

  return sanitizeTrip(trip);
}

/**
 * Update an existing trip
 */
export async function updateTrip(tripId, userId, data) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.coverImageUrl !== undefined) updateData.coverImageUrl = data.coverImageUrl;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.budget !== undefined) updateData.budget = data.budget;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: updateData,
    include: {
      stops: { include: { destination: true }, orderBy: { orderIndex: 'asc' } },
    },
  });

  return sanitizeTrip(updated);
}

/**
 * Delete a trip (cascades all related data)
 */
export async function deleteTrip(tripId, userId) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.trip.delete({ where: { id: tripId } });
  return { deleted: true };
}

/**
 * Get recent trips for dashboard
 */
export async function getRecentTrips(userId, limit = 5) {
  const trips = await prisma.trip.findMany({
    where: { userId },
    include: {
      stops: {
        include: { destination: true },
        orderBy: { orderIndex: 'asc' },
        take: 3,
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return trips.map(t => sanitizeTrip(t));
}

/**
 * Get upcoming trips for dashboard
 */
export async function getUpcomingTrips(userId, limit = 5) {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      startDate: { gte: new Date() },
    },
    include: {
      stops: {
        include: { destination: true },
        orderBy: { orderIndex: 'asc' },
        take: 3,
      },
    },
    orderBy: { startDate: 'asc' },
    take: limit,
  });

  return trips.map(t => sanitizeTrip(t));
}
