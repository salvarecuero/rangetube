import { parseVideoId } from "../youtube/parseVideoId";
import { snapRate, type LoopState } from "./loopState";

/** Format seconds compactly: integers stay integer, fractions keep up to 1 decimal. */
function num(seconds: number): string {
  return String(Math.round(seconds * 10) / 10);
}

function parseNum(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Serialize a LoopState as a URL query string (no leading "?"). */
export function encodeLoopParams(state: LoopState): string {
  const p = new URLSearchParams();
  p.set("v", state.videoId);
  p.set("s", num(state.start));
  p.set("e", num(state.end));
  if (state.rate !== 1) p.set("r", num(state.rate));
  return p.toString();
}

/** Parse a query string / params into a validated LoopState, or null if invalid. */
export function decodeLoopParams(search: string | URLSearchParams): LoopState | null {
  const p = typeof search === "string" ? new URLSearchParams(search) : search;
  const videoId = parseVideoId(p.get("v") ?? "");
  if (!videoId) return null;

  const start = parseNum(p.get("s"));
  const end = parseNum(p.get("e"));
  if (start === null || end === null) return null;
  if (start < 0 || end <= start) return null;

  const rRaw = p.get("r");
  const rate = rRaw === null ? 1 : snapRate(Number(rRaw));
  return { videoId, start, end, rate };
}
