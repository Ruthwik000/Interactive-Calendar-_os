import { useState, useCallback } from 'react';
import type { DateRange } from './types';
import { fmtDate, diffDays } from './helpers';
import styles from './WallCalendar.module.css';

interface SavedEvent {
  start: Date;
  end: Date;
  note: string;
  key: string;
}

interface NotesPanelProps {
  noteKey: string;
  notes: Record<string, string>;
  onNotesChange: (notes: Record<string, string>) => void;
  range: DateRange;
  currentRangeNote: string;
  onRangeNoteChange: (text: string) => void;
  onClearRange: () => void;
  savedEvents: SavedEvent[];
  onDeleteEvent: (key: string) => void;
}

/** Side panel containing monthly notes, active range card, and saved events list. */
export function NotesPanel({
  noteKey, notes, onNotesChange,
  range, currentRangeNote, onRangeNoteChange, onClearRange,
  savedEvents, onDeleteEvent,
}: NotesPanelProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    onRangeNoteChange(currentRangeNote);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [currentRangeNote, onRangeNoteChange]);

  return (
    <div className={styles.notesCol}>
      <span className={styles.notesLabel}>Notes</span>

      <div className={styles.notesArea}>
        <textarea
          id="month-notes"
          className={styles.notesInput}
          value={notes[noteKey] || ''}
          onChange={(e) => onNotesChange({ ...notes, [noteKey]: e.target.value })}
          placeholder="Write notes for this month…"
          rows={6}
          aria-label="Monthly notes"
        />
      </div>

      {/* Active range selection card */}
      {range.start && (
        <div className={styles.rangeCard}>
          <div className={styles.rangeHeader}>
            <span className={styles.rangeDot} />
            <span className={styles.rangeTitle}>
              {range.end
                ? `${fmtDate(range.start)} — ${fmtDate(range.end)}`
                : `${fmtDate(range.start)} (select end date)`}
            </span>
            <button
              className={styles.rangeClear}
              onClick={onClearRange}
              title="Clear selection"
              aria-label="Clear date selection"
            >
              ×
            </button>
          </div>

          {range.end && (
            <>
              <span className={styles.rangeDays}>
                {diffDays(range.start, range.end)} day{diffDays(range.start, range.end) !== 1 ? 's' : ''}
              </span>
              <textarea
                id="range-note"
                className={styles.rangeNoteInput}
                value={currentRangeNote}
                onChange={(e) => onRangeNoteChange(e.target.value)}
                placeholder="Add a note for this range…"
                rows={2}
                aria-label="Range note"
              />
              <button
                className={`${styles.rangeSaveBtn} ${saved ? styles.rangeSaved : ''}`}
                onClick={handleSave}
                aria-label="Save range note"
              >
                {saved ? '✓ Saved' : 'Save Note'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Saved events for this month */}
      {savedEvents.length > 0 && (
        <div className={styles.savedEvents}>
          <span className={styles.savedEventsLabel}>
            Events · {savedEvents.length}
          </span>
          <div className={styles.savedEventsList}>
            {savedEvents.map((evt) => (
              <div key={evt.key} className={styles.savedEventRow}>
                <div className={styles.savedEventLine} />
                <div className={styles.savedEventContent}>
                  <span className={styles.savedEventDates}>
                    {fmtDate(evt.start)} — {fmtDate(evt.end)}
                  </span>
                  <span className={styles.savedEventNote}>{evt.note}</span>
                </div>
                <button
                  className={styles.savedEventDelete}
                  onClick={() => onDeleteEvent(evt.key)}
                  title="Remove"
                  aria-label="Delete saved event"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
