import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { DateRange, CalendarDay, NavDirection } from './types';
import { MONTH_ACCENTS } from './constants';
import { getCalendarDays, sameDay, hexToRgb, rangeKey, parseRangeKey } from './helpers';

const STORAGE = {
  notes: 'clader-notes',
  rangeNotes: 'clader-range-notes',
  dark: 'clader-dark',
} as const;

/**
 * Custom hook encapsulating all WallCalendar state & business logic.
 * Keeps the component tree focused on rendering.
 */
export function useCalendarState() {
  /* ── Core date state (initialised once to avoid hydration drift) ── */
  const [today] = useState(() => new Date());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  /* ── Selection state ── */
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  /* ── Notes state ── */
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [currentRangeNote, setCurrentRangeNote] = useState('');

  /* ── UI state ── */
  const [dark, setDark] = useState(false);
  const [animClass, setAnimClass] = useState('');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showMobileNotes, setShowMobileNotes] = useState(false);
  const animLock = useRef(false);

  /* ── Hydration-safe localStorage init ── */
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE.notes);
      if (s) setNotes(JSON.parse(s));
      const rn = localStorage.getItem(STORAGE.rangeNotes);
      if (rn) setRangeNotes(JSON.parse(rn));
      if (localStorage.getItem(STORAGE.dark) === 'true') setDark(true);
    } catch { /* corrupt storage — ignore */ }
  }, []);

  /* ── Persist ── */
  useEffect(() => { localStorage.setItem(STORAGE.notes, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem(STORAGE.rangeNotes, JSON.stringify(rangeNotes)); }, [rangeNotes]);

  /* ── Theme ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(STORAGE.dark, String(dark));
  }, [dark]);

  /* ── Seasonal accent colours (creative feature) ── */
  useEffect(() => {
    const hex = MONTH_ACCENTS[month] ?? '#E8652E';
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const r = document.documentElement;
    r.style.setProperty('--primary', hex);
    r.style.setProperty('--primary-light', `rgba(${rgb.r},${rgb.g},${rgb.b},0.10)`);
    r.style.setProperty('--primary-medium', `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`);
  }, [month]);

  /* ── Navigation with 3-D page-flip animation ── */
  const navigate = useCallback((dir: NavDirection) => {
    if (animLock.current) return;
    animLock.current = true;
    setAnimClass(dir === 'next' ? 'flipOut' : 'flipOutReverse');

    setTimeout(() => {
      if (dir === 'next') {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
      } else {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
      }
      setAnimClass(dir === 'next' ? 'flipIn' : 'flipInReverse');
      setTimeout(() => { setAnimClass(''); animLock.current = false; }, 400);
    }, 350);
  }, [month]);

  const goToday = useCallback(() => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, [today]);

  const jumpToMonth = useCallback((m: number) => {
    setMonth(m);
    setShowMonthPicker(false);
  }, []);

  /* ── Date selection ── */
  const handleDateClick = useCallback((day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      setMonth(day.date.getMonth());
      setYear(day.date.getFullYear());
      return;
    }
    if (!range.start || (range.start && range.end)) {
      setRange({ start: day.date, end: null });
      setCurrentRangeNote('');
    } else {
      if (sameDay(range.start, day.date)) {
        setRange({ start: null, end: null });
        return;
      }
      const end = day.date;
      const newRange = end < range.start
        ? { start: end, end: range.start }
        : { start: range.start, end };
      setRange(newRange);
      const key = rangeKey(newRange.start!, newRange.end!);
      setCurrentRangeNote(rangeNotes[key] || '');
    }
  }, [range, rangeNotes]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setCurrentRangeNote('');
  }, []);

  const saveRangeNote = useCallback((text: string) => {
    setCurrentRangeNote(text);
    if (range.start && range.end) {
      const key = rangeKey(range.start, range.end);
      setRangeNotes(prev => ({ ...prev, [key]: text }));
    }
  }, [range]);

  /* ── Range helpers ── */
  const isInRange = useCallback((d: Date): boolean => {
    if (!range.start || !range.end) {
      if (range.start && hoverDate && !sameDay(range.start, d)) {
        const s = range.start, e = hoverDate;
        const lo = s < e ? s : e, hi = s < e ? e : s;
        return d > lo && d < hi;
      }
      return false;
    }
    return d > range.start && d < range.end;
  }, [range, hoverDate]);

  const isPreviewEdge = useCallback((d: Date): boolean => {
    return !!(range.start && !range.end && hoverDate && sameDay(hoverDate, d));
  }, [range, hoverDate]);

  /* ── Computed ── */
  const days = useMemo(() => getCalendarDays(year, month, today), [year, month, today]);
  const noteKey = `${year}-${month}`;
  const prevMonthIdx = month === 0 ? 11 : month - 1;
  const nextMonthIdx = month === 11 ? 0 : month + 1;

  /** All saved range notes that overlap with the current month view. */
  const savedEvents = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const events: Array<{ start: Date; end: Date; note: string; key: string }> = [];

    for (const [key, note] of Object.entries(rangeNotes)) {
      if (!note.trim()) continue;
      const parsed = parseRangeKey(key);
      if (!parsed) continue;
      const { start, end } = parsed;
      if (start <= monthEnd && end >= monthStart) {
        events.push({ start, end, note, key });
      }
    }

    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [rangeNotes, year, month]);

  /** Check if a specific date falls within any saved range that has a note. */
  const dateHasNote = useCallback((d: Date): boolean => {
    for (const [key, note] of Object.entries(rangeNotes)) {
      if (!note.trim()) continue;
      const parsed = parseRangeKey(key);
      if (!parsed) continue;
      if (d >= parsed.start && d <= parsed.end) return true;
    }
    return false;
  }, [rangeNotes]);

  /** Delete a saved range note by key. */
  const deleteRangeNote = useCallback((key: string) => {
    setRangeNotes(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return {
    today, month, year, range, hoverDate, notes, currentRangeNote,
    dark, animClass, showMonthPicker, showMobileNotes,
    days, noteKey, prevMonthIdx, nextMonthIdx, savedEvents,
    navigate, goToday, jumpToMonth, handleDateClick, clearRange,
    saveRangeNote, deleteRangeNote, setNotes, setDark, setHoverDate,
    setShowMonthPicker, setYear, setShowMobileNotes,
    isInRange, isPreviewEdge, dateHasNote,
  };
}
