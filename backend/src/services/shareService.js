import prisma from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { sanitizeTrip } from '../utils/helpers.js';

/**
 * Toggle trip public/private and generate share token
 */
export async function toggleShare(tripId, userId) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: {
      isPublic: !trip.isPublic,
      shareToken: !trip.isPublic ? (trip.shareToken || uuidv4()) : trip.shareToken,
    },
  });

  return {
    isPublic: updated.isPublic,
    shareToken: updated.shareToken,
    shareUrl: updated.isPublic ? `/share/${updated.shareToken}` : null,
  };
}

/**
 * Get a shared trip by its share token (public, read-only)
 */
export async function getSharedTrip(shareToken) {
  const trip = await prisma.trip.findUnique({
    where: { shareToken },
    include: {
      user: { select: { name: true, profileImageUrl: true } },
      stops: {
        include: {
          destination: true,
          activities: { orderBy: [{ scheduledDate: 'asc' }, { dayOrder: 'asc' }] },
          accommodations: { orderBy: { checkIn: 'asc' } },
        },
        orderBy: { orderIndex: 'asc' },
      },
      transports: { orderBy: { departureTime: 'asc' } },
    },
  });

  if (!trip || !trip.isPublic) throw new NotFoundError('Shared trip');

  // Sanitize: strip private user data
  return sanitizeTrip(trip, true);
}

/**
 * Copy a shared trip to a new user's account
 */
export async function copyTrip(shareToken, userId) {
  const original = await prisma.trip.findUnique({
    where: { shareToken },
    include: {
      stops: {
        include: {
          destination: true,
          activities: true,
          accommodations: true,
        },
        orderBy: { orderIndex: 'asc' },
      },
      transports: true,
    },
  });

  if (!original || !original.isPublic) throw new NotFoundError('Shared trip');

  // Create the new trip
  const newTrip = await prisma.trip.create({
    data: {
      userId,
      name: `${original.name} (Copy)`,
      description: original.description,
      coverImageUrl: original.coverImageUrl,
      startDate: original.startDate,
      endDate: original.endDate,
      budget: original.budget,
      currency: original.currency,
      shareToken: uuidv4(),
    },
  });

  // Copy stops with activities and accommodations
  for (const stop of original.stops) {
    const newStop = await prisma.tripStop.create({
      data: {
        tripId: newTrip.id,
        destinationId: stop.destinationId,
        arrivalDate: stop.arrivalDate,
        departureDate: stop.departureDate,
        orderIndex: stop.orderIndex,
        notes: stop.notes,
      },
    });

    // Copy activities
    for (const activity of stop.activities) {
      await prisma.tripActivity.create({
        data: {
          tripStopId: newStop.id,
          externalId: activity.externalId,
          name: activity.name,
          description: activity.description,
          category: activity.category,
          imageUrl: activity.imageUrl,
          price: activity.price,
          priceCurrency: activity.priceCurrency,
          priceType: activity.priceType,
          rating: activity.rating,
          bookingUrl: activity.bookingUrl,
          scheduledDate: activity.scheduledDate,
          startTime: activity.startTime,
          endTime: activity.endTime,
          dayOrder: activity.dayOrder,
          provider: activity.provider,
          priceCheckedAt: activity.priceCheckedAt,
        },
      });
    }

    // Copy accommodations
    for (const acc of stop.accommodations) {
      await prisma.tripAccommodation.create({
        data: {
          tripStopId: newStop.id,
          externalId: acc.externalId,
          name: acc.name,
          imageUrl: acc.imageUrl,
          rating: acc.rating,
          distanceKm: acc.distanceKm,
          roomInfo: acc.roomInfo,
          pricePerNight: acc.pricePerNight,
          totalPrice: acc.totalPrice,
          priceCurrency: acc.priceCurrency,
          priceType: acc.priceType,
          provider: acc.provider,
          bookingUrl: acc.bookingUrl,
          checkIn: acc.checkIn,
          checkOut: acc.checkOut,
          guests: acc.guests,
          rooms: acc.rooms,
          priceCheckedAt: acc.priceCheckedAt,
        },
      });
    }
  }

  // Copy transports
  for (const transport of original.transports) {
    await prisma.tripTransport.create({
      data: {
        tripId: newTrip.id,
        transportType: transport.transportType,
        provider: transport.provider,
        carrier: transport.carrier,
        price: transport.price,
        priceCurrency: transport.priceCurrency,
        priceType: transport.priceType,
        departureTime: transport.departureTime,
        arrivalTime: transport.arrivalTime,
        durationMinutes: transport.durationMinutes,
        bookingUrl: transport.bookingUrl,
        externalId: transport.externalId,
        priceCheckedAt: transport.priceCheckedAt,
      },
    });
  }

  return sanitizeTrip(newTrip);
}
