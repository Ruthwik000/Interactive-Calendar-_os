'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCalendarState } from './useCalendarState';
import { SpiralBinding } from './SpiralBinding';
import { CalendarHero } from './CalendarHero';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { NavigationBar } from './NavigationBar';
import { CalendarIcon, SunIcon, MoonIcon, NotesIcon, XIcon } from './Icons';
import styles from './WallCalendar.module.css';

/** Animation-class → CSS-module-class mapping. */
const FLIP_MAP: Record<string, string> = {
  flipOut: styles.flipOut,
  flipIn: styles.flipIn,
  flipOutReverse: styles.flipOutReverse,
  flipInReverse: styles.flipInReverse,
};

/**
 * WallCalendar — the main orchestrating component.
 *
 * Composes sub-components and binds together:
 * - Calendar state (via useCalendarState hook)
 * - Keyboard navigation (arrow keys)
 * - Touch/swipe gestures (mobile month navigation)
 * - Mobile bottom-sheet for notes
 */
export default function WallCalendar() {
  const cal = useCalendarState();
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') cal.navigate('prev');
      if (e.key === 'ArrowRight') cal.navigate('next');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cal.navigate]);

  /* ── Touch swipe for mobile ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = Math.abs(t.clientY - touchRef.current.y);
    touchRef.current = null;
    // Only trigger on horizontal swipes (dx > 60px, dy < 40px)
    if (Math.abs(dx) > 60 && dy < 40) {
      cal.navigate(dx < 0 ? 'next' : 'prev');
    }
  }, [cal.navigate]);

  const flipClass = FLIP_MAP[cal.animClass] || '';

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <CalendarIcon />
          <span className={styles.brandName}>Calendar</span>
        </div>
        <div className={styles.topActions}>
          <button className={styles.todayBtn} onClick={cal.goToday} title="Go to today">
            Today
          </button>
          <button
            className={styles.themeBtn}
            onClick={() => cal.setDark(!cal.dark)}
            title="Toggle theme"
            aria-label={cal.dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {cal.dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── Calendar ── */}
      <main className={styles.calendarOuter}>
        <div
          className={styles.calendar}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <SpiralBinding />

          <div className={`${styles.calendarInner} ${flipClass}`}>
            <CalendarHero month={cal.month} year={cal.year} />

            <div className={styles.body}>
              {/* Desktop notes (hidden on mobile via CSS) */}
              <div className={styles.desktopNotes}>
                <NotesPanel
                  noteKey={cal.noteKey}
                  notes={cal.notes}
                  onNotesChange={cal.setNotes}
                  range={cal.range}
                  currentRangeNote={cal.currentRangeNote}
                  onRangeNoteChange={cal.saveRangeNote}
                  onClearRange={cal.clearRange}
                  savedEvents={cal.savedEvents}
                  onDeleteEvent={cal.deleteRangeNote}
                />
              </div>

              <CalendarGrid
                days={cal.days}
                range={cal.range}
                isInRange={cal.isInRange}
                isPreviewEdge={cal.isPreviewEdge}
                dateHasNote={cal.dateHasNote}
                onDateClick={cal.handleDateClick}
                onDateHover={cal.setHoverDate}
                onDateLeave={() => cal.setHoverDate(null)}
              />
            </div>
          </div>

          <NavigationBar
            month={cal.month}
            year={cal.year}
            prevMonthIdx={cal.prevMonthIdx}
            nextMonthIdx={cal.nextMonthIdx}
            showMonthPicker={cal.showMonthPicker}
            onNavigate={cal.navigate}
            onTogglePicker={() => cal.setShowMonthPicker(!cal.showMonthPicker)}
            onJumpToMonth={cal.jumpToMonth}
            onYearChange={cal.setYear}
            onClosePicker={() => cal.setShowMonthPicker(false)}
          />
        </div>
      </main>

      {/* ── Mobile notes FAB + bottom sheet ── */}
      <button
        className={styles.notesFab}
        onClick={() => cal.setShowMobileNotes(true)}
        aria-label="Open notes"
      >
        <NotesIcon size={22} />
      </button>

      {cal.showMobileNotes && (
        <div
          className={styles.bottomSheetOverlay}
          onClick={() => cal.setShowMobileNotes(false)}
        >
          <div
            className={styles.bottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.bottomSheetHandle} />
            <div className={styles.bottomSheetHeader}>
              <span className={styles.bottomSheetTitle}>Notes</span>
              <button
                className={styles.bottomSheetClose}
                onClick={() => cal.setShowMobileNotes(false)}
                aria-label="Close notes"
              >
                <XIcon size={18} />
              </button>
            </div>
            <NotesPanel
              noteKey={cal.noteKey}
              notes={cal.notes}
              onNotesChange={cal.setNotes}
              range={cal.range}
              currentRangeNote={cal.currentRangeNote}
              onRangeNoteChange={cal.saveRangeNote}
              onClearRange={cal.clearRange}
              savedEvents={cal.savedEvents}
              onDeleteEvent={cal.deleteRangeNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}
