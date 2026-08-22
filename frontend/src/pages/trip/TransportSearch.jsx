import { useState, useEffect } from 'react';
import tripApi from '../../services/tripApi';
import { discoveryApi } from '../../services/discoveryApi';
import LoadingSkeleton from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import PriceBadge from '../../components/common/PriceBadge';
import { formatDuration } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { TRANSPORT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function TransportSearch({ trip }) {
  const [stops, setStops] = useState([]);
  const [fromStop, setFromStop] = useState(null);
  const [toStop, setToStop] = useState(null);
  const [transportType, setTransportType] = useState('FLIGHT');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => { fetchStops(); }, [trip.id]);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getStops(trip.id);
      const stopsData = data?.data || [];
      setStops(stopsData);
      if (stopsData.length >= 2) {
        setFromStop(stopsData[0]);
        setToStop(stopsData[1]);
      }
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!fromStop || !toStop) {
      toast.error('Select departure and arrival cities.');
      return;
    }
    setSearching(true);
    try {
      const date = fromStop.departureDate || trip.startDate;
      if (transportType === 'FLIGHT') {
        const { data } = await discoveryApi.searchFlights(
          fromStop.destination?.name, toStop.destination?.name, date, 1
        );
        setResults(data?.data || []);
      } else {
        const { data } = await discoveryApi.searchTransport(
          fromStop.destination?.name, toStop.destination?.name, date, transportType
        );
        setResults(data?.data || []);
      }
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const handleAddTransport = async (transport) => {
    try {
      await discoveryApi.addTransport(trip.id, {
        fromStopId: fromStop.id,
        toStopId: toStop.id,
        transportType: transport.transportType || transportType,
        provider: transport.provider || transport.carrier,
        carrier: transport.carrier,
        price: transport.price,
        priceCurrency: transport.priceCurrency || trip.currency,
        priceType: transport.priceType || 'ESTIMATED',
        departureTime: transport.departureTime || transport.departure_time,
        arrivalTime: transport.arrivalTime || transport.arrival_time,
        durationMinutes: transport.durationMinutes || transport.duration_minutes,
        bookingUrl: transport.bookingUrl || transport.booking_url,
        externalId: transport.externalId || transport.external_id,
      });
      toast.success('Transport added to trip!');
    } catch {
      toast.error('Failed to add transport.');
    }
  };

  if (loading) return <LoadingSkeleton type="list" count={4} />;

  if (stops.length < 2) {
    return <EmptyState icon="connecting_airports" title="Need at least 2 stops" message="Add more destinations in the Overview tab." />;
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Search Controls */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="input-label">From</label>
            <select className="input" value={fromStop?.id || ''} onChange={e => setFromStop(stops.find(s => s.id === e.target.value))}>
              {stops.map(s => <option key={s.id} value={s.id}>{s.destination?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">To</label>
            <select className="input" value={toStop?.id || ''} onChange={e => setToStop(stops.find(s => s.id === e.target.value))}>
              {stops.map(s => <option key={s.id} value={s.id}>{s.destination?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Type</label>
            <div className="flex gap-2">
              {TRANSPORT_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTransportType(t.value)}
                  className={`px-3 py-2 rounded-full text-body-sm font-semibold transition-all flex items-center gap-1 ${
                    transportType === t.value
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSearch} disabled={searching} className="btn btn-primary">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {searching ? (
        <LoadingSkeleton type="list" count={5} />
      ) : results.length === 0 ? (
        <EmptyState
          icon="flight"
          title="No results yet"
          message="Search for transport options between your cities."
        />
      ) : (
        <div className="space-y-3">
          {results.map((item, i) => (
            <div key={item.id || i} className="card p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-body-md font-semibold text-primary">{item.carrier || item.provider || 'Unknown'}</span>
                  {item.provider && item.carrier && (
                    <span className="badge badge-neutral text-[10px]">{item.provider}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-body-sm text-secondary">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {item.departureTime || item.departure_time
                      ? formatDate(item.departureTime || item.departure_time, 'HH:mm')
                      : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    {formatDuration(item.durationMinutes || item.duration_minutes)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {item.arrivalTime || item.arrival_time
                      ? formatDate(item.arrivalTime || item.arrival_time, 'HH:mm')
                      : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <PriceBadge
                  price={item.price}
                  priceType={item.priceType || item.price_type}
                  currency={item.priceCurrency || trip.currency}
                />
                <button onClick={() => handleAddTransport(item)} className="btn btn-primary btn-sm">
                  Select
                </button>
                {(item.bookingUrl || item.booking_url) && (
                  <a href={item.bookingUrl || item.booking_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-label-caps text-outline text-center">Prices are dynamic and may change.</p>
    </div>
  );
}
