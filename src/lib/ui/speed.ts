import { SPEED_PRESETS } from "../share/loopState";

/** The next/previous playback-rate preset relative to `rate`.
 *  `dir === 1` (faster) → the smallest preset strictly greater than `rate`;
 *  `dir === -1` (slower) → the largest preset strictly less than `rate`.
 *  Returns `rate` unchanged when none exists (clamped at the ends). Handles
 *  off-preset deep-link values without a separate snap. */
export function stepSpeed(rate: number, dir: -1 | 1): number {
  if (dir === 1) {
    const next = SPEED_PRESETS.find((p) => p > rate);
    return next ?? rate;
  }
  const lower = SPEED_PRESETS.filter((p) => p < rate);
  return lower.length > 0 ? lower[lower.length - 1] : rate;
}

/** True when a further step in `dir` would change nothing (rate is at that end). */
export function isSpeedAtEnd(rate: number, dir: -1 | 1): boolean {
  return stepSpeed(rate, dir) === rate;
}
