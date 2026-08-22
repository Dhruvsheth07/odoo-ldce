import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tripApi from '../../services/tripApi';
import { discoveryApi } from '../../services/discoveryApi';
import LoadingSkeleton from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import PriceBadge from '../../components/common/PriceBadge';
import { formatRating } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CityExplorer({ trip }) {
  const [searchParams] = useSearchParams();
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [activeSection, setActiveSection] = useState('places');
  const [places, setPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchStops();
  }, [trip.id]);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getStops(trip.id);
      const stopsData = data?.data || [];
      setStops(stopsData);
      const stopId = searchParams.get('stopId');
      const initial = stopsData.find(s => s.id === stopId) || stopsData[0];
      if (initial) {
        setSelectedStop(initial);
        searchNearby(initial);
      }
    } catch { /* empty */ }
    setLoading(false);
  };

  const searchNearby = async (stop) => {
    if (!stop?.destination?.latitude) return;
    setSearching(true);
    try {
      const [placesRes, activitiesRes] = await Promise.allSettled([
        discoveryApi.getNearbyPlaces(stop.destination.latitude, stop.destination.longitude, 5000, 'tourist_attraction'),
        discoveryApi.searchActivities(stop.destination.latitude, stop.destination.longitude, 5000),
      ]);
      if (placesRes.status === 'fulfilled') setPlaces(placesRes.value.data?.data || []);
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.data?.data || []);
    } catch { /* empty */ }
    setSearching(false);
  };

  const handleStopChange = (stop) => {
    setSelectedStop(stop);
    setPlaces([]);
    setActivities([]);
    searchNearby(stop);
  };

  const handleAddActivity = async (activity) => {
    if (!selectedStop) return;
    try {
      await discoveryApi.addActivity(selectedStop.id, {
        name: activity.name,
        description: activity.description,
        category: activity.category || 'attraction',
        imageUrl: activity.imageUrl || activity.image_url,
        price: activity.price,
        priceCurrency: activity.priceCurrency || trip.currency,
        priceType: activity.priceType || 'UNAVAILABLE',
        rating: activity.rating,
        bookingUrl: activity.bookingUrl || activity.booking_url,
        provider: activity.provider,
      });
      toast.success(`"${activity.name}" added to itinerary!`);
    } catch {
      toast.error('Failed to add activity.');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={6} />;

  if (stops.length === 0) {
    return (
      <EmptyState
        icon="pin_drop"
        title="No destinations to explore"
        message="Add a destination in the Overview tab first."
      />
    );
  }

  const sections = [
    { key: 'places', label: 'Places', icon: 'place' },
    { key: 'activities', label: 'Activities', icon: 'local_activity' },
  ];

  const currentItems = activeSection === 'places' ? places : activities;

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Stop Selector */}
      <div className="flex flex-wrap gap-3">
        {stops.map(stop => (
          <button
            key={stop.id}
            onClick={() => handleStopChange(stop)}
            className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-all ${
              selectedStop?.id === stop.id
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            {stop.destination?.name}
          </button>
        ))}
      </div>

      {selectedStop && (
        <>
          {/* Section Tabs */}
          <div className="tab-nav w-fit">
            {sections.map(s => (
              <button
                key={s.key}
                className={`tab-btn flex items-center gap-2 ${activeSection === s.key ? 'active' : ''}`}
                onClick={() => setActiveSection(s.key)}
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {searching ? (
            <LoadingSkeleton type="card" count={4} />
          ) : currentItems.length === 0 ? (
            <EmptyState
              icon={activeSection === 'places' ? 'travel_explore' : 'local_activity'}
              title={`No ${activeSection} found`}
              message="Try exploring a different destination."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
              {currentItems.map((item, i) => (
                <div key={item.id || item.placeId || i} className="card flex flex-col">
                  <div className="h-40 bg-surface-container overflow-hidden">
                    {item.imageUrl || item.image_url ? (
                      <img src={item.imageUrl || item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[48px] text-outline-variant">photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-body-md font-semibold text-primary mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-body-sm text-secondary mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {item.rating && (
                        <span className="text-body-sm text-on-surface-variant">{formatRating(item.rating)}</span>
                      )}
                      {item.price != null && (
                        <PriceBadge price={item.price} priceType={item.priceType || item.price_type} currency={item.priceCurrency || trip.currency} />
                      )}
                      {item.provider && (
                        <span className="badge badge-neutral text-[10px]">{item.provider}</span>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => handleAddActivity(item)} className="btn btn-primary btn-sm flex-grow">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add to Itinerary
                      </button>
                      {(item.bookingUrl || item.booking_url) && (
                        <a
                          href={item.bookingUrl || item.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
