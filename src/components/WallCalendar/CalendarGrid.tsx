import type { CalendarDay, DateRange } from './types';
import { WEEK_DAYS } from './constants';
import { DateCell } from './DateCell';
import styles from './WallCalendar.module.css';

interface CalendarGridProps {
  days: CalendarDay[];
  range: DateRange;
  isInRange: (d: Date) => boolean;
  isPreviewEdge: (d: Date) => boolean;
  dateHasNote: (d: Date) => boolean;
  onDateClick: (day: CalendarDay) => void;
  onDateHover: (date: Date) => void;
  onDateLeave: () => void;
}

/** The 7-column date grid with weekday headers and interactive cells. */
export function CalendarGrid({
  days, range, isInRange, isPreviewEdge, dateHasNote,
  onDateClick, onDateHover, onDateLeave,
}: CalendarGridProps) {
  return (
    <div className={styles.gridCol} role="grid" aria-label="Calendar dates">
      <div className={styles.weekHeaders} role="row">
        {WEEK_DAYS.map((d, i) => (
          <span
            key={d}
            role="columnheader"
            className={`${styles.weekDay} ${i >= 5 ? styles.weekDayEnd : ''}`}
          >
            {d}
          </span>
        ))}
      </div>

      <div className={styles.dateGrid} role="rowgroup">
        {days.map((day, i) => (
          <DateCell
            key={i}
            day={day}
            range={range}
            inRange={isInRange(day.date)}
            isPreview={isPreviewEdge(day.date)}
            hasNote={dateHasNote(day.date)}
            onClick={() => onDateClick(day)}
            onMouseEnter={() => day.isCurrentMonth && onDateHover(day.date)}
            onMouseLeave={onDateLeave}
          />
        ))}
      </div>
    </div>
  );
}
