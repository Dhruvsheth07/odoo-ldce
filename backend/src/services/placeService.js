import * as googlePlaces from '../external/googlePlaces.js';

export async function searchPlaces(query) {
  return googlePlaces.searchPlaces(query);
}

export async function getNearbyPlaces(lat, lng, radius, type) {
  return googlePlaces.searchNearby(lat, lng, radius, type);
}

export async function getPlaceDetails(placeId) {
  return googlePlaces.getPlaceDetails(placeId);
}
