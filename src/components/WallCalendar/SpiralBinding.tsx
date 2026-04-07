import styles from './WallCalendar.module.css';

/** Decorative spiral binding along the top of the calendar. */
export function SpiralBinding() {
  return (
    <div className={styles.spiralRow} aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className={styles.spiral}>
          <div className={styles.spiralInner} />
        </div>
      ))}
    </div>
  );
}
