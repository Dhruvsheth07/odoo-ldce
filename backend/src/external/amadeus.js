/**
 * Amadeus API Client
 * Proxies Amadeus API requests for hotels, activities, and flights.
 * Falls back to curated data when credentials are not configured.
 */
import env from '../config/env.js';
import * as fallback from './fallbackData.js';

let amadeusToken = null;
let tokenExpiry = 0;

/**
 * Get Amadeus OAuth2 access token
 */
async function getToken() {
  if (amadeusToken && Date.now() < tokenExpiry) {
    return amadeusToken;
  }

  const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${env.AMADEUS_CLIENT_ID}&client_secret=${env.AMADEUS_CLIENT_SECRET}`,
  });

  const data = await response.json();
  amadeusToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 60s early
  return amadeusToken;
}

/**
 * Make authenticated Amadeus API request
 */
async function amadeusRequest(url) {
  const token = await getToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

/**
 * Search hotels by location and dates
 */
export async function searchHotels(lat, lng, checkIn, checkOut, guests = 1, rooms = 1) {
  if (!env.hasAmadeus) {
    return { results: fallback.searchHotels(lat, lng, checkIn, checkOut, guests, rooms), source: 'fallback' };
  }

  try {
    // Step 1: Find hotels by geocode
    const hotelListUrl = `https://api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${lat}&longitude=${lng}&radius=10&radiusUnit=KM&hotelSource=ALL`;
    const hotelList = await amadeusRequest(hotelListUrl);

    if (!hotelList.data || hotelList.data.length === 0) {
      return { results: fallback.searchHotels(lat, lng, checkIn, checkOut, guests, rooms), source: 'fallback' };
    }

    const hotelIds = hotelList.data.slice(0, 10).map(h => h.hotelId).join(',');

    // Step 2: Get offers for those hotels
    const offersUrl = `https://api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=${guests}&roomQuantity=${rooms}&currency=USD`;
    const offersData = await amadeusRequest(offersUrl);

    if (!offersData.data) {
      return { results: fallback.searchHotels(lat, lng, checkIn, checkOut, guests, rooms), source: 'fallback' };
    }

    const results = offersData.data.map(hotel => {
      const offer = hotel.offers?.[0];
      return {
        externalId: hotel.hotel.hotelId,
        name: hotel.hotel.name,
        rating: hotel.hotel.rating ? parseFloat(hotel.hotel.rating) : null,
        distanceKm: hotel.hotel.distance?.value || null,
        roomInfo: offer?.room?.description?.text || 'Standard Room',
        pricePerNight: offer?.price?.total
          ? parseFloat(offer.price.total) / Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
          : null,
        totalPrice: offer?.price?.total ? parseFloat(offer.price.total) : null,
        priceCurrency: offer?.price?.currency || 'USD',
        priceType: offer?.price?.total ? 'EXACT' : 'UNAVAILABLE',
        provider: 'Amadeus',
        bookingUrl: null,
        imageUrl: null,
        checkIn,
        checkOut,
        guests,
        rooms,
        priceCheckedAt: new Date().toISOString(),
      };
    });

    return { results, source: 'amadeus' };
  } catch (err) {
    console.error('Amadeus hotel search error:', err.message);
    return { results: fallback.searchHotels(lat, lng, checkIn, checkOut, guests, rooms), source: 'fallback' };
  }
}

/**
 * Search activities/tours by location
 */
export async function searchActivities(lat, lng, radius = 10) {
  if (!env.hasAmadeus) {
    return { results: fallback.getActivities(lat, lng), source: 'fallback' };
  }

  try {
    const url = `https://api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lng}&radius=${radius}`;
    const data = await amadeusRequest(url);

    if (!data.data || data.data.length === 0) {
      return { results: fallback.getActivities(lat, lng), source: 'fallback' };
    }

    const results = data.data.map(activity => ({
      externalId: activity.id,
      name: activity.name,
      description: activity.shortDescription || activity.description,
      category: activity.type || 'Experience',
      price: activity.price?.amount ? parseFloat(activity.price.amount) : null,
      priceCurrency: activity.price?.currencyCode || 'USD',
      priceType: activity.price?.amount ? 'FROM' : 'UNAVAILABLE',
      rating: activity.rating ? parseFloat(activity.rating) : null,
      provider: 'Amadeus',
      bookingUrl: activity.bookingLink || null,
      imageUrl: activity.pictures?.[0] || null,
      priceCheckedAt: new Date().toISOString(),
    }));

    return { results, source: 'amadeus' };
  } catch (err) {
    console.error('Amadeus activities search error:', err.message);
    return { results: fallback.getActivities(lat, lng), source: 'fallback' };
  }
}

/**
 * Search flights between two cities
 */
export async function searchFlights(originIata, destIata, date, adults = 1) {
  if (!env.hasAmadeus) {
    return { results: fallback.searchFlights(originIata, destIata, date, adults), source: 'fallback' };
  }

  try {
    const url = `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originIata}&destinationLocationCode=${destIata}&departureDate=${date}&adults=${adults}&max=5&currencyCode=USD`;
    const data = await amadeusRequest(url);

    if (!data.data || data.data.length === 0) {
      return { results: fallback.searchFlights(originIata, destIata, date, adults), source: 'fallback' };
    }

    const results = data.data.map(flight => {
      const segment = flight.itineraries?.[0]?.segments?.[0];
      const lastSegment = flight.itineraries?.[0]?.segments?.slice(-1)[0];

      return {
        externalId: flight.id,
        transportType: 'FLIGHT',
        carrier: segment?.carrierCode || 'Unknown',
        provider: 'Amadeus',
        price: flight.price?.total ? parseFloat(flight.price.total) : null,
        priceCurrency: flight.price?.currency || 'USD',
        priceType: flight.price?.total ? 'EXACT' : 'UNAVAILABLE',
        departureTime: segment?.departure?.at || null,
        arrivalTime: lastSegment?.arrival?.at || null,
        durationMinutes: parseDuration(flight.itineraries?.[0]?.duration),
        bookingUrl: `https://www.google.com/flights?q=${originIata}+to+${destIata}`,
        priceCheckedAt: new Date().toISOString(),
      };
    });

    return { results, source: 'amadeus' };
  } catch (err) {
    console.error('Amadeus flight search error:', err.message);
    return { results: fallback.searchFlights(originIata, destIata, date, adults), source: 'fallback' };
  }
}

/**
 * Parse ISO 8601 duration (PT2H30M) to minutes
 */
function parseDuration(duration) {
  if (!duration) return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;
  return (parseInt(match[1] || 0) * 60) + parseInt(match[2] || 0);
}
