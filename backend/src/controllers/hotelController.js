import * as hotelService from '../services/hotelService.js';
import { success, created } from '../utils/apiResponse.js';

export async function searchHotels(req, res, next) {
  try {
    const { lat, lng, checkIn, checkOut, guests, rooms } = req.query;
    const result = await hotelService.searchHotels(
      parseFloat(lat), parseFloat(lng), checkIn, checkOut,
      parseInt(guests) || 1, parseInt(rooms) || 1
    );
    success(res, result);
  } catch (err) { next(err); }
}

export async function addHotel(req, res, next) {
  try {
    const accommodation = await hotelService.addHotelToTrip(req.params.stopId, req.user.id, req.body);
    created(res, { accommodation });
  } catch (err) { next(err); }
}

export async function deleteHotel(req, res, next) {
  try {
    await hotelService.deleteAccommodation(req.params.accommodationId, req.user.id);
    success(res, null, 'Accommodation removed');
  } catch (err) { next(err); }
}
