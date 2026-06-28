import { describe, it, expect } from "vitest";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("formats whole seconds as mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(92)).toBe("1:32");
    expect(formatTime(3661)).toBe("61:01");
  });
  it("includes tenths when withMs is true", () => {
    expect(formatTime(92.5, true)).toBe("1:32.5");
    expect(formatTime(6.04, true)).toBe("0:06.0");
  });
  it("clamps negatives to zero", () => {
    expect(formatTime(-5)).toBe("0:00");
  });
});
