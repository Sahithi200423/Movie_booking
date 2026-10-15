/**
 * Date and Showtime Utilities for CineBook
 * Authoritative timezone and showtime timestamp validation
 */

export function isPastShowtime(dateStr?: string, timeStr?: string): boolean {
  if (!dateStr) return false;
  const d = dateStr.trim();
  const now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();

  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const parts = d.split('-').map(Number);
    year = parts[0];
    month = parts[1] - 1;
    day = parts[2];
  } else if (/today/i.test(d)) {
    year = now.getFullYear();
    month = now.getMonth();
    day = now.getDate();
  } else if (/tomorrow/i.test(d)) {
    const tom = new Date(now.getTime() + 86400000);
    year = tom.getFullYear();
    month = tom.getMonth();
    day = tom.getDate();
  } else {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    } else {
      return false;
    }
  }

  let hours = 23;
  let minutes = 59;
  if (timeStr) {
    const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
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

  const showtimeDate = new Date(year, month, day, hours, minutes, 0);
  return showtimeDate.getTime() < now.getTime();
}
