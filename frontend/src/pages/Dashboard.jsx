import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import tripApi from '../services/tripApi';
import { savedApi } from '../services/expenseApi';
import LoadingSkeleton from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import TripCard from '../components/trips/TripCard';
import { formatDate } from '../utils/dateUtils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [upRes, recRes, savedRes] = await Promise.allSettled([
        tripApi.getUpcoming(),
        tripApi.getRecent(),
        savedApi.getAll(),
      ]);
      if (upRes.status === 'fulfilled') setUpcomingTrips(upRes.value.data?.data || []);
      if (recRes.status === 'fulfilled') setRecentTrips(recRes.value.data?.data || []);
      if (savedRes.status === 'fulfilled') setSavedDestinations(savedRes.value.data?.data || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <LoadingSkeleton type="card" count={4} />
    </div>
  );

  if (error) return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <ErrorState title="Dashboard Error" message={error} onRetry={fetchData} />
    </div>
  );

  const hasTrips = upcomingTrips.length > 0 || recentTrips.length > 0;

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)] flex flex-col gap-[var(--spacing-stack-lg)]">
      {/* Welcome Hero */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-[var(--spacing-stack-sm)]">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-body-lg text-secondary">Ready for your next adventure?</p>
        </div>
        <button
          onClick={() => navigate('/trips/create')}
          className="btn btn-secondary"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Plan New Trip
        </button>
      </section>

      {!hasTrips ? (
        /* Empty Dashboard */
        <EmptyState
          icon="flight_takeoff"
          title="No trips yet"
          message="Start planning your first adventure. Create a trip to add destinations, activities, and build your itinerary."
          actionLabel="Create Your First Trip"
          onAction={() => navigate('/trips/create')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)]">
          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-[var(--spacing-stack-lg)]">
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-[var(--spacing-stack-sm)]">
                  <h2 className="text-headline-md text-primary">Upcoming Trips</h2>
                  <Link
                    to="/trips"
                    className="text-body-sm text-secondary hover:text-primary transition-colors inline-flex items-center"
                  >
                    View all <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
                  {upcomingTrips.slice(0, 4).map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Trips */}
            {recentTrips.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-[var(--spacing-stack-sm)]">
                  <h2 className="text-headline-md text-primary">Recent Trips</h2>
                  <Link
                    to="/trips"
                    className="text-body-sm text-secondary hover:text-primary transition-colors inline-flex items-center"
                  >
                    View all <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
                  {recentTrips.slice(0, 4).map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar — Saved Destinations */}
          <aside className="lg:col-span-3 flex flex-col gap-[var(--spacing-stack-md)]">
            <section>
              <h2 className="text-headline-md text-primary mb-[var(--spacing-stack-sm)]">Saved Destinations</h2>
              {savedDestinations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {savedDestinations.slice(0, 6).map(saved => (
                    <div key={saved.id} className="card p-4 flex items-center gap-3 hover:cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary">location_on</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-primary truncate">{saved.destination?.name}</p>
                        <p className="text-label-caps text-secondary">{saved.destination?.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <span className="material-symbols-outlined text-[32px] text-secondary mb-2">bookmark_border</span>
                  <p className="text-body-sm text-secondary">No saved destinations yet</p>
                </div>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
