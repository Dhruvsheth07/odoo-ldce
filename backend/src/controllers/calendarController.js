import * as calendarService from '../services/calendarService.js';
import { success } from '../utils/apiResponse.js';

export async function getCalendar(req, res, next) {
  try {
    const events = await calendarService.getTripCalendar(req.params.tripId, req.user.id);
    success(res, { events });
  } catch (err) { next(err); }
}
