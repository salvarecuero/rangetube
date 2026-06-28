/** Convert a pointer clientX over a track rect into a snapped, clamped value. */
export function valueFromPointer(
  clientX: number,
  rect: { left: number; width: number },
  min: number,
  max: number,
  step: number,
): number {
  if (rect.width <= 0) return min;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const raw = min + ratio * (max - min);
  const snapped = Math.round(raw / step) * step;
  return Math.min(max, Math.max(min, snapped));
}
