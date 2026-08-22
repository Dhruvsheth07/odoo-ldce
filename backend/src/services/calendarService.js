import prisma from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

/**
 * Get all calendar events for a trip
 * Aggregates activities, accommodations, and transports into calendar events
 */
export async function getTripCalendar(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
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

  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const events = [];

  // Add activities as events
  for (const stop of trip.stops) {
    for (const activity of stop.activities) {
      if (activity.scheduledDate) {
        const start = activity.startTime
          ? `${new Date(activity.scheduledDate).toISOString().split('T')[0]}T${activity.startTime}:00`
          : new Date(activity.scheduledDate).toISOString();
        const end = activity.endTime
          ? `${new Date(activity.scheduledDate).toISOString().split('T')[0]}T${activity.endTime}:00`
          : null;

        events.push({
          id: activity.id,
          type: 'activity',
          title: activity.name,
          start,
          end,
          city: stop.destination.name,
          category: activity.category,
          price: toNumber(activity.price),
          priceCurrency: activity.priceCurrency,
          priceType: activity.priceType,
          color: '#3b82f6', // blue
        });
      }
    }

    // Add accommodations
    for (const acc of stop.accommodations) {
      events.push({
        id: acc.id,
        type: 'accommodation',
        title: `🏨 ${acc.name}`,
        start: new Date(acc.checkIn).toISOString(),
        end: new Date(acc.checkOut).toISOString(),
        city: stop.destination.name,
        allDay: true,
        price: toNumber(acc.totalPrice),
        priceCurrency: acc.priceCurrency,
        priceType: acc.priceType,
        color: '#059669', // emerald
      });
    }
  }

  // Add transports
  for (const transport of trip.transports) {
    if (transport.departureTime) {
      events.push({
        id: transport.id,
        type: 'transport',
        title: `${transport.transportType === 'FLIGHT' ? '✈️' : transport.transportType === 'TRAIN' ? '🚆' : '🚌'} ${transport.carrier || transport.provider}`,
        start: new Date(transport.departureTime).toISOString(),
        end: transport.arrivalTime ? new Date(transport.arrivalTime).toISOString() : null,
        transportType: transport.transportType,
        price: toNumber(transport.price),
        priceCurrency: transport.priceCurrency,
        priceType: transport.priceType,
        durationMinutes: transport.durationMinutes,
        color: '#f97316', // orange
      });
    }
  }

  return events;
}
