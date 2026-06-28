import { describe, it, expect } from "vitest";
import { playheadPercent, playheadTimeText } from "./playhead";

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
