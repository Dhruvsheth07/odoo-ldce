import * as activityService from '../services/activityService.js';
import { success, created } from '../utils/apiResponse.js';

export async function searchActivities(req, res, next) {
  try {
    const { lat, lng, radius } = req.query;
    const result = await activityService.searchActivities(parseFloat(lat), parseFloat(lng), parseInt(radius) || 10);
    success(res, result);
  } catch (err) { next(err); }
}

export async function addActivity(req, res, next) {
  try {
    const activity = await activityService.addActivityToTrip(req.params.stopId, req.user.id, req.body);
    created(res, { activity });
  } catch (err) { next(err); }
}

export async function updateSchedule(req, res, next) {
  try {
    const activity = await activityService.updateActivitySchedule(req.params.activityId, req.user.id, req.body);
    success(res, { activity }, 'Schedule updated');
  } catch (err) { next(err); }
}

export async function deleteActivity(req, res, next) {
  try {
    await activityService.deleteActivity(req.params.activityId, req.user.id);
    success(res, null, 'Activity removed');
  } catch (err) { next(err); }
}
