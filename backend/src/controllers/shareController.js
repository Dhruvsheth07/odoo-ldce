import * as shareService from '../services/shareService.js';
import { success, created } from '../utils/apiResponse.js';

export async function toggleShare(req, res, next) {
  try {
    const result = await shareService.toggleShare(req.params.tripId, req.user.id);
    success(res, result);
  } catch (err) { next(err); }
}

export async function getSharedTrip(req, res, next) {
  try {
    const trip = await shareService.getSharedTrip(req.params.shareToken);
    success(res, { trip });
  } catch (err) { next(err); }
}

export async function copyTrip(req, res, next) {
  try {
    const trip = await shareService.copyTrip(req.params.shareToken, req.user.id);
    created(res, { trip }, 'Trip copied successfully');
  } catch (err) { next(err); }
}
