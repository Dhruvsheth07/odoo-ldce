import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

export default function TripCard({ trip }) {
  const stopCount = trip.stops?.length || 0;
  const startDate = trip.startDate ? formatDate(trip.startDate, 'MMM dd') : '';
  const endDate = trip.endDate ? formatDate(trip.endDate, 'MMM dd') : '';

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="card flex flex-col group cursor-pointer hover:shadow-[0_8px_30px_0_rgba(26,43,60,0.08)] transition-all duration-300"
    >
      {/* Image */}
      <div className="h-48 w-full relative overflow-hidden">
        {trip.coverImageUrl ? (
          <div
            className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${trip.coverImageUrl}')` }}
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
            <span className="material-symbols-outlined text-[48px] text-secondary">flight_takeoff</span>
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span className="badge badge-neutral shadow-sm">
            {new Date(trip.startDate) > new Date() ? 'Upcoming' : 'Planning'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-headline-md text-primary mb-1 leading-tight" style={{ fontSize: '20px' }}>
          {trip.name}
        </h3>
        <p className="text-body-sm text-secondary mb-4 flex items-center gap-1 flex-wrap">
          {startDate && endDate && (
            <>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {startDate} - {endDate}
            </>
          )}
          {stopCount > 0 && (
            <>
              <span className="mx-2 text-outline-variant">•</span>
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {stopCount} {stopCount === 1 ? 'City' : 'Cities'}
            </>
          )}
        </p>

        {/* Stop icons */}
        {trip.stops?.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            {trip.stops.slice(0, 4).map((stop, i) => (
              <div key={stop.id || i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[16px]">
                    {i === 0 ? 'flight_land' : i === trip.stops.length - 1 ? 'flight_takeoff' : 'hotel'}
                  </span>
                </div>
                {i < Math.min(trip.stops.length, 4) - 1 && (
                  <div className="flex-grow h-px bg-outline-variant min-w-4" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center border-t border-surface-variant pt-4">
          <span className="text-label-caps text-primary hover:text-secondary transition-colors">
            View Itinerary
          </span>
          <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-secondary">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
