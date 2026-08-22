import * as savedDestinationService from '../services/savedDestinationService.js';
import { success, created } from '../utils/apiResponse.js';

export async function getSaved(req, res, next) {
  try {
    const destinations = await savedDestinationService.getSavedDestinations(req.user.id);
    success(res, { destinations });
  } catch (err) { next(err); }
}

export async function saveDestination(req, res, next) {
  try {
    const destination = await savedDestinationService.saveDestination(req.user.id, req.body);
    created(res, { destination });
  } catch (err) { next(err); }
}

export async function unsaveDestination(req, res, next) {
  try {
    await savedDestinationService.unsaveDestination(req.params.id, req.user.id);
    success(res, null, 'Destination removed from saved');
  } catch (err) { next(err); }
}
