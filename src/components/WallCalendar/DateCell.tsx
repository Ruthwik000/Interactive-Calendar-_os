import { memo } from 'react';
import type { CalendarDay, DateRange } from './types';
import { sameDay, cellAriaLabel } from './helpers';
import styles from './WallCalendar.module.css';

interface DateCellProps {
  day: CalendarDay;
  range: DateRange;
  inRange: boolean;
  isPreview: boolean;
  hasNote: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/** Builds the composite class name for a date cell based on its state. */
function buildCellClass(
  day: CalendarDay,
  range: DateRange,
  inRange: boolean,
  isPreview: boolean,
): string {
  const c = [styles.cell];
  if (!day.isCurrentMonth) { c.push(styles.otherMonth); return c.join(' '); }
  if (day.isWeekend) c.push(styles.weekend);
  if (day.isToday) c.push(styles.today);
  if (day.holiday) c.push(styles.holidayCell);
  if (sameDay(range.start, day.date)) c.push(styles.rangeStart);
  if (sameDay(range.end, day.date)) c.push(styles.rangeEnd);
  if (inRange) c.push(styles.inRange);
  if (isPreview) c.push(styles.previewEdge);
  return c.join(' ');
}

/**
 * Memoised individual date cell.
 * Only re-renders when its own props change, not when siblings update.
 */
export const DateCell = memo(function DateCell({
  day, range, inRange, isPreview, hasNote,
  onClick, onMouseEnter, onMouseLeave,
}: DateCellProps) {
  return (
    <button
      className={buildCellClass(day, range, inRange, isPreview)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={day.holiday || undefined}
      aria-label={cellAriaLabel(day.date, day.holiday)}
      tabIndex={day.isCurrentMonth ? 0 : -1}
    >
      <span className={styles.cellNum}>{day.day}</span>
      {day.isToday && <span className={styles.todayDot} />}
      {day.holiday && day.isCurrentMonth && <span className={styles.holidayDot} />}
      {hasNote && day.isCurrentMonth && <span className={styles.noteDot} />}
    </button>
  );
});
