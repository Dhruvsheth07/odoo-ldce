import prisma from '../config/db.js';
import * as fallback from '../external/fallbackData.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

/**
 * Search train/bus routes between two cities
 */
export async function searchTransport(fromCity, toCity, date, type) {
  const results = fallback.searchTrainBus(fromCity, toCity);

  if (type) {
    return { results: results.filter(r => r.transportType === type.toUpperCase()), source: 'fallback' };
  }

  // Add departure/arrival times based on date
  const withTimes = results.map(r => ({
    ...r,
    departureTime: new Date(`${date}T08:00:00`).toISOString(),
    arrivalTime: new Date(new Date(`${date}T08:00:00`).getTime() + r.durationMinutes * 60000).toISOString(),
  }));

  return { results: withTimes, source: 'fallback' };
}

/**
 * Add selected transport to a trip
 */
export async function addTransportToTrip(tripId, userId, transportData) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const transport = await prisma.tripTransport.create({
    data: {
      tripId,
      fromStopId: transportData.fromStopId || null,
      toStopId: transportData.toStopId || null,
      transportType: transportData.transportType,
      provider: transportData.provider || null,
      carrier: transportData.carrier || null,
      price: transportData.price || null,
      priceCurrency: transportData.priceCurrency || null,
      priceType: transportData.priceType || 'UNAVAILABLE',
      departureTime: transportData.departureTime ? new Date(transportData.departureTime) : null,
      arrivalTime: transportData.arrivalTime ? new Date(transportData.arrivalTime) : null,
      durationMinutes: transportData.durationMinutes || null,
      bookingUrl: transportData.bookingUrl || null,
      externalId: transportData.externalId || null,
      priceCheckedAt: transportData.priceCheckedAt ? new Date(transportData.priceCheckedAt) : null,
    },
  });

  return { ...transport, price: toNumber(transport.price) };
}

/**
 * Delete a transport from a trip
 */
export async function deleteTransport(transportId, userId) {
  const transport = await prisma.tripTransport.findUnique({
    where: { id: transportId },
    include: { trip: true },
  });
  if (!transport) throw new NotFoundError('Transport');
  if (transport.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.tripTransport.delete({ where: { id: transportId } });
  return { deleted: true };
}
