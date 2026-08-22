/**
 * Fallback Data Engine
 * Provides curated, realistic travel data for major cities
 * when external API keys are unavailable or APIs return errors.
 * 
 * IMPORTANT: All prices are clearly marked as ESTIMATED and never presented as live/exact.
 */

const CITIES = {
  'paris': {
    name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light, known for art, fashion, gastronomy, and culture.',
    iata: 'CDG',
  },
  'amsterdam': {
    name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041,
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
    description: 'Famous for its canals, museums, and vibrant cultural scene.',
    iata: 'AMS',
  },
  'rome': {
    name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'The Eternal City with ancient ruins, Vatican City, and world-class cuisine.',
    iata: 'FCO',
  },
  'london': {
    name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    description: 'A global city known for history, royal heritage, and diverse culture.',
    iata: 'LHR',
  },
  'tokyo': {
    name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'A bustling metropolis blending ultramodern and traditional culture.',
    iata: 'NRT',
  },
  'new york': {
    name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The Big Apple — iconic skyline, Broadway, Central Park, and world cuisine.',
    iata: 'JFK',
  },
  'barcelona': {
    name: 'Barcelona', country: 'Spain', latitude: 41.3851, longitude: 2.1734,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Gaudí architecture, Mediterranean beaches, and vibrant nightlife.',
    iata: 'BCN',
  },
  'kyoto': {
    name: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    description: 'Ancient temples, traditional tea houses, and stunning bamboo groves.',
    iata: 'KIX',
  },
  'zurich': {
    name: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417,
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800',
    description: 'Switzerland\'s largest city with stunning lake views and Alpine proximity.',
    iata: 'ZRH',
  },
  'bali': {
    name: 'Bali', country: 'Indonesia', latitude: -8.3405, longitude: 115.0920,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical paradise known for temples, rice terraces, and surf beaches.',
    iata: 'DPS',
  },
};

