/**
 * Format seconds as m:ss, or h:mm:ss once the duration reaches an hour,
 * optionally with a tenths-of-a-second suffix.
 */
export function formatTime(totalSeconds: number, withMs = false): string {
  const t = Math.max(0, totalSeconds);
  const whole = Math.floor(t);
  const hh = Math.floor(whole / 3600);
  const mm = Math.floor((whole % 3600) / 60);
  const ss = String(whole % 60).padStart(2, "0");
  const core =
    hh > 0 ? `${hh}:${String(mm).padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
  if (!withMs) return core;
  const tenths = Math.floor((t - whole) * 10);
  return `${core}.${tenths}`;
}
