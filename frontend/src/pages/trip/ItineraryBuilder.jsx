import { useState, useEffect } from 'react';
import tripApi from '../../services/tripApi';
import { discoveryApi } from '../../services/discoveryApi';
import LoadingSkeleton from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import PriceBadge from '../../components/common/PriceBadge';
import { formatDate, getDayCount } from '../../utils/dateUtils';
import { formatPrice, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ItineraryBuilder({ trip, onRefresh }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [trip.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await tripApi.getStops(trip.id);
      setStops(data?.data || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleSchedule = async (activityId, date, startTime, endTime) => {
    try {
      await discoveryApi.updateActivitySchedule(activityId, {
        scheduledDate: date,
        startTime,
        endTime,
      });
      toast.success('Activity scheduled!');
      fetchData();
    } catch {
      toast.error('Failed to schedule activity.');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await discoveryApi.deleteActivity(activityId);
      toast.success('Activity removed.');
      fetchData();
    } catch {
      toast.error('Failed to remove activity.');
    }
  };

  if (loading) return <LoadingSkeleton type="detail" />;

  if (stops.length === 0) {
    return <EmptyState icon="event_note" title="No itinerary yet" message="Add destinations and activities first." />;
  }

  // Build day-wise itinerary
  const buildDays = () => {
    const days = [];
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const totalDays = getDayCount(tripStart, tripEnd) + 1;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(tripStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Find which stop covers this date
      const activeStop = stops.find(s => {
        const arrival = new Date(s.arrivalDate);
        const departure = new Date(s.departureDate);
        return date >= arrival && date <= departure;
      });

      const activities = (activeStop?.activities || []).filter(a =>
        a.scheduledDate && new Date(a.scheduledDate).toISOString().split('T')[0] === dateStr
      );

      const unscheduled = (activeStop?.activities || []).filter(a => !a.scheduledDate);

      days.push({
        dayNumber: i + 1,
        date: dateStr,
        stop: activeStop,
        activities,
        unscheduledActivities: i === 0 ? unscheduled : [], // Show unscheduled only on first day
        accommodations: activeStop?.accommodations || [],
      });
    }
    return days;
  };

  const days = buildDays();

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      <div className="flex justify-between items-center">
        <h2 className="text-headline-md text-primary">Itinerary Timeline</h2>
        <span className="text-body-sm text-secondary">
          {days.length} {days.length === 1 ? 'Day' : 'Days'}
        </span>
      </div>

      <div className="space-y-0">
        {days.map((day) => (
          <div key={day.dayNumber} className="timeline-item">
            <div className="timeline-line relative flex gap-6 pb-8">
              {/* Node */}
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-body-sm shrink-0 relative z-10">
                {day.dayNumber}
              </div>
              {/* Content */}
              <div className="flex-grow pt-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-body-md font-semibold text-primary">
                    Day {day.dayNumber} — {formatDate(day.date, 'EEEE, MMM dd')}
                  </h3>
                  {day.stop && (
                    <span className="badge badge-neutral">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {day.stop.destination?.name}
                    </span>
                  )}
                </div>

                {day.activities.length === 0 && day.accommodations.length === 0 ? (
                  <div className="card p-4 text-body-sm text-secondary border-dashed">
                    No activities scheduled. Explore and add activities from the Explore tab.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Activities */}
                    {day.activities.map(activity => (
                      <div key={activity.id} className="card p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-secondary">local_activity</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-body-sm font-semibold text-primary truncate">{activity.name}</p>
                          <p className="text-label-caps text-secondary">
                            {activity.startTime || 'Anytime'}
                            {activity.endTime && ` – ${activity.endTime}`}
                          </p>
                        </div>
                        <PriceBadge price={activity.price} priceType={activity.priceType} currency={activity.priceCurrency || trip.currency} />
                        <button onClick={() => handleDeleteActivity(activity.id)} className="btn-icon text-error">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ))}
                    {/* Accommodations */}
                    {day.accommodations.map(acc => (
                      <div key={acc.id} className="card p-4 flex items-center gap-4 border-l-4 border-l-secondary-container">
                        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-container">hotel</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-body-sm font-semibold text-primary truncate">{acc.name}</p>
                          <p className="text-label-caps text-secondary">Accommodation</p>
                        </div>
                        <PriceBadge price={acc.totalPrice} priceType={acc.priceType} currency={acc.priceCurrency || trip.currency} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Unscheduled activities for first day */}
                {day.unscheduledActivities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-label-caps text-on-surface-variant mb-2">Unscheduled Activities</p>
                    <div className="space-y-2">
                      {day.unscheduledActivities.map(a => (
                        <div key={a.id} className="card p-3 flex items-center gap-3 bg-surface-container border-dashed">
                          <span className="material-symbols-outlined text-[18px] text-secondary">event_upcoming</span>
                          <span className="text-body-sm text-primary flex-grow">{a.name}</span>
                          <button
                            onClick={() => handleSchedule(a.id, day.date, '09:00', '10:00')}
                            className="btn btn-ghost btn-sm"
                          >
                            Schedule
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