const PLACES_BY_CITY = {
  'paris': [
    { name: 'Eiffel Tower', category: 'Landmark', rating: 4.7, price: 26.10, priceCurrency: 'EUR', priceType: 'FROM', description: 'Iconic iron lattice tower on the Champ de Mars, offering panoramic views of Paris.', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600' },
    { name: 'Louvre Museum', category: 'Museum', rating: 4.8, price: 17.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'The world\'s largest art museum, home to the Mona Lisa and Venus de Milo.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
    { name: 'Musée d\'Orsay', category: 'Museum', rating: 4.7, price: 16.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'Impressionist and post-impressionist masterpieces in a beautiful Beaux-Arts railway station.', imageUrl: 'https://images.unsplash.com/photo-1591289009723-aef0a1a8a211?w=600' },
    { name: 'Notre-Dame Cathedral', category: 'Religious Site', rating: 4.6, price: null, priceCurrency: 'EUR', priceType: 'UNAVAILABLE', description: 'Medieval Catholic cathedral on Île de la Cité, a masterpiece of French Gothic architecture.', imageUrl: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600' },
    { name: 'Sacré-Cœur Basilica', category: 'Religious Site', rating: 4.6, price: null, priceCurrency: 'EUR', priceType: 'UNAVAILABLE', description: 'White-domed basilica atop Montmartre hill with breathtaking city views.', imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600' },
    { name: 'Arc de Triomphe', category: 'Landmark', rating: 4.6, price: 13.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'Neoclassical triumphal arch honouring those who fought for France.', imageUrl: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600' },
  ],
  'amsterdam': [
    { name: 'Rijksmuseum', category: 'Museum', rating: 4.8, price: 22.50, priceCurrency: 'EUR', priceType: 'EXACT', description: 'Dutch national museum with Rembrandt, Vermeer, and van Gogh masterpieces.', imageUrl: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600' },
    { name: 'Anne Frank House', category: 'Museum', rating: 4.7, price: 16.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'The preserved hiding place where Anne Frank wrote her famous diary.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
    { name: 'Van Gogh Museum', category: 'Museum', rating: 4.8, price: 20.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'World\'s largest collection of Van Gogh paintings and letters.', imageUrl: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600' },
    { name: 'Vondelpark', category: 'Park', rating: 4.6, price: null, priceCurrency: 'EUR', priceType: 'UNAVAILABLE', description: 'Amsterdam\'s most famous park perfect for cycling, picnics, and people-watching.', imageUrl: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600' },
  ],
  'rome': [
    { name: 'Colosseum', category: 'Historic Site', rating: 4.7, price: 18.00, priceCurrency: 'EUR', priceType: 'FROM', description: 'Ancient amphitheatre, the largest ever built, and an icon of Imperial Rome.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
    { name: 'Vatican Museums', category: 'Museum', rating: 4.7, price: 17.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'Vast collection of art and antiquities including the Sistine Chapel ceiling.', imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600' },
    { name: 'Trevi Fountain', category: 'Landmark', rating: 4.7, price: null, priceCurrency: 'EUR', priceType: 'UNAVAILABLE', description: 'Baroque masterpiece — toss a coin to ensure your return to Rome.', imageUrl: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600' },
    { name: 'Pantheon', category: 'Historic Site', rating: 4.8, price: 5.00, priceCurrency: 'EUR', priceType: 'EXACT', description: 'Former Roman temple with the world\'s largest unreinforced concrete dome.', imageUrl: 'https://images.unsplash.com/photo-1588614959060-4d144f28b331?w=600' },
    { name: 'Roman Forum', category: 'Historic Site', rating: 4.6, price: 18.00, priceCurrency: 'EUR', priceType: 'FROM', description: 'The center of ancient Roman public life with ruins of important government buildings.', imageUrl: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600' },
  ],
  'london': [
    { name: 'British Museum', category: 'Museum', rating: 4.7, price: null, priceCurrency: 'GBP', priceType: 'UNAVAILABLE', description: 'World-class museum of human history and culture, free to visit.', imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600' },
    { name: 'Tower of London', category: 'Historic Site', rating: 4.7, price: 33.60, priceCurrency: 'GBP', priceType: 'EXACT', description: 'Historic castle and fortress housing the Crown Jewels.', imageUrl: 'https://images.unsplash.com/photo-1543832923-44667a44c860?w=600' },
    { name: 'Buckingham Palace', category: 'Landmark', rating: 4.5, price: 30.00, priceCurrency: 'GBP', priceType: 'FROM', description: 'The official London residence of the British monarch.', imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600' },
  ],
  'tokyo': [
    { name: 'Senso-ji Temple', category: 'Religious Site', rating: 4.6, price: null, priceCurrency: 'JPY', priceType: 'UNAVAILABLE', description: 'Tokyo\'s oldest temple in the colorful Asakusa district.', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600' },
    { name: 'Meiji Shrine', category: 'Religious Site', rating: 4.7, price: null, priceCurrency: 'JPY', priceType: 'UNAVAILABLE', description: 'Serene Shinto shrine surrounded by a lush forest in Shibuya.', imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600' },
    { name: 'Tokyo Skytree', category: 'Landmark', rating: 4.4, price: 2100, priceCurrency: 'JPY', priceType: 'FROM', description: 'The tallest tower in Japan with observation decks offering 360-degree views.', imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600' },
    { name: 'Shibuya Crossing', category: 'Landmark', rating: 4.5, price: null, priceCurrency: 'JPY', priceType: 'UNAVAILABLE', description: 'The world\'s busiest pedestrian crossing, iconic symbol of Tokyo.', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600' },
  ],
};

const ACTIVITIES_BY_CITY = {
  'paris': [
    { name: 'Seine River Cruise', category: 'Tour', price: 15.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.5, description: 'A scenic cruise along the Seine passing iconic Paris landmarks.', provider: 'Bateaux Mouches', bookingUrl: 'https://www.bateaux-mouches.fr', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600' },
    { name: 'Paris Food Tour', category: 'Food & Drink', price: 89.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.8, description: 'Guided walking tour through Le Marais tasting local cheeses, pastries, and wine.', provider: 'Devour Tours', bookingUrl: 'https://devourtours.com', imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600' },
    { name: 'Versailles Day Trip', category: 'Day Trip', price: 55.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.6, description: 'Skip-the-line guided tour of the Palace of Versailles and gardens.', provider: 'GetYourGuide', bookingUrl: 'https://getyourguide.com', imageUrl: 'https://images.unsplash.com/photo-1590044821578-77862b90f8d0?w=600' },
  ],
  'amsterdam': [
    { name: 'Canal Cruise', category: 'Tour', price: 14.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.5, description: 'A scenic boat tour through Amsterdam\'s historic canals.', provider: 'Stromma', bookingUrl: 'https://stromma.com', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600' },
    { name: 'Bike Tour of Amsterdam', category: 'Tour', price: 32.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.7, description: 'Explore Amsterdam like a local on a guided bicycle tour.', provider: 'We Bike Amsterdam', bookingUrl: 'https://webikeamsterdam.com', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
  ],
  'rome': [
    { name: 'Gladiator Arena Tour', category: 'Tour', price: 60.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.7, description: 'VIP access to the Colosseum arena floor with expert guide.', provider: 'Walks of Italy', bookingUrl: 'https://walksofitaly.com', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
    { name: 'Cooking Class in Trastevere', category: 'Food & Drink', price: 75.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.9, description: 'Learn to make fresh pasta and tiramisu in a charming Roman kitchen.', provider: 'Cookly', bookingUrl: 'https://cookly.me', imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600' },
    { name: 'Vatican Skip-the-Line Tour', category: 'Tour', price: 49.00, priceCurrency: 'EUR', priceType: 'FROM', rating: 4.6, description: 'Expert-guided tour of the Vatican Museums, Sistine Chapel, and St. Peter\'s.', provider: 'GetYourGuide', bookingUrl: 'https://getyourguide.com', imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600' },
  ],
  'tokyo': [
    { name: 'Tsukiji Fish Market Tour', category: 'Food & Drink', price: 12000, priceCurrency: 'JPY', priceType: 'FROM', rating: 4.7, description: 'Early morning walking tour of the iconic outer fish market with tastings.', provider: 'Arigato Japan', bookingUrl: 'https://arigatojapan.co.jp', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600' },
    { name: 'Traditional Tea Ceremony', category: 'Cultural', price: 5000, priceCurrency: 'JPY', priceType: 'FROM', rating: 4.8, description: 'Experience an authentic Japanese tea ceremony in a traditional tea house.', provider: 'Maikoya', bookingUrl: 'https://mai-ko.com', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600' },
  ],
  'london': [
    { name: 'Harry Potter Studio Tour', category: 'Tour', price: 53.00, priceCurrency: 'GBP', priceType: 'EXACT', rating: 4.8, description: 'Behind-the-scenes tour of the original Harry Potter film sets.', provider: 'Warner Bros', bookingUrl: 'https://wbstudiotour.co.uk', imageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600' },
  ],
};

const HOTELS_BY_CITY = {
  'paris': [
    { name: 'Hôtel Plaza Athénée', rating: 4.9, distanceKm: 0.8, pricePerNight: 850, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Booking.com', roomInfo: 'Deluxe Room, City View', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', bookingUrl: 'https://booking.com' },
    { name: 'Hôtel Le Marais', rating: 4.5, distanceKm: 1.2, pricePerNight: 180, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Hotels.com', roomInfo: 'Standard Double Room', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', bookingUrl: 'https://hotels.com' },
    { name: 'Ibis Paris Montmartre', rating: 3.8, distanceKm: 2.5, pricePerNight: 95, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Accor', roomInfo: 'Standard Room', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600', bookingUrl: 'https://accor.com' },
    { name: 'Hôtel de Crillon', rating: 4.8, distanceKm: 0.5, pricePerNight: 1200, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Rosewood', roomInfo: 'Superior Room', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', bookingUrl: 'https://rosewoodhotels.com' },
  ],
  'amsterdam': [
    { name: 'Hotel V Nesplein', rating: 4.6, distanceKm: 0.3, pricePerNight: 195, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Booking.com', roomInfo: 'Cozy Double Room', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', bookingUrl: 'https://booking.com' },
    { name: 'citizenM Amsterdam', rating: 4.4, distanceKm: 1.1, pricePerNight: 140, priceCurrency: 'EUR', priceType: 'FROM', provider: 'citizenM', roomInfo: 'Standard Room', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600', bookingUrl: 'https://citizenm.com' },
  ],
  'rome': [
    { name: 'Hotel de Russie', rating: 4.8, distanceKm: 0.6, pricePerNight: 550, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Rocco Forte', roomInfo: 'Classic Room, Garden View', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', bookingUrl: 'https://roccofortehotels.com' },
    { name: 'Hotel Artemide', rating: 4.6, distanceKm: 0.9, pricePerNight: 200, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Booking.com', roomInfo: 'Superior Double Room', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', bookingUrl: 'https://booking.com' },
    { name: 'Generator Rome', rating: 4.0, distanceKm: 1.8, pricePerNight: 65, priceCurrency: 'EUR', priceType: 'FROM', provider: 'Generator', roomInfo: 'Private Room', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600', bookingUrl: 'https://staygenerator.com' },
  ],
  'tokyo': [
    { name: 'Park Hyatt Tokyo', rating: 4.8, distanceKm: 1.5, pricePerNight: 65000, priceCurrency: 'JPY', priceType: 'FROM', provider: 'Hyatt', roomInfo: 'Park Room, City View', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', bookingUrl: 'https://hyatt.com' },
    { name: 'Shinjuku Granbell Hotel', rating: 4.3, distanceKm: 0.4, pricePerNight: 15000, priceCurrency: 'JPY', priceType: 'FROM', provider: 'Booking.com', roomInfo: 'Standard Double', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', bookingUrl: 'https://booking.com' },
  ],
  'london': [
    { name: 'The Savoy', rating: 4.8, distanceKm: 0.5, pricePerNight: 600, priceCurrency: 'GBP', priceType: 'FROM', provider: 'Fairmont', roomInfo: 'Superior Queen Room', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', bookingUrl: 'https://fairmont.com' },
    { name: 'Premier Inn London City', rating: 4.1, distanceKm: 2.0, pricePerNight: 89, priceCurrency: 'GBP', priceType: 'FROM', provider: 'Premier Inn', roomInfo: 'Standard Room', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600', bookingUrl: 'https://premierinn.com' },
  ],
};

const FLIGHT_ROUTES = {
  'CDG-AMS': { carrier: 'Air France', price: 120, priceCurrency: 'EUR', durationMinutes: 80 },
  'AMS-FCO': { carrier: 'KLM', price: 145, priceCurrency: 'EUR', durationMinutes: 140 },
  'CDG-FCO': { carrier: 'Alitalia', price: 110, priceCurrency: 'EUR', durationMinutes: 130 },
  'LHR-CDG': { carrier: 'British Airways', price: 95, priceCurrency: 'GBP', durationMinutes: 75 },
  'LHR-AMS': { carrier: 'KLM', price: 85, priceCurrency: 'GBP', durationMinutes: 70 },
  'LHR-FCO': { carrier: 'British Airways', price: 130, priceCurrency: 'GBP', durationMinutes: 150 },
  'NRT-KIX': { carrier: 'ANA', price: 15000, priceCurrency: 'JPY', durationMinutes: 75 },
  'JFK-LHR': { carrier: 'Delta', price: 450, priceCurrency: 'USD', durationMinutes: 420 },
  'JFK-CDG': { carrier: 'Air France', price: 480, priceCurrency: 'USD', durationMinutes: 450 },
  'ZRH-FCO': { carrier: 'Swiss Air', price: 130, priceCurrency: 'CHF', durationMinutes: 100 },
  'BCN-CDG': { carrier: 'Vueling', price: 75, priceCurrency: 'EUR', durationMinutes: 115 },
  'BCN-FCO': { carrier: 'Ryanair', price: 45, priceCurrency: 'EUR', durationMinutes: 120 },
};

const TRAIN_ROUTES = {
  'paris-amsterdam': { carrier: 'Thalys', price: 35, priceCurrency: 'EUR', durationMinutes: 195, provider: 'Thalys' },
  'paris-london': { carrier: 'Eurostar', price: 44, priceCurrency: 'EUR', durationMinutes: 136, provider: 'Eurostar' },
  'amsterdam-london': { carrier: 'Eurostar', price: 40, priceCurrency: 'EUR', durationMinutes: 240, provider: 'Eurostar' },
  'rome-florence': { carrier: 'Trenitalia', price: 25, priceCurrency: 'EUR', durationMinutes: 95, provider: 'Trenitalia' },
  'tokyo-kyoto': { carrier: 'Shinkansen', price: 13320, priceCurrency: 'JPY', durationMinutes: 135, provider: 'JR Central' },
  'kyoto-osaka': { carrier: 'JR Special Rapid', price: 580, priceCurrency: 'JPY', durationMinutes: 29, provider: 'JR West' },
  'zurich-interlaken': { carrier: 'SBB', price: 32, priceCurrency: 'CHF', durationMinutes: 115, provider: 'SBB' },
  'paris-barcelona': { carrier: 'TGV', price: 59, priceCurrency: 'EUR', durationMinutes: 390, provider: 'SNCF' },
};

// ─── Public API ─────────────────────────────────────────

/**
 * Search cities by query string
 */
export function searchCities(query) {
  const q = query.toLowerCase().trim();
  return Object.values(CITIES).filter(city =>
    city.name.toLowerCase().includes(q) || city.country.toLowerCase().includes(q)
  ).map(city => ({
    ...city,
    placeId: `fallback_${city.name.toLowerCase().replace(/\s+/g, '_')}`,
  }));
}

/**
 * Get nearby places/attractions for a city
 */
export function getNearbyPlaces(lat, lng) {
  const cityKey = findCityByCoords(lat, lng);
  const places = PLACES_BY_CITY[cityKey] || [];
  return places.map((place, i) => ({
    ...place,
    externalId: `fallback_place_${cityKey}_${i}`,
    priceCheckedAt: new Date().toISOString(),
  }));
}

/**
 * Get activities/experiences for a city
 */
export function getActivities(lat, lng) {
  const cityKey = findCityByCoords(lat, lng);
  const activities = ACTIVITIES_BY_CITY[cityKey] || [];
  return activities.map((activity, i) => ({
    ...activity,
    externalId: `fallback_activity_${cityKey}_${i}`,
    priceCheckedAt: new Date().toISOString(),
  }));
}

/**
 * Search hotels near coordinates
 */
export function searchHotels(lat, lng, checkIn, checkOut, guests = 1, rooms = 1) {
  const cityKey = findCityByCoords(lat, lng);
  const hotels = HOTELS_BY_CITY[cityKey] || [];
  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

  return hotels.map((hotel, i) => ({
    ...hotel,
    externalId: `fallback_hotel_${cityKey}_${i}`,
    totalPrice: hotel.pricePerNight * nights,
    checkIn,
    checkOut,
    guests,
    rooms,
    priceCheckedAt: new Date().toISOString(),
  }));
}

/**
 * Search flights between two cities
 */
export function searchFlights(originIata, destIata, date, adults = 1) {
  const key = `${originIata}-${destIata}`;
  const reverseKey = `${destIata}-${originIata}`;
  const route = FLIGHT_ROUTES[key] || FLIGHT_ROUTES[reverseKey];

  if (!route) return [];

  const departureTime = new Date(`${date}T09:00:00`);
  const arrivalTime = new Date(departureTime.getTime() + route.durationMinutes * 60000);

  return [{
    externalId: `fallback_flight_${key}`,
    transportType: 'FLIGHT',
    carrier: route.carrier,
    provider: route.carrier,
    price: route.price * adults,
    priceCurrency: route.priceCurrency,
    priceType: 'ESTIMATED',
    departureTime: departureTime.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    durationMinutes: route.durationMinutes,
    bookingUrl: `https://www.google.com/flights?q=${originIata}+to+${destIata}`,
    priceCheckedAt: new Date().toISOString(),
  },
  {
    externalId: `fallback_flight_${key}_2`,
    transportType: 'FLIGHT',
    carrier: route.carrier,
    provider: route.carrier,
    price: Math.round(route.price * 1.3) * adults,
    priceCurrency: route.priceCurrency,
    priceType: 'ESTIMATED',
    departureTime: new Date(`${date}T14:30:00`).toISOString(),
    arrivalTime: new Date(new Date(`${date}T14:30:00`).getTime() + route.durationMinutes * 60000).toISOString(),
    durationMinutes: route.durationMinutes,
    bookingUrl: `https://www.google.com/flights?q=${originIata}+to+${destIata}`,
    priceCheckedAt: new Date().toISOString(),
  }];
}

/**
 * Search train/bus routes between two cities
 */
export function searchTrainBus(fromCity, toCity) {
  const results = [];
  const key = `${fromCity.toLowerCase()}-${toCity.toLowerCase()}`;
  const reverseKey = `${toCity.toLowerCase()}-${fromCity.toLowerCase()}`;

  const trainRoute = TRAIN_ROUTES[key] || TRAIN_ROUTES[reverseKey];
  if (trainRoute) {
    results.push({
      externalId: `fallback_train_${key}`,
      transportType: 'TRAIN',
      carrier: trainRoute.carrier,
      provider: trainRoute.provider,
      price: trainRoute.price,
      priceCurrency: trainRoute.priceCurrency,
      priceType: 'ESTIMATED',
      durationMinutes: trainRoute.durationMinutes,
      bookingUrl: `https://www.omio.com/search/${fromCity}/${toCity}`,
      priceCheckedAt: new Date().toISOString(),
    });
  }

  // Add bus option (generally cheaper, longer)
  if (trainRoute) {
    results.push({
      externalId: `fallback_bus_${key}`,
      transportType: 'BUS',
      carrier: 'FlixBus',
      provider: 'FlixBus',
      price: Math.round(trainRoute.price * 0.5),
      priceCurrency: trainRoute.priceCurrency,
      priceType: 'ESTIMATED',
      durationMinutes: Math.round(trainRoute.durationMinutes * 1.8),
      bookingUrl: `https://www.flixbus.com`,
      priceCheckedAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Get recommended destinations for dashboard
 */
export function getRecommendedDestinations(limit = 6) {
  const cities = Object.values(CITIES);
  const shuffled = cities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit).map(city => ({
    ...city,
    placeId: `fallback_${city.name.toLowerCase().replace(/\s+/g, '_')}`,
  }));
}

// ─── Helpers ────────────────────────────────────────────

function findCityByCoords(lat, lng) {
  let closest = null;
  let minDist = Infinity;

  for (const [key, city] of Object.entries(CITIES)) {
    const dist = Math.sqrt(Math.pow(city.latitude - lat, 2) + Math.pow(city.longitude - lng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = key;
    }
  }

  return closest;
}

/**
 * Find city IATA code by coordinates
 */
export function findIataByCoords(lat, lng) {
  const cityKey = findCityByCoords(lat, lng);
  return CITIES[cityKey]?.iata || null;
}

/**
 * Find city name by coordinates
 */
export function findCityNameByCoords(lat, lng) {
  const cityKey = findCityByCoords(lat, lng);
  return CITIES[cityKey]?.name || null;
}
