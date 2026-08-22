/**
 * Google Places API Client
 * Proxies Google Places API requests from backend only.
 * Falls back to fallback data when API key is not configured.
 */
import env from '../config/env.js';
import * as fallback from './fallbackData.js';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const PLACES_NEW_URL = 'https://places.googleapis.com/v1/places';

/**
 * Search for cities/places by text query
 */
export async function searchPlaces(query) {
  if (!env.hasGooglePlaces) {
    return { results: fallback.searchCities(query), source: 'fallback' };
  }

  try {
    const url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&key=${env.GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.warn(`Google Places API error: ${data.status}`);
      return { results: fallback.searchCities(query), source: 'fallback' };
    }

    const results = data.results.map(place => ({
      name: place.name,
      country: extractCountry(place.formatted_address),
      placeId: place.place_id,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      imageUrl: place.photos?.[0]
        ? `${BASE_URL}/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${env.GOOGLE_PLACES_API_KEY}`
        : null,
      description: place.formatted_address,
      rating: place.rating,
    }));

    return { results, source: 'google' };
  } catch (err) {
    console.error('Google Places search error:', err.message);
    return { results: fallback.searchCities(query), source: 'fallback' };
  }
}

/**
 * Search nearby places by coordinates
 */
export async function searchNearby(lat, lng, radius = 5000, type = 'tourist_attraction') {
  if (!env.hasGooglePlaces) {
    return { results: fallback.getNearbyPlaces(lat, lng), source: 'fallback' };
  }

  try {
    const url = `${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${env.GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return { results: fallback.getNearbyPlaces(lat, lng), source: 'fallback' };
    }

    const results = data.results.map(place => ({
      externalId: place.place_id,
      name: place.name,
      category: place.types?.[0] || 'attraction',
      rating: place.rating,
      price: null,
      priceCurrency: null,
      priceType: 'UNAVAILABLE',
      description: place.vicinity,
      imageUrl: place.photos?.[0]
        ? `${BASE_URL}/photo?maxwidth=600&photoreference=${place.photos[0].photo_reference}&key=${env.GOOGLE_PLACES_API_KEY}`
        : null,
      priceCheckedAt: new Date().toISOString(),
    }));

    return { results, source: 'google' };
  } catch (err) {
    console.error('Google nearby search error:', err.message);
    return { results: fallback.getNearbyPlaces(lat, lng), source: 'fallback' };
  }
}

/**
 * Get place details by place ID
 */
export async function getPlaceDetails(placeId) {
  if (!env.hasGooglePlaces || placeId.startsWith('fallback_')) {
    return null;
  }

  try {
    const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,rating,reviews,opening_hours,website,url&key=${env.GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') return null;

    const place = data.result;
    return {
      name: place.name,
      address: place.formatted_address,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      rating: place.rating,
      website: place.website,
      mapsUrl: place.url,
      openingHours: place.opening_hours?.weekday_text,
      imageUrls: place.photos?.slice(0, 5).map(p =>
        `${BASE_URL}/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${env.GOOGLE_PLACES_API_KEY}`
      ),
    };
  } catch (err) {
    console.error('Google place details error:', err.message);
    return null;
  }
}

function extractCountry(formattedAddress) {
  if (!formattedAddress) return null;
  const parts = formattedAddress.split(',');
  return parts[parts.length - 1]?.trim() || null;
}
