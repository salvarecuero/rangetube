import { describe, it, expect } from "vitest";
import { stepSpeed, isSpeedAtEnd } from "./speed";

describe("stepSpeed", () => {
  it("steps up to the next preset", () => {
    expect(stepSpeed(0.5, 1)).toBe(0.75);
    expect(stepSpeed(1, 1)).toBe(1.25);
  });

  it("steps down to the previous preset", () => {
    expect(stepSpeed(1.5, -1)).toBe(1.25);
    expect(stepSpeed(1, -1)).toBe(0.75);
  });

  it("clamps at the ends", () => {
    expect(stepSpeed(1.5, 1)).toBe(1.5);
    expect(stepSpeed(0.5, -1)).toBe(0.5);
  });

  it("handles off-preset values relative to the current rate", () => {
    expect(stepSpeed(0.9, 1)).toBe(1); // smallest preset > 0.9
    expect(stepSpeed(0.9, -1)).toBe(0.75); // largest preset < 0.9
  });
});

describe("isSpeedAtEnd", () => {
  it("is true only at the matching end", () => {
    expect(isSpeedAtEnd(0.5, -1)).toBe(true);
    expect(isSpeedAtEnd(1.5, 1)).toBe(true);
    expect(isSpeedAtEnd(1, 1)).toBe(false);
    expect(isSpeedAtEnd(1, -1)).toBe(false);
  });
});
