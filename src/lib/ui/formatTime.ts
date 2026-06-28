/** Format seconds as m:ss, optionally with a tenths-of-a-second suffix. */
export function formatTime(totalSeconds: number, withMs = false): string {
  const t = Math.max(0, totalSeconds);
  const whole = Math.floor(t);
  const mm = Math.floor(whole / 60);
  const ss = String(whole % 60).padStart(2, "0");
  if (!withMs) return `${mm}:${ss}`;
  const tenths = Math.floor((t - whole) * 10);
  return `${mm}:${ss}.${tenths}`;
}
