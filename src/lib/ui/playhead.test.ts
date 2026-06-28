import { describe, it, expect } from "vitest";
import { playheadPercent } from "./playhead";

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
