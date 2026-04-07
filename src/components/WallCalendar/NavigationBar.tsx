import { useEffect, useRef } from 'react';
import { MONTHS } from './constants';
import { ChevronLeft, ChevronRight } from './Icons';
import type { NavDirection } from './types';
import styles from './WallCalendar.module.css';

interface NavigationBarProps {
  month: number;
  year: number;
  prevMonthIdx: number;
  nextMonthIdx: number;
  showMonthPicker: boolean;
  onNavigate: (dir: NavDirection) => void;
  onTogglePicker: () => void;
  onJumpToMonth: (m: number) => void;
  onYearChange: (fn: (y: number) => number) => void;
  onClosePicker: () => void;
}

/** Bottom navigation bar with prev/next buttons and a month/year quick-picker. */
export function NavigationBar({
  month, year, prevMonthIdx, nextMonthIdx,
  showMonthPicker, onNavigate, onTogglePicker,
  onJumpToMonth, onYearChange, onClosePicker,
}: NavigationBarProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  /* Close picker on outside click */
  useEffect(() => {
    if (!showMonthPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClosePicker();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMonthPicker, onClosePicker]);

  return (
    <nav className={styles.navBar} aria-label="Calendar navigation">
      <button
        className={styles.navBtn}
        onClick={() => onNavigate('prev')}
        aria-label={`Previous month: ${MONTHS[prevMonthIdx]}`}
      >
        <ChevronLeft />
        <span>{MONTHS[prevMonthIdx].slice(0, 3)}</span>
      </button>

      <div className={styles.navCenter} ref={pickerRef}>
        <button
          className={styles.navMonthBtn}
          onClick={onTogglePicker}
          aria-expanded={showMonthPicker}
          aria-label="Pick a month"
        >
          {MONTHS[month].slice(0, 3)} {year}
        </button>

        {showMonthPicker && (
          <div className={styles.monthPicker} role="dialog" aria-label="Month picker">
            <div className={styles.yearNav}>
              <button onClick={() => onYearChange(y => y - 1)} aria-label="Previous year">
                <ChevronLeft />
              </button>
              <span>{year}</span>
              <button onClick={() => onYearChange(y => y + 1)} aria-label="Next year">
                <ChevronRight />
              </button>
            </div>
            <div className={styles.monthGrid}>
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  className={`${styles.monthOption} ${i === month ? styles.monthActive : ''}`}
                  onClick={() => onJumpToMonth(i)}
                  aria-current={i === month ? 'true' : undefined}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className={styles.navBtn}
        onClick={() => onNavigate('next')}
        aria-label={`Next month: ${MONTHS[nextMonthIdx]}`}
      >
        <span>{MONTHS[nextMonthIdx].slice(0, 3)}</span>
        <ChevronRight />
      </button>
    </nav>
  );
}
