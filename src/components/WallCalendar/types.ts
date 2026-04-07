/** Represents a selected date range. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Represents a single day cell in the calendar grid. */
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
}

/** Navigation direction for month transitions. */
export type NavDirection = 'prev' | 'next';
