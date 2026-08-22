import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tripApi from '../../services/tripApi';
import { discoveryApi } from '../../services/discoveryApi';
import { formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function TripOverview({ trip, onRefresh }) {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingStop, setAddingStop] = useState(false);

  useEffect(() => {
    fetchStops();
  }, [trip.id]);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getStops(trip.id);
      setStops(data?.data || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await discoveryApi.searchPlaces(searchQuery);
      setSearchResults(data?.data || []);
    } catch {
      toast.error('Search failed.');
    }
    setSearching(false);
  };

  const handleAddStop = async (place) => {
    setAddingStop(true);
    try {
      await tripApi.addStop(trip.id, {
        destinationName: place.name,
        destinationCountry: place.country,
        placeId: place.placeId || place.place_id,
        latitude: place.latitude || place.lat,
        longitude: place.longitude || place.lng,
        imageUrl: place.imageUrl || place.image_url,
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
      });
      toast.success(`${place.name} added!`);
      setSearchResults([]);
      setSearchQuery('');
      fetchStops();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add stop.');
    }
    setAddingStop(false);
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await tripApi.deleteStop(stopId);
      toast.success('Stop removed.');
      fetchStops();
      if (onRefresh) onRefresh();
    } catch {
      toast.error('Failed to remove stop.');
    }
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Trip Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Duration</p>
          <p className="text-headline-md text-primary">
            {formatDate(trip.startDate, 'MMM dd')} – {formatDate(trip.endDate, 'MMM dd')}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Budget</p>
          <p className="text-headline-md text-primary">
            {formatPrice(trip.budget, trip.currency)}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Stops</p>
          <p className="text-headline-md text-primary">
            {stops.length} {stops.length === 1 ? 'City' : 'Cities'}
          </p>
        </div>
      </div>

      {/* Add Destination */}
      <section>
        <h2 className="text-headline-md text-primary mb-4">Add a Destination</h2>
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
            <input
              className="input pl-10 rounded-full"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} disabled={searching} className="btn btn-primary">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-3">
            {searchResults.map((place, i) => (
              <div key={place.placeId || place.place_id || i} className="card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  {place.imageUrl || place.image_url ? (
                    <img src={place.imageUrl || place.image_url} alt={place.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">location_city</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-body-md font-semibold text-primary truncate">{place.name}</p>
                  <p className="text-body-sm text-secondary">{place.country}</p>
                </div>
                <button
                  onClick={() => handleAddStop(place)}
                  disabled={addingStop}
                  className="btn btn-primary btn-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stops List */}
      <section>
        <h2 className="text-headline-md text-primary mb-4">Trip Stops</h2>
        {stops.length === 0 ? (
          <EmptyState
            icon="pin_drop"
            title="No destinations added"
            message="Search for a city above to add your first destination."
          />
        ) : (
          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div key={stop.id} className="card p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-body-sm shrink-0">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  {stop.destination?.imageUrl ? (
                    <img src={stop.destination.imageUrl} alt={stop.destination.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">location_on</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-body-md font-semibold text-primary">{stop.destination?.name}</p>
                  <p className="text-body-sm text-secondary">
                    {formatDate(stop.arrivalDate, 'MMM dd')} – {formatDate(stop.departureDate, 'MMM dd')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/trips/${trip.id}/explore?stopId=${stop.id}`)}
                    className="btn btn-ghost btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">explore</span>
                    Explore
                  </button>
                  <button
                    onClick={() => handleDeleteStop(stop.id)}
                    className="btn-icon text-error"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
