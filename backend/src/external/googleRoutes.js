/**
 * Google Routes API Client
 * Used for route distance/time calculations between cities.
 */
import env from '../config/env.js';

/**
 * Get route information between two coordinates
 */
export async function getRoute(originLat, originLng, destLat, destLng) {
  if (!env.hasGoogleRoutes) {
    // Calculate approximate distance using Haversine formula
    const distance = haversineDistance(originLat, originLng, destLat, destLng);
    const durationMinutes = Math.round(distance / 80 * 60); // Approx 80km/h average

    return {
      distanceKm: Math.round(distance),
      durationMinutes,
      source: 'estimated',
    };
  }

  try {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': env.GOOGLE_ROUTES_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: originLat, longitude: originLng } } },
        destination: { location: { latLng: { latitude: destLat, longitude: destLng } } },
        travelMode: 'DRIVE',
      }),
    });

    const data = await response.json();
    const route = data.routes?.[0];

    return {
      distanceKm: route ? Math.round(route.distanceMeters / 1000) : null,
      durationMinutes: route ? Math.round(parseInt(route.duration) / 60) : null,
      source: 'google',
    };
  } catch (err) {
    console.error('Google Routes error:', err.message);
    const distance = haversineDistance(originLat, originLng, destLat, destLng);
    return {
      distanceKm: Math.round(distance),
      durationMinutes: Math.round(distance / 80 * 60),
      source: 'estimated',
    };
  }
}

/**
 * Haversine formula for approximate distance between two coordinates (in km)
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
