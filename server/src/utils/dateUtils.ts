/**
 * Date and Showtime Utilities for CineBook
 * Consistent timezone-aware representation of showtime instants in Asia/Kolkata (IST = UTC+05:30).
 */

export interface ShowtimeInstant {
  isoString: string;
  timestamp: number; // UTC Epoch Milliseconds
  isPast: boolean;
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

/**
 * Parses date string (e.g. "2026-10-16", "October 16, 2026", "Tomorrow, Oct 16", "Oct 16, 2026", "16-10-2026")
 * and time string (e.g. "01:45 PM", "1:45 PM", "13:45", "10:30 AM")
 * into a definitive Asia/Kolkata (IST) instant and evaluates whether it has passed.
 */
export function parseShowtimeToISTInstant(dateStr?: string, timeStr?: string): ShowtimeInstant | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const d = dateStr.trim();
  if (!d) return null;

  let year: number;
  let month: number; // 1-12
  let day: number;

  const isoMatch = d.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else {
    // Check DD-MM-YYYY format
    const dmyMatch = d.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      day = parseInt(dmyMatch[1], 10);
      month = parseInt(dmyMatch[2], 10);
      year = parseInt(dmyMatch[3], 10);
    } else {
      // Strip leading relative/day labels: "Today, ", "Tomorrow, ", "Fri, ", etc.
      const cleanDate = d.replace(/^(today|tomorrow|yesterday|mon|tue|wed|thu|fri|sat|sun)[a-z]*,\s*/i, '').trim();
      let parsed = new Date(cleanDate);
      if (isNaN(parsed.getTime())) {
        // If year was omitted (e.g. "Oct 16"), append current year in IST
        const currentYear = new Date().getFullYear();
        parsed = new Date(`${cleanDate} ${currentYear}`);
      }

      if (!isNaN(parsed.getTime())) {
        year = parsed.getFullYear();
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
      } else {
        return null;
      }
    }
  }

  let hours = 23;
  let minutes = 59;
  if (timeStr && typeof timeStr === 'string') {
    const t = timeStr.trim();
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  // Asia/Kolkata is strictly UTC+05:30 with no daylight saving time
  const isoString = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`;
  const timestamp = Date.parse(isoString);

  if (isNaN(timestamp)) return null;

  return {
    isoString,
    timestamp,
    isPast: timestamp < Date.now(),
    year,
    month,
    day,
    hours,
    minutes
  };
}

/**
 * Returns true if the showtime has already passed relative to current instant in Asia/Kolkata (IST).
 */
export function isPastShowtime(dateStr?: string, timeStr?: string): boolean {
  const instant = parseShowtimeToISTInstant(dateStr, timeStr);
  if (!instant) return false;
  return instant.isPast;
}

/**
 * Formats a Date object to YYYY-MM-DD in local/IST calendar date (avoiding UTC offset rollback).
 */
export function formatToISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
