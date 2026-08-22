import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shareApi } from '../services/expenseApi';
import LoadingSkeleton from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import PriceBadge from '../components/common/PriceBadge';
import { formatDate, getDayCount } from '../utils/dateUtils';
import { formatPrice, formatDuration } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function PublicTrip() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrip = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await shareApi.getShared(shareToken);
      setTrip(data?.data);
    } catch {
      setError('This trip is not available or the link has expired.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchTrip(); }, [shareToken]);

  const handleCopy = async () => {
    try {
      await shareApi.copy(shareToken);
      toast.success('Trip copied to your account!');
      navigate('/trips');
    } catch {
      toast.error('Log in to copy this trip.');
      navigate('/login');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <LoadingSkeleton type="detail" />
    </div>
  );

  if (error || !trip) return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <ErrorState title="Trip Not Found" message={error} />
    </div>
  );

  const stops = trip.stops || [];
  const totalDays = getDayCount(new Date(trip.startDate), new Date(trip.endDate)) + 1;

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <header className="w-full bg-surface-container-low shadow-sm">
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] h-[72px] flex items-center justify-between">
          <span className="text-headline-md text-primary font-bold" style={{ fontFamily: 'var(--font-heading)' }}>GlobeTrotter</span>
          <button onClick={handleCopy} className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            Copy Trip
          </button>
        </div>
      </header>

      <main className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
        {/* Hero */}
        <section className="mb-[var(--spacing-stack-lg)]">
          <h1 className="text-display-lg text-primary mb-3" style={{ fontSize: '36px', lineHeight: '44px' }}>{trip.name}</h1>
          {trip.description && <p className="text-body-lg text-secondary mb-4">{trip.description}</p>}
          <div className="flex items-center gap-6 text-body-sm text-secondary">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {formatDate(trip.startDate, 'MMM dd')} – {formatDate(trip.endDate, 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {stops.length} Cities
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {totalDays} Days
            </span>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-headline-md text-primary mb-6">Itinerary</h2>
          <div className="space-y-0">
            {stops.map((stop, i) => (
              <div key={stop.id} className="timeline-item">
                <div className="timeline-line relative flex gap-6 pb-8">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-body-sm shrink-0 relative z-10">
                    {i + 1}
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="text-headline-md text-primary mb-1">{stop.destination?.name}</h3>
                    <p className="text-body-sm text-secondary mb-4">
                      {formatDate(stop.arrivalDate, 'MMM dd')} – {formatDate(stop.departureDate, 'MMM dd')}
                    </p>
                    {(stop.activities?.length > 0 || stop.accommodations?.length > 0) && (
                      <div className="space-y-2">
                        {stop.activities?.map(a => (
                          <div key={a.id} className="card p-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">local_activity</span>
                            <span className="text-body-sm text-primary flex-grow">{a.name}</span>
                            <PriceBadge price={a.price} priceType={a.priceType} currency={a.priceCurrency} />
                          </div>
                        ))}
                        {stop.accommodations?.map(a => (
                          <div key={a.id} className="card p-4 flex items-center gap-3 border-l-4 border-l-secondary-container">
                            <span className="material-symbols-outlined text-secondary">hotel</span>
                            <span className="text-body-sm text-primary flex-grow">{a.name}</span>
                            <PriceBadge price={a.totalPrice} priceType={a.priceType} currency={a.priceCurrency} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
