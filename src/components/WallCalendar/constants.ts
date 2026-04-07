export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export const HERO_IMAGES: Record<number, string> = {
  0: '/january.png',   1: '/february.png',  2: '/march.png',
  3: '/april.png',     4: '/may.png',       5: '/june.png',
  6: '/july.png',      7: '/august.png',    8: '/september.png',
  9: '/october.png',  10: '/november.png', 11: '/december.png',
};

/**
 * Seasonal accent colours per month.
 * Creates a dynamic "theme switching" effect — each month's accent
 * complements its hero image, fulfilling the creative-liberty requirement.
 */
export const MONTH_ACCENTS: Record<number, string> = {
  0:  '#5B7FA6', // January   — steel blue
  1:  '#C4727A', // February  — dusty rose
  2:  '#5B7B5E', // March     — sage green
  3:  '#C4553A', // April     — warm terracotta
  4:  '#7B6BA6', // May       — muted lavender
  5:  '#C49A3A', // June      — antique gold
  6:  '#B85450', // July      — barn red
  7:  '#4A8B8A', // August    — ocean sage
  8:  '#B8863A', // September — harvest amber
  9:  '#C4703A', // October   — copper
  10: '#8B6340', // November  — autumn umber
  11: '#8B3A3A', // December  — deep garnet
};

/**
 * Notable US holidays keyed by "monthIndex-dayOfMonth".
 * Used to show holiday markers on individual date cells.
 */
export const HOLIDAYS: Record<string, string> = {
  '0-1':   "New Year's Day",
  '1-14':  "Valentine's Day",
  '2-17':  "St. Patrick's Day",
  '3-1':   "April Fool's Day",
  '4-5':   "Cinco de Mayo",
  '5-19':  "Juneteenth",
  '6-4':   "Independence Day",
  '9-31':  "Halloween",
  '10-11': "Veterans Day",
  '11-25': "Christmas Day",
  '11-31': "New Year's Eve",
};
