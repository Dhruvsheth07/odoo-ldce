import * as placeService from '../services/placeService.js';
import { success } from '../utils/apiResponse.js';

export async function searchPlaces(req, res, next) {
  try {
    const { query } = req.query;
    const result = await placeService.searchPlaces(query || '');
    success(res, result);
  } catch (err) { next(err); }
}

export async function getNearbyPlaces(req, res, next) {
  try {
    const { lat, lng, radius, type } = req.query;
    const result = await placeService.getNearbyPlaces(
      parseFloat(lat), parseFloat(lng),
      parseInt(radius) || 5000, type || 'tourist_attraction'
    );
    success(res, result);
  } catch (err) { next(err); }
}

export async function getPlaceDetails(req, res, next) {
  try {
    const details = await placeService.getPlaceDetails(req.params.placeId);
    success(res, { place: details });
  } catch (err) { next(err); }
}
