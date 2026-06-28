import { formatTime } from "./formatTime";

/** Position of `current` within [min,max] as a clamped 0-100 percentage. */
export function playheadPercent(current: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 0;
  const pct = ((current - min) / span) * 100;
  return Math.min(100, Math.max(0, pct));
}

/** How the current-time readout expresses the playhead. */
export type TimeMode = "video" | "loop";

/**
 * The live current-time numerator: absolute video time ("video"), or time
 * elapsed within the loop measured from `rangeStart`, clamped at zero ("loop").
 */
export function playheadTimeText(current: number, rangeStart: number, mode: TimeMode): string {
  const value = mode === "loop" ? Math.max(0, current - rangeStart) : current;
  return formatTime(value, true);
}
