import { useEffect, useState } from 'react';
import { useParams, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import tripApi from '../../services/tripApi';
import useTripStore from '../../stores/useTripStore';
import LoadingSkeleton from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { TRIP_TABS } from '../../utils/constants';
import TripOverview from './TripOverview';
import CityExplorer from './CityExplorer';
import HotelSearch from './HotelSearch';
import TransportSearch from './TransportSearch';
import ItineraryBuilder from './ItineraryBuilder';
import ExpenseList from './ExpenseList';
import BudgetOverview from './BudgetOverview';
import CalendarView from './CalendarView';
import ShareSettings from './ShareSettings';

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrip, setCurrentTrip } = useTripStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await tripApi.getOne(tripId);
      setCurrentTrip(data.data);
    } catch {
      setError('Failed to load trip details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrip(); return () => setCurrentTrip(null); }, [tripId]);

  // Determine active tab from path
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[3] || 'overview';

  const handleTabChange = (tabKey) => {
    if (tabKey === 'overview') {
      navigate(`/trips/${tripId}`);
    } else {
      navigate(`/trips/${tripId}/${tabKey}`);
    }
  };

  if (loading) return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <LoadingSkeleton type="detail" />
    </div>
  );

  if (error) return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <ErrorState title="Trip Not Found" message={error} onRetry={fetchTrip} />
    </div>
  );

  if (!currentTrip) return null;

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-md)]">
      {/* Trip Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate('/trips')}
            className="text-body-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Trips
          </button>
          <h1 className="text-headline-lg text-primary">{currentTrip.name}</h1>
          {currentTrip.description && (
            <p className="text-body-md text-secondary mt-1">{currentTrip.description}</p>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav mb-[var(--spacing-stack-md)]">
        {TRIP_TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button
          className={`tab-btn ${activeTab === 'share' ? 'active' : ''}`}
          onClick={() => handleTabChange('share')}
        >
          Share
        </button>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route index element={<TripOverview trip={currentTrip} onRefresh={fetchTrip} />} />
        <Route path="explore" element={<CityExplorer trip={currentTrip} />} />
        <Route path="hotels" element={<HotelSearch trip={currentTrip} />} />
        <Route path="transport" element={<TransportSearch trip={currentTrip} />} />
        <Route path="itinerary" element={<ItineraryBuilder trip={currentTrip} onRefresh={fetchTrip} />} />
        <Route path="expenses" element={<ExpenseList trip={currentTrip} />} />
        <Route path="budget" element={<BudgetOverview trip={currentTrip} />} />
        <Route path="calendar" element={<CalendarView trip={currentTrip} />} />
        <Route path="share" element={<ShareSettings trip={currentTrip} onRefresh={fetchTrip} />} />
      </Routes>
    </div>
  );
}
