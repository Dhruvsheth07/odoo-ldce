import { useState, useEffect } from 'react';
import tripApi from '../../services/tripApi';
import { discoveryApi } from '../../services/discoveryApi';
import LoadingSkeleton from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import PriceBadge from '../../components/common/PriceBadge';
import { formatRating, formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function HotelSearch({ trip }) {
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  useEffect(() => { fetchStops(); }, [trip.id]);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getStops(trip.id);
      const stopsData = data?.data || [];
      setStops(stopsData);
      if (stopsData[0]) {
        setSelectedStop(stopsData[0]);
        searchHotels(stopsData[0]);
      }
    } catch { /* empty */ }
    setLoading(false);
  };

  const searchHotels = async (stop) => {
    if (!stop?.destination?.latitude) return;
    setSearching(true);
    try {
      const { data } = await discoveryApi.searchHotels(
        stop.destination.latitude, stop.destination.longitude,
        stop.arrivalDate, stop.departureDate,
        guests, rooms
      );
      setHotels(data?.data || []);
    } catch { setHotels([]); }
    setSearching(false);
  };

  const handleStopChange = (stop) => {
    setSelectedStop(stop);
    setHotels([]);
    searchHotels(stop);
  };

  const handleAddHotel = async (hotel) => {
    if (!selectedStop) return;
    try {
      await discoveryApi.addHotel(selectedStop.id, {
        name: hotel.name,
        imageUrl: hotel.imageUrl || hotel.image_url,
        rating: hotel.rating,
        distanceKm: hotel.distanceKm || hotel.distance_km,
        roomInfo: hotel.roomInfo || hotel.room_info,
        pricePerNight: hotel.pricePerNight || hotel.price_per_night,
        totalPrice: hotel.totalPrice || hotel.total_price,
        priceCurrency: hotel.priceCurrency || trip.currency,
        priceType: hotel.priceType || hotel.price_type || 'UNAVAILABLE',
        provider: hotel.provider,
        bookingUrl: hotel.bookingUrl || hotel.booking_url,
        checkIn: selectedStop.arrivalDate,
        checkOut: selectedStop.departureDate,
        guests,
        rooms,
      });
      toast.success(`"${hotel.name}" added to trip!`);
    } catch {
      toast.error('Failed to add hotel.');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  if (stops.length === 0) {
    return <EmptyState icon="pin_drop" title="No destinations" message="Add a destination first." />;
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Stop Selector + Search Controls */}
      <div className="flex flex-wrap items-end gap-4">
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
        <div className="flex gap-3 items-end ml-auto">
          <div>
            <label className="input-label">Guests</label>
            <input type="number" className="input w-20" value={guests} onChange={e => setGuests(Number(e.target.value))} min={1} />
          </div>
          <div>
            <label className="input-label">Rooms</label>
            <input type="number" className="input w-20" value={rooms} onChange={e => setRooms(Number(e.target.value))} min={1} />
          </div>
          <button onClick={() => selectedStop && searchHotels(selectedStop)} className="btn btn-primary btn-sm">
            Search
          </button>
        </div>
      </div>

      {/* Dates info */}
      {selectedStop && (
        <p className="text-body-sm text-secondary">
          <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">date_range</span>
          {formatDate(selectedStop.arrivalDate, 'MMM dd, yyyy')} – {formatDate(selectedStop.departureDate, 'MMM dd, yyyy')}
        </p>
      )}

      {/* Results */}
      {searching ? (
        <LoadingSkeleton type="card" count={4} />
      ) : hotels.length === 0 ? (
        <EmptyState
          icon="hotel"
          title="No hotels found"
          message="Try adjusting search parameters or select a different destination."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
          {hotels.map((hotel, i) => (
            <div key={hotel.id || i} className="card flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-56 h-48 md:h-auto bg-surface-container shrink-0 overflow-hidden">
                {hotel.imageUrl || hotel.image_url ? (
                  <img src={hotel.imageUrl || hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-outline-variant">hotel</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-body-md font-semibold text-primary mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-3 text-body-sm text-secondary mb-2 flex-wrap">
                  {hotel.rating && <span>{formatRating(hotel.rating)}</span>}
                  {(hotel.distanceKm || hotel.distance_km) && (
                    <span>{(hotel.distanceKm || hotel.distance_km).toFixed(1)} km away</span>
                  )}
                </div>
                {(hotel.roomInfo || hotel.room_info) && (
                  <p className="text-body-sm text-on-surface-variant mb-3">{hotel.roomInfo || hotel.room_info}</p>
                )}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <PriceBadge
                    price={hotel.totalPrice || hotel.total_price}
                    priceType={hotel.priceType || hotel.price_type}
                    currency={hotel.priceCurrency || trip.currency}
                    label="total stay"
                  />
                  {(hotel.pricePerNight || hotel.price_per_night) && (
                    <span className="text-body-sm text-secondary">
                      ({formatPrice(hotel.pricePerNight || hotel.price_per_night, hotel.priceCurrency || trip.currency)}/night)
                    </span>
                  )}
                  {hotel.provider && <span className="badge badge-neutral text-[10px]">{hotel.provider}</span>}
                </div>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => handleAddHotel(hotel)} className="btn btn-primary btn-sm flex-grow">
                    Add to Trip
                  </button>
                  {(hotel.bookingUrl || hotel.booking_url) && (
                    <a href={hotel.bookingUrl || hotel.booking_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      View on {hotel.provider || 'Provider'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-label-caps text-outline text-center">Prices are dynamic and may change.</p>
    </div>
  );
}
