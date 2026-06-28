import { describe, it, expect, vi } from "vitest";
import { LoopEngine } from "./loopEngine";

function setup(currentTime: number) {
  const seekTo = vi.fn();
  const engine = new LoopEngine({ getCurrentTime: () => currentTime, seekTo });
  return { engine, seekTo };
}

describe("LoopEngine.tick", () => {
  it("does nothing when no range is set", () => {
    const { engine, seekTo } = setup(5);
    engine.tick();
    expect(seekTo).not.toHaveBeenCalled();
  });
  it("does nothing while position is inside the range", () => {
    const { engine, seekTo } = setup(15);
    engine.setRange({ start: 10, end: 20 });
    engine.tick();
    expect(seekTo).not.toHaveBeenCalled();
  });
  it("seeks to start when position reaches the end", () => {
    const { engine, seekTo } = setup(20);
    engine.setRange({ start: 10, end: 20 });
    engine.tick();
    expect(seekTo).toHaveBeenCalledWith(10);
  });
  it("seeks to start when position is past the end", () => {
    const { engine, seekTo } = setup(25);
    engine.setRange({ start: 10, end: 20 });
    engine.tick();
    expect(seekTo).toHaveBeenCalledWith(10);
  });
  it("seeks to start when position is before the range", () => {
    const { engine, seekTo } = setup(3);
    engine.setRange({ start: 10, end: 20 });
    engine.tick();
    expect(seekTo).toHaveBeenCalledWith(10);
  });
  it("setRange with a new range changes the loop boundaries", () => {
    const { engine, seekTo } = setup(20);
    engine.setRange({ start: 10, end: 20 });
    engine.setRange({ start: 0, end: 30 });
    engine.tick();
    expect(seekTo).not.toHaveBeenCalled();
  });
  it("re-seeks slightly before the end to absorb float drift", () => {
    const { engine, seekTo } = setup(19.97); // within 0.05 of end
    engine.setRange({ start: 10, end: 20 });
    engine.tick();
    expect(seekTo).toHaveBeenCalledWith(10);
  });
});

describe("LoopEngine.start/stop", () => {
  it("ticks repeatedly via the injected scheduler until stopped", () => {
    const seekTo = vi.fn();
    let scheduled: (() => void) | null = null;
    const schedule = vi.fn((cb: () => void) => {
      scheduled = cb;
      return 1;
    });
    const cancel = vi.fn();
    const t = 20;
    const engine = new LoopEngine({
      getCurrentTime: () => t,
      seekTo,
      schedule,
      cancel,
    });
    engine.setRange({ start: 10, end: 20 });
    engine.start();
    expect(schedule).toHaveBeenCalledTimes(1);
    scheduled!();
    expect(seekTo).toHaveBeenCalledWith(10);
    expect(schedule).toHaveBeenCalledTimes(2);
    engine.stop();
    expect(cancel).toHaveBeenCalledWith(1);
  });
});
