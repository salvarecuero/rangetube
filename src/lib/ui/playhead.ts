import { formatTime } from "./formatTime";

/** Position of `current` within [min,max] as a clamped 0-100 percentage. */
export function playheadPercent(current: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 0;
  const pct = ((current - min) / span) * 100;
  return Math.min(100, Math.max(0, pct));
}

/** How the current-time readout expresses the playhead. */
export type TimeMode = "video" | "loop" | "live";

/** Within this many seconds of the live edge the playhead reads as LIVE (absorbs edge-estimate lag). */
const AT_LIVE_EDGE = 2;

/**
 * The live current-time numerator: absolute video time ("video"), time
 * elapsed within the loop measured from `rangeStart`, clamped at zero ("loop"),
 * or how far behind `liveEdge` the playhead is ("live").
 */
export function playheadTimeText(
  current: number,
  rangeStart: number,
  mode: TimeMode,
  liveEdge = current,
): string {
  if (mode === "live") {
    const behind = liveEdge - current;
    return behind < AT_LIVE_EDGE ? "LIVE" : `-${formatTime(behind)}`;
  }
  const value = mode === "loop" ? Math.max(0, current - rangeStart) : current;
  return formatTime(value, true);
}

/** Readout mode after `mode` when the user switches it; "live" only applies to live streams. */
export function nextTimeMode(mode: TimeMode, live: boolean): TimeMode {
  if (mode === "video") return "loop";
  if (mode === "loop" && live) return "live";
  return "video";
}
