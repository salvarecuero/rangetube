/** Position of `current` within [min,max] as a clamped 0-100 percentage. */
export function playheadPercent(current: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 0;
  const pct = ((current - min) / span) * 100;
  return Math.min(100, Math.max(0, pct));
}
