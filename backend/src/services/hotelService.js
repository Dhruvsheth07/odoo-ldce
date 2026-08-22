import prisma from '../config/db.js';
import * as amadeus from '../external/amadeus.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

export async function searchHotels(lat, lng, checkIn, checkOut, guests, rooms) {
  return amadeus.searchHotels(lat, lng, checkIn, checkOut, guests, rooms);
}

export async function addHotelToTrip(tripStopId, userId, hotelData) {
  const stop = await prisma.tripStop.findUnique({
    where: { id: tripStopId },
    include: { trip: true },
  });
  if (!stop) throw new NotFoundError('Trip stop');
  if (stop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const accommodation = await prisma.tripAccommodation.create({
    data: {
      tripStopId,
      externalId: hotelData.externalId || null,
      name: hotelData.name,
      imageUrl: hotelData.imageUrl || null,
      rating: hotelData.rating || null,
      distanceKm: hotelData.distanceKm || null,
      roomInfo: hotelData.roomInfo || null,
      pricePerNight: hotelData.pricePerNight || null,
      totalPrice: hotelData.totalPrice || null,
      priceCurrency: hotelData.priceCurrency || null,
      priceType: hotelData.priceType || 'UNAVAILABLE',
      provider: hotelData.provider || null,
      bookingUrl: hotelData.bookingUrl || null,
      checkIn: new Date(hotelData.checkIn),
      checkOut: new Date(hotelData.checkOut),
      guests: hotelData.guests || 1,
      rooms: hotelData.rooms || 1,
      priceCheckedAt: hotelData.priceCheckedAt ? new Date(hotelData.priceCheckedAt) : null,
    },
  });

  return {
    ...accommodation,
    pricePerNight: toNumber(accommodation.pricePerNight),
    totalPrice: toNumber(accommodation.totalPrice),
  };
}

export async function deleteAccommodation(accommodationId, userId) {
  const acc = await prisma.tripAccommodation.findUnique({
    where: { id: accommodationId },
    include: { tripStop: { include: { trip: true } } },
  });
  if (!acc) throw new NotFoundError('Accommodation');
  if (acc.tripStop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.tripAccommodation.delete({ where: { id: accommodationId } });
  return { deleted: true };
}
