/** A loop someone can return to: video + range + speed. The serializable unit
 *  shared by deep links and saved loops. */
export interface LoopState {
  videoId: string;
  start: number; // seconds
  end: number; // seconds
  rate: number; // playback rate; 1 when unset
}

/** Speed presets focused on studying a segment. */
export const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5] as const;

/** Snap an arbitrary rate to the nearest valid preset; non-finite -> 1. */
export function snapRate(rate: number): number {
  if (!Number.isFinite(rate)) return 1;
  return SPEED_PRESETS.reduce((best, p) =>
    Math.abs(p - rate) < Math.abs(best - rate) ? p : best,
  );
}
