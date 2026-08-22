import { format, differenceInDays, addDays, parseISO, isValid } from 'date-fns';

export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : '';
}

export function formatDateShort(date) {
  return formatDate(date, 'MMM d');
}

export function formatDateRange(start, end) {
  const s = formatDate(start, 'MMM d');
  const e = formatDate(end, 'MMM d, yyyy');
  return `${s} – ${e}`;
}

export function getDayCount(start, end) {
  if (!start || !end) return 0;
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return Math.max(0, differenceInDays(e, s));
}

export function getDaysBetween(start, end) {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  const count = differenceInDays(e, s) + 1;
  return Array.from({ length: count }, (_, i) => addDays(s, i));
}

export function formatTime(time) {
  if (!time) return '';
  // Handle HH:mm format
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export function toDateInputValue(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'yyyy-MM-dd') : '';
}
