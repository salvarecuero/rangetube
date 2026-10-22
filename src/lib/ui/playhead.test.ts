import { describe, it, expect } from "vitest";
import { nextTimeMode, playheadPercent, playheadTimeText } from "./playhead";

describe("playheadPercent", () => {
  it("maps current time to 0-100 within [min,max]", () => {
    expect(playheadPercent(0, 0, 200)).toBe(0);
    expect(playheadPercent(100, 0, 200)).toBe(50);
    expect(playheadPercent(200, 0, 200)).toBe(100);
  });
  it("clamps out-of-range values", () => {
    expect(playheadPercent(-10, 0, 200)).toBe(0);
    expect(playheadPercent(250, 0, 200)).toBe(100);
  });
  it("returns 0 for a zero-width span", () => {
    expect(playheadPercent(5, 10, 10)).toBe(0);
  });
});

describe("playheadTimeText", () => {
  it("shows the absolute time in video mode", () => {
    expect(playheadTimeText(41.2, 12, "video")).toBe("0:41.2");
  });
  it("shows time elapsed within the loop in loop mode", () => {
    expect(playheadTimeText(41.2, 12, "loop")).toBe("0:29.2");
  });
  it("clamps to zero when the playhead is before the loop start", () => {
    expect(playheadTimeText(5, 12, "loop")).toBe("0:00.0");
  });
});

describe("playheadTimeText in live mode", () => {
  it("shows how far behind the live edge the playhead is", () => {
    expect(playheadTimeText(1000, 0, "live", 1083.4)).toBe("-1:23");
  });
  it("shows LIVE when the playhead is at the edge", () => {
    expect(playheadTimeText(1000, 0, "live", 1001)).toBe("LIVE");
  });
});

describe("nextTimeMode", () => {
  it("cycles video and loop for regular videos", () => {
    expect(nextTimeMode("video", false)).toBe("loop");
    expect(nextTimeMode("loop", false)).toBe("video");
  });
  it("adds the live mode to the cycle for live streams", () => {
    expect(nextTimeMode("video", true)).toBe("loop");
    expect(nextTimeMode("loop", true)).toBe("live");
    expect(nextTimeMode("live", true)).toBe("video");
  });
});
