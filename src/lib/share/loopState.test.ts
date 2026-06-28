import { describe, it, expect } from "vitest";
import { SPEED_PRESETS, snapRate } from "./loopState";

describe("SPEED_PRESETS", () => {
  it("is the looping subset in ascending order", () => {
    expect([...SPEED_PRESETS]).toEqual([0.5, 0.75, 1, 1.25, 1.5]);
  });
});

describe("snapRate", () => {
  it("keeps an exact preset", () => {
    expect(snapRate(0.75)).toBe(0.75);
  });
  it("snaps a near value to the closest preset", () => {
    expect(snapRate(0.8)).toBe(0.75);
    expect(snapRate(1.4)).toBe(1.5);
  });
  it("clamps out-of-range values to the nearest preset", () => {
    expect(snapRate(0.1)).toBe(0.5);
    expect(snapRate(3)).toBe(1.5);
  });
  it("falls back to 1 for non-finite input", () => {
    expect(snapRate(Number.NaN)).toBe(1);
    expect(snapRate(Number.POSITIVE_INFINITY)).toBe(1);
  });
});
