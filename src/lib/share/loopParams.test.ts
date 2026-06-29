import { describe, it, expect } from "vitest";
import { encodeLoopParams, decodeLoopParams } from "./loopParams";

const VID = "dQw4w9WgXcQ";

describe("encodeLoopParams", () => {
  it("encodes video, start and end as a query string without a leading '?'", () => {
    expect(encodeLoopParams({ videoId: VID, start: 92, end: 98, rate: 1 })).toBe(
      `v=${VID}&s=92&e=98`,
    );
  });
  it("omits r when rate is 1 and includes it otherwise", () => {
    expect(encodeLoopParams({ videoId: VID, start: 0, end: 10, rate: 0.5 })).toBe(
      `v=${VID}&s=0&e=10&r=0.5`,
    );
  });
  it("trims trailing zeros on fractional seconds", () => {
    expect(encodeLoopParams({ videoId: VID, start: 92.5, end: 98, rate: 1 })).toBe(
      `v=${VID}&s=92.5&e=98`,
    );
  });
});

describe("decodeLoopParams", () => {
  it("round-trips an encoded state", () => {
    const state = { videoId: VID, start: 92, end: 98.5, rate: 0.75 };
    expect(decodeLoopParams(encodeLoopParams(state))).toEqual(state);
  });
  it("defaults rate to 1 when r is absent", () => {
    expect(decodeLoopParams(`v=${VID}&s=1&e=2`)).toEqual({
      videoId: VID,
      start: 1,
      end: 2,
      rate: 1,
    });
  });
  it("snaps an off-preset rate", () => {
    expect(decodeLoopParams(`v=${VID}&s=1&e=2&r=0.8`)?.rate).toBe(0.75);
  });
  it("returns null without a valid video id", () => {
    expect(decodeLoopParams("s=1&e=2")).toBeNull();
    expect(decodeLoopParams("v=nope&s=1&e=2")).toBeNull();
  });
  it("returns null when end is not after start", () => {
    expect(decodeLoopParams(`v=${VID}&s=5&e=5`)).toBeNull();
    expect(decodeLoopParams(`v=${VID}&s=9&e=2`)).toBeNull();
  });
  it("returns null on a negative start or unparseable numbers", () => {
    expect(decodeLoopParams(`v=${VID}&s=-1&e=2`)).toBeNull();
    expect(decodeLoopParams(`v=${VID}&s=x&e=2`)).toBeNull();
  });
});
