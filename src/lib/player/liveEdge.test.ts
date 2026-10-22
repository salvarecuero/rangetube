import { describe, it, expect } from "vitest";
import { LIVE_DVR_WINDOW, liveEdgeAt, liveWindow, observeLiveEdge } from "./liveEdge";

describe("observeLiveEdge", () => {
  it("anchors on the first observation", () => {
    expect(observeLiveEdge(null, 500, 1_000)).toEqual({ time: 500, at: 1_000 });
  });
  it("keeps the anchor while playback trails the projected edge", () => {
    const edge = { time: 500, at: 1_000 };
    expect(observeLiveEdge(edge, 400, 11_000)).toBe(edge);
  });
  it("re-anchors when playback gets ahead of the projected edge", () => {
    const edge = { time: 500, at: 1_000 };
    expect(observeLiveEdge(edge, 512, 11_000)).toEqual({ time: 512, at: 11_000 });
  });
});

describe("liveEdgeAt", () => {
  it("advances the edge in real time from the anchor", () => {
    expect(liveEdgeAt({ time: 500, at: 1_000 }, 4_000)).toBe(503);
  });
});

describe("liveWindow", () => {
  it("starts at 0 for streams shorter than the DVR window", () => {
    expect(liveWindow(600)).toEqual([0, 600]);
  });
  it("keeps only the trailing DVR window for long streams", () => {
    expect(liveWindow(LIVE_DVR_WINDOW + 100)).toEqual([100, LIVE_DVR_WINDOW + 100]);
  });
});
