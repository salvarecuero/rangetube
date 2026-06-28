import { describe, it, expect } from "vitest";
import { formatTime, parseTime } from "./formatTime";

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

describe("parseTime", () => {
  it("parses m:ss into seconds", () => {
    expect(parseTime("0:00")).toBe(0);
    expect(parseTime("1:32")).toBe(92);
    expect(parseTime("9:59")).toBe(599);
  });
  it("parses tenths", () => {
    expect(parseTime("1:32.5")).toBe(92.5);
    expect(parseTime("0:06.0")).toBe(6);
  });
  it("parses h:mm:ss", () => {
    expect(parseTime("1:00:00")).toBe(3600);
    expect(parseTime("2:02:05")).toBe(7325);
  });
  it("parses a bare seconds number", () => {
    expect(parseTime("83")).toBe(83);
    expect(parseTime("83.5")).toBe(83.5);
  });
  it("trims surrounding whitespace", () => {
    expect(parseTime("  1:30  ")).toBe(90);
  });
  it("returns null for empty or junk input", () => {
    expect(parseTime("")).toBeNull();
    expect(parseTime("   ")).toBeNull();
    expect(parseTime("abc")).toBeNull();
    expect(parseTime("1:")).toBeNull();
    expect(parseTime("1:2:3:4")).toBeNull();
    expect(parseTime("-5")).toBeNull();
  });
});
