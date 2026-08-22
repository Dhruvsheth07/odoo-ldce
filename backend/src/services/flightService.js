import * as amadeus from '../external/amadeus.js';

export async function searchFlights(originIata, destIata, date, adults) {
  return amadeus.searchFlights(originIata, destIata, date, adults);
}
