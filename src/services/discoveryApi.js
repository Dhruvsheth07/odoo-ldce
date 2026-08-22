import api from './api';

export const discoveryApi = {
  // Places
  searchPlaces: (query) => api.get('/places/search', { params: { query } }),
  getNearbyPlaces: (lat, lng, radius, type) =>
    api.get('/places/nearby', { params: { lat, lng, radius, type } }),
  getPlaceDetails: (placeId) => api.get(`/places/${placeId}`),

  // Activities
  searchActivities: (lat, lng, radius) =>
    api.get('/activities/search', { params: { lat, lng, radius } }),
  addActivity: (stopId, data) => api.post(`/activities/stops/${stopId}`, data),
  updateActivitySchedule: (activityId, data) =>
    api.put(`/activities/${activityId}/schedule`, data),
  deleteActivity: (activityId) => api.delete(`/activities/${activityId}`),

  // Hotels
  searchHotels: (lat, lng, checkIn, checkOut, guests, rooms) =>
    api.get('/hotels/search', { params: { lat, lng, checkIn, checkOut, guests, rooms } }),
  addHotel: (stopId, data) => api.post(`/hotels/stops/${stopId}`, data),
  deleteHotel: (accommodationId) => api.delete(`/hotels/${accommodationId}`),

  // Transport
  searchTransport: (fromCity, toCity, date, type) =>
    api.get('/transport/search', { params: { fromCity, toCity, date, type } }),
  addTransport: (tripId, data) => api.post(`/transport/trips/${tripId}`, data),
  deleteTransport: (transportId) => api.delete(`/transport/${transportId}`),

  // Flights
  searchFlights: (origin, destination, date, adults) =>
    api.get('/flights/search', { params: { origin, destination, date, adults } }),
};

export default discoveryApi;
