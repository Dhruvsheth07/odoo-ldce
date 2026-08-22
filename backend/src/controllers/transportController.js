import * as transportService from '../services/transportService.js';
import { success, created } from '../utils/apiResponse.js';

export async function searchTransport(req, res, next) {
  try {
    const { fromCity, toCity, date, type } = req.query;
    const result = await transportService.searchTransport(fromCity, toCity, date, type);
    success(res, result);
  } catch (err) { next(err); }
}

export async function addTransport(req, res, next) {
  try {
    const transport = await transportService.addTransportToTrip(req.params.tripId, req.user.id, req.body);
    created(res, { transport });
  } catch (err) { next(err); }
}

export async function deleteTransport(req, res, next) {
  try {
    await transportService.deleteTransport(req.params.transportId, req.user.id);
    success(res, null, 'Transport removed');
  } catch (err) { next(err); }
}
