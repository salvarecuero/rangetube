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
  const core = hh > 0 ? `${hh}:${String(mm).padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
  if (!withMs) return core;
  const tenths = Math.floor((t - whole) * 10);
  return `${core}.${tenths}`;
}

/**
 * Parse a human-typed time into seconds. Accepts `m:ss(.s)`, `h:mm:ss`, or a
 * bare seconds number; each `:`-separated part must be a non-negative number.
 * Returns null for empty or unparseable input (so callers can revert).
 */
export function parseTime(text: string): number | null {
  const s = text.trim();
  if (!s) return null;
  const parts = s.split(":");
  if (parts.length > 3) return null;
  let total = 0;
  for (const part of parts) {
    if (!/^\d*\.?\d+$/.test(part)) return null;
    total = total * 60 + parseFloat(part);
  }
  return total;
}
