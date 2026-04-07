import { MONTHS, HERO_IMAGES } from './constants';
import styles from './WallCalendar.module.css';

interface CalendarHeroProps {
  month: number;
  year: number;
}

/** Hero image panel with diagonal accent overlays and month title. */
export function CalendarHero({ month, year }: CalendarHeroProps) {
  return (
    <div className={styles.hero}>
      <img
        src={HERO_IMAGES[month]}
        alt={`${MONTHS[month]} ${year}`}
        className={styles.heroImg}
        draggable={false}
      />
      <div className={styles.heroGradient} />
      <div className={styles.accentTriangle} />
      <div className={styles.whiteTriangle} />
      <div className={styles.heroText}>
        <span className={styles.heroYear}>{year}</span>
        <h1 className={styles.heroMonth}>{MONTHS[month].toUpperCase()}</h1>
      </div>
    </div>
  );
}
