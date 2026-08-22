import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tripApi from '../services/tripApi';
import LoadingSkeleton from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import TripCard from '../components/trips/TripCard';

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await tripApi.getAll(filter !== 'all' ? filter : undefined);
      setTrips(data?.data || []);
    } catch {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrips(); }, [filter]);

  const filters = [
    { key: 'all', label: 'All Trips' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)] flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-headline-lg text-primary">My Trips</h1>
          <p className="text-body-md text-secondary mt-1">Manage and explore your travel plans.</p>
        </div>
        <button onClick={() => navigate('/trips/create')} className="btn btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New Trip
        </button>
      </div>

      {/* Filters */}
      <div className="tab-nav w-fit">
        {filters.map(f => (
          <button
            key={f.key}
            className={`tab-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : error ? (
        <ErrorState title="Error Loading Trips" message={error} onRetry={fetchTrips} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon="luggage"
          title={filter !== 'all' ? 'No trips found' : 'No trips yet'}
          message={filter !== 'all'
            ? 'Try changing the filter or create a new trip.'
            : 'Start planning your first adventure by creating a trip.'}
          actionLabel="Create Trip"
          onAction={() => navigate('/trips/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
