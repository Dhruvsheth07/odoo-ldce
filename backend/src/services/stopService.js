import prisma from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

/**
 * Verify trip ownership and return the trip
 */
async function verifyTripOwnership(tripId, userId) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');
  return trip;
}

/**
 * Add a stop to a trip
 */
export async function addStop(tripId, userId, data) {
  await verifyTripOwnership(tripId, userId);

  // Find or create the destination
  let destination;
  if (data.placeId) {
    destination = await prisma.destination.findUnique({
      where: { placeId: data.placeId },
    });
  }

  if (!destination) {
    destination = await prisma.destination.create({
      data: {
        name: data.destinationName,
        country: data.country || null,
        placeId: data.placeId || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        imageUrl: data.imageUrl || null,
        description: data.description || null,
      },
    });
  }

  // Get max order index
  const maxStop = await prisma.tripStop.findFirst({
    where: { tripId },
    orderBy: { orderIndex: 'desc' },
  });
  const orderIndex = (maxStop?.orderIndex ?? -1) + 1;

  const stop = await prisma.tripStop.create({
    data: {
      tripId,
      destinationId: destination.id,
      arrivalDate: new Date(data.arrivalDate),
      departureDate: new Date(data.departureDate),
      orderIndex,
      notes: data.notes || null,
    },
    include: { destination: true },
  });

  return stop;
}

/**
 * Update a trip stop
 */
export async function updateStop(stopId, userId, data) {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });
  if (!stop) throw new NotFoundError('Stop');
  if (stop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const updateData = {};
  if (data.arrivalDate) updateData.arrivalDate = new Date(data.arrivalDate);
  if (data.departureDate) updateData.departureDate = new Date(data.departureDate);
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;

  const updated = await prisma.tripStop.update({
    where: { id: stopId },
    data: updateData,
    include: { destination: true },
  });

  return updated;
}

/**
 * Delete a trip stop
 */
export async function deleteStop(stopId, userId) {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });
  if (!stop) throw new NotFoundError('Stop');
  if (stop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.tripStop.delete({ where: { id: stopId } });
  return { deleted: true };
}

/**
 * Reorder stops within a trip
 */
export async function reorderStops(tripId, userId, stopIds) {
  await verifyTripOwnership(tripId, userId);

  const updates = stopIds.map((id, index) =>
    prisma.tripStop.update({
      where: { id },
      data: { orderIndex: index },
    })
  );

  await prisma.$transaction(updates);

  const stops = await prisma.tripStop.findMany({
    where: { tripId },
    include: { destination: true },
    orderBy: { orderIndex: 'asc' },
  });

  return stops;
}

/**
 * Get all stops for a trip
 */
export async function getTripStops(tripId, userId) {
  await verifyTripOwnership(tripId, userId);

  const stops = await prisma.tripStop.findMany({
    where: { tripId },
    include: {
      destination: true,
      activities: { orderBy: [{ scheduledDate: 'asc' }, { dayOrder: 'asc' }] },
      accommodations: { orderBy: { checkIn: 'asc' } },
    },
    orderBy: { orderIndex: 'asc' },
  });

  return stops;
}
