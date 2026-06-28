/** Smallest allowed gap between A and B (no zero-length loop). */
export const MIN_GAP = 0.5;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Set loop start (A) to `t`, clamped to [min, end - gap]. */
export function markIn(
  range: [number, number],
  t: number,
  min: number,
  max: number,
  gap: number,
): [number, number] {
  return [clamp(t, min, range[1] - gap), range[1]];
}

/** Set loop end (B) to `t`, clamped to [start + gap, max]. */
export function markOut(
  range: [number, number],
  t: number,
  min: number,
  max: number,
  gap: number,
): [number, number] {
  return [range[0], clamp(t, range[0] + gap, max)];
}
