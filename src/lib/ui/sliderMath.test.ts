import { describe, it, expect } from "vitest";
import { valueFromPointer } from "./sliderMath";

const rect = { left: 100, width: 200 } as DOMRect;

describe("valueFromPointer", () => {
  it("maps clientX across the track to [min,max] snapped to step", () => {
    expect(valueFromPointer(100, rect, 0, 200, 1)).toBe(0);
    expect(valueFromPointer(200, rect, 0, 200, 1)).toBe(100);
    expect(valueFromPointer(300, rect, 0, 200, 1)).toBe(200);
  });
  it("clamps pointer outside the track", () => {
    expect(valueFromPointer(50, rect, 0, 200, 1)).toBe(0);
    expect(valueFromPointer(999, rect, 0, 200, 1)).toBe(200);
  });
  it("snaps to the given step", () => {
    expect(valueFromPointer(200, rect, 0, 200, 5)).toBe(100);
    expect(valueFromPointer(151, rect, 0, 100, 10)).toBe(30); // ~25.5 → snap 30
  });
});
