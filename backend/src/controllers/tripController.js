import * as tripService from '../services/tripService.js';
import { success, created } from '../utils/apiResponse.js';

export async function getTrips(req, res, next) {
  try {
    const { filter } = req.query;
    const trips = await tripService.getUserTrips(req.user.id, { filter });
    success(res, { trips });
  } catch (err) { next(err); }
}

export async function getTrip(req, res, next) {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id);
    success(res, { trip });
  } catch (err) { next(err); }
}

export async function createTrip(req, res, next) {
  try {
    const trip = await tripService.createTrip(req.user.id, req.body);
    created(res, { trip });
  } catch (err) { next(err); }
}

export async function updateTrip(req, res, next) {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
    success(res, { trip }, 'Trip updated');
  } catch (err) { next(err); }
}

export async function deleteTrip(req, res, next) {
  try {
    await tripService.deleteTrip(req.params.id, req.user.id);
    success(res, null, 'Trip deleted');
  } catch (err) { next(err); }
}

export async function getRecentTrips(req, res, next) {
  try {
    const trips = await tripService.getRecentTrips(req.user.id);
    success(res, { trips });
  } catch (err) { next(err); }
}

export async function getUpcomingTrips(req, res, next) {
  try {
    const trips = await tripService.getUpcomingTrips(req.user.id);
    success(res, { trips });
  } catch (err) { next(err); }
}
