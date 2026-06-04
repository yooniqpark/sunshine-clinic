/**
 * Format an event period from optional start/end dates.
 *  - both null    → "상시 진행"
 *  - only start   → "YYYY.MM.DD ~"
 *  - only end     → "~ YYYY.MM.DD"
 *  - both         → "YYYY.MM.DD ~ YYYY.MM.DD"
 */
export function formatPeriod(start?: Date | null, end?: Date | null): string {
  const s = start ? formatDate(start) : null;
  const e = end ? formatDate(end) : null;
  if (!s && !e) return "상시 진행";
  if (s && e) return `${s} ~ ${e}`;
  if (s) return `${s} ~`;
  return `~ ${e}`;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
