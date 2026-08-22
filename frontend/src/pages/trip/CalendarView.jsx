import { useState, useEffect } from 'react';
import { calendarApi } from '../../services/expenseApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import LoadingSkeleton from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

export default function CalendarView({ trip }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalendar = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await calendarApi.get(trip.id);
      const calEvents = (data?.data || []).map(e => ({
        id: e.id,
        title: e.title || e.name,
        start: e.start || e.startDate || e.scheduledDate,
        end: e.end || e.endDate,
        backgroundColor: getEventColor(e.type || e.category),
        borderColor: 'transparent',
        extendedProps: { type: e.type, city: e.city, cost: e.cost },
      }));
      setEvents(calEvents);
    } catch { setError('Failed to load calendar.'); }
    setLoading(false);
  };

  useEffect(() => { fetchCalendar(); }, [trip.id]);

  const getEventColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'ACTIVITY': return '#6c5e06';
      case 'ACCOMMODATION': return '#50606f';
      case 'TRANSPORT': case 'FLIGHT': return '#1a2b3c';
      default: return '#4f6073';
    }
  };

  if (loading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorState message={error} onRetry={fetchCalendar} />;

  return (
    <div className="card p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={trip.startDate}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={events}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={3}
      />
    </div>
  );
}
