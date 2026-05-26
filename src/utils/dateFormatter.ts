import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(date: string | Date, format: string = 'MMM D, YYYY'): string {
  return dayjs(date).format(format);
}

/**
 * Format a date string to a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Format a date to date + time.
 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY h:mm A');
}
