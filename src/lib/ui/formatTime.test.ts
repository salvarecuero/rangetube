import { describe, it, expect } from "vitest";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("formats sub-hour times as m:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(92)).toBe("1:32");
    expect(formatTime(599)).toBe("9:59");
  });
  it("formats times of an hour or more as h:mm:ss with padded minutes", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3661)).toBe("1:01:01");
    expect(formatTime(7325)).toBe("2:02:05");
  });
  it("includes tenths when withMs is true", () => {
    expect(formatTime(92.5, true)).toBe("1:32.5");
    expect(formatTime(6.04, true)).toBe("0:06.0");
    expect(formatTime(3661.5, true)).toBe("1:01:01.5");
  });
  it("clamps negatives to zero", () => {
    expect(formatTime(-5)).toBe("0:00");
  });
});
