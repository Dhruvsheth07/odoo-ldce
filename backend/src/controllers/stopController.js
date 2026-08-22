import * as stopService from '../services/stopService.js';
import { success, created } from '../utils/apiResponse.js';

export async function addStop(req, res, next) {
  try {
    const stop = await stopService.addStop(req.params.tripId, req.user.id, req.body);
    created(res, { stop });
  } catch (err) { next(err); }
}

export async function updateStop(req, res, next) {
  try {
    const stop = await stopService.updateStop(req.params.stopId, req.user.id, req.body);
    success(res, { stop }, 'Stop updated');
  } catch (err) { next(err); }
}

export async function deleteStop(req, res, next) {
  try {
    await stopService.deleteStop(req.params.stopId, req.user.id);
    success(res, null, 'Stop removed');
  } catch (err) { next(err); }
}

export async function reorderStops(req, res, next) {
  try {
    const stops = await stopService.reorderStops(req.params.tripId, req.user.id, req.body.stopIds);
    success(res, { stops }, 'Stops reordered');
  } catch (err) { next(err); }
}

export async function getStops(req, res, next) {
  try {
    const stops = await stopService.getTripStops(req.params.tripId, req.user.id);
    success(res, { stops });
  } catch (err) { next(err); }
}
