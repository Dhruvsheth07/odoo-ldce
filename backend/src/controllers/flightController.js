import * as flightService from '../services/flightService.js';
import { success } from '../utils/apiResponse.js';

export async function searchFlights(req, res, next) {
  try {
    const { origin, destination, date, adults } = req.query;
    const result = await flightService.searchFlights(origin, destination, date, parseInt(adults) || 1);
    success(res, result);
  } catch (err) { next(err); }
}
