import { describe, it, expect } from "vitest";
import { markIn, markOut, MIN_GAP } from "./markRange";

describe("MIN_GAP", () => {
  it("is half a second", () => {
    expect(MIN_GAP).toBe(0.5);
  });
});

describe("markIn", () => {
  it("sets start to the current time, keeping end", () => {
    expect(markIn([10, 40], 25, 0, 100, MIN_GAP)).toEqual([25, 40]);
  });
  it("never crosses end minus the gap", () => {
    expect(markIn([10, 40], 50, 0, 100, MIN_GAP)).toEqual([39.5, 40]);
  });
  it("clamps below min", () => {
    expect(markIn([10, 40], -5, 0, 100, MIN_GAP)).toEqual([0, 40]);
  });
});

describe("markOut", () => {
  it("sets end to the current time, keeping start", () => {
    expect(markOut([10, 40], 30, 0, 100, MIN_GAP)).toEqual([10, 30]);
  });
  it("never crosses start plus the gap", () => {
    expect(markOut([10, 40], 5, 0, 100, MIN_GAP)).toEqual([10, 10.5]);
  });
  it("clamps above max", () => {
    expect(markOut([10, 40], 200, 0, 100, MIN_GAP)).toEqual([10, 100]);
  });
});
