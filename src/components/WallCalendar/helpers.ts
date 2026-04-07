import type { CalendarDay } from './types';
import { HOLIDAYS } from './constants';

/* ─── Calendar computation ─── */

/** Returns number of days in a given month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Generates all 42 cells (6 weeks) for a calendar month grid.
 * Accepts a stabilised `today` to avoid SSR/client hydration divergence.
 */
export function getCalendarDays(
  year: number,
  month: number,
  today: Date,
): CalendarDay[] {
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday-based grid
  const totalDays = daysInMonth(year, month);
  const prevMonthDays = daysInMonth(year, month - 1);
  const cells: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    let day: number, date: Date, isCurrentMonth: boolean;

    if (i < startOffset) {
      day = prevMonthDays - startOffset + i + 1;
      date = new Date(year, month - 1, day);
      isCurrentMonth = false;
    } else if (i < startOffset + totalDays) {
      day = i - startOffset + 1;
      date = new Date(year, month, day);
      isCurrentMonth = true;
    } else {
      day = i - startOffset - totalDays + 1;
      date = new Date(year, month + 1, day);
      isCurrentMonth = false;
    }

    const dow = date.getDay();
    const holidayKey = `${date.getMonth()}-${date.getDate()}`;

    cells.push({
      date,
      day,
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isWeekend: dow === 0 || dow === 6,
      holiday: HOLIDAYS[holidayKey],
    });
  }

  return cells;
}

/* ─── Date formatting (locale-pinned to prevent hydration mismatches) ─── */

/** Format a date as "Apr 7". */
export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Deterministic aria-label for a calendar cell. */
export function cellAriaLabel(date: Date, holiday?: string): string {
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  return holiday ? `${label} — ${holiday}` : label;
}

/* ─── Date math ─── */

/** Number of days between two dates, inclusive. */
export function diffDays(a: Date, b: Date): number {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000) + 1;
}

/** Check if two dates are the same calendar day. */
export function sameDay(a: Date | null, b: Date): boolean {
  return a ? a.toDateString() === b.toDateString() : false;
}

/** Generate a stable key for a date range (for localStorage). Uses local dates to avoid UTC shift. */
export function rangeKey(start: Date, end: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `${fmt(start)}_${fmt(end)}`;
}

/** Parse a range key back into local Date objects. */
export function parseRangeKey(key: string): { start: Date; end: Date } | null {
  const [s, e] = key.split('_');
  if (!s || !e) return null;
  const [sy, sm, sd] = s.split('-').map(Number);
  const [ey, em, ed] = e.split('-').map(Number);
  return { start: new Date(sy, sm - 1, sd), end: new Date(ey, em - 1, ed) };
}

/** Convert hex colour to RGB components. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
