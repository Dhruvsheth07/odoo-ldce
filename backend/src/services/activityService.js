import prisma from '../config/db.js';
import * as amadeus from '../external/amadeus.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

export async function searchActivities(lat, lng, radius) {
  return amadeus.searchActivities(lat, lng, radius);
}

export async function addActivityToTrip(tripStopId, userId, activityData) {
  // Verify ownership
  const stop = await prisma.tripStop.findUnique({
    where: { id: tripStopId },
    include: { trip: true },
  });
  if (!stop) throw new NotFoundError('Trip stop');
  if (stop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const activity = await prisma.tripActivity.create({
    data: {
      tripStopId,
      externalId: activityData.externalId || null,
      name: activityData.name,
      description: activityData.description || null,
      category: activityData.category || null,
      imageUrl: activityData.imageUrl || null,
      price: activityData.price || null,
      priceCurrency: activityData.priceCurrency || null,
      priceType: activityData.priceType || 'UNAVAILABLE',
      rating: activityData.rating || null,
      bookingUrl: activityData.bookingUrl || null,
      scheduledDate: activityData.scheduledDate ? new Date(activityData.scheduledDate) : null,
      startTime: activityData.startTime || null,
      endTime: activityData.endTime || null,
      provider: activityData.provider || null,
      priceCheckedAt: activityData.priceCheckedAt ? new Date(activityData.priceCheckedAt) : null,
    },
  });

  return { ...activity, price: toNumber(activity.price) };
}

export async function updateActivitySchedule(activityId, userId, scheduleData) {
  const activity = await prisma.tripActivity.findUnique({
    where: { id: activityId },
    include: { tripStop: { include: { trip: true } } },
  });
  if (!activity) throw new NotFoundError('Activity');
  if (activity.tripStop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const updated = await prisma.tripActivity.update({
    where: { id: activityId },
    data: {
      scheduledDate: scheduleData.scheduledDate ? new Date(scheduleData.scheduledDate) : activity.scheduledDate,
      startTime: scheduleData.startTime !== undefined ? scheduleData.startTime : activity.startTime,
      endTime: scheduleData.endTime !== undefined ? scheduleData.endTime : activity.endTime,
      dayOrder: scheduleData.dayOrder !== undefined ? scheduleData.dayOrder : activity.dayOrder,
    },
  });

  return { ...updated, price: toNumber(updated.price) };
}

export async function deleteActivity(activityId, userId) {
  const activity = await prisma.tripActivity.findUnique({
    where: { id: activityId },
    include: { tripStop: { include: { trip: true } } },
  });
  if (!activity) throw new NotFoundError('Activity');
  if (activity.tripStop.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.tripActivity.delete({ where: { id: activityId } });
  return { deleted: true };
}
