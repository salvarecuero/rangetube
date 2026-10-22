/** How far back a live stream stays seekable (YouTube's DVR window), in seconds. */
export const LIVE_DVR_WINDOW = 12 * 3600;

/** Live edge anchor: stream time `time` (seconds) observed at wall clock `at` (ms). */
export interface LiveEdge {
  time: number;
  at: number;
}

/**
 * Track the live edge from playback observations. A source's reported live
 * duration can be stale or overshoot, so the edge is the furthest playback
 * position seen, projected forward in real time.
 */
export function observeLiveEdge(
  edge: LiveEdge | null,
  currentTime: number,
  nowMs: number,
): LiveEdge {
  if (!edge || currentTime > liveEdgeAt(edge, nowMs)) return { time: currentTime, at: nowMs };
  return edge;
}

/** Projected live edge (seconds) at wall clock `nowMs`. */
export function liveEdgeAt(edge: LiveEdge, nowMs: number): number {
  return edge.time + (nowMs - edge.at) / 1000;
}

/** Seekable [min, max] span of a live stream whose edge is at `edgeSeconds`. */
export function liveWindow(edgeSeconds: number): [number, number] {
  return [Math.max(0, edgeSeconds - LIVE_DVR_WINDOW), edgeSeconds];
}
