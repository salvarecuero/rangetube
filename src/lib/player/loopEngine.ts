export interface LoopRange {
  /** seconds */
  start: number;
  /** seconds */
  end: number;
}

export interface LoopEngineOptions {
  getCurrentTime: () => number;
  seekTo: (seconds: number) => void;
  /** Schedule a callback for the next tick. Defaults to requestAnimationFrame. */
  schedule?: (cb: () => void) => number;
  /** Cancel a scheduled callback. Defaults to cancelAnimationFrame. */
  cancel?: (id: number) => void;
}

const defaultSchedule = (cb: () => void): number => requestAnimationFrame(cb);
const defaultCancel = (id: number): void => cancelAnimationFrame(id);

/**
 * Source-agnostic segment looper. Re-seeks to the range start when playback
 * reaches the range end (or drifts outside the range). Designed so `tick()`
 * holds all decision logic and is unit-testable without timers.
 */
export class LoopEngine {
  private range: LoopRange | null = null;
  private rafId: number | null = null;
  private readonly getCurrentTime: () => number;
  private readonly seekTo: (seconds: number) => void;
  private readonly schedule: (cb: () => void) => number;
  private readonly cancel: (id: number) => void;

  constructor(options: LoopEngineOptions) {
    this.getCurrentTime = options.getCurrentTime;
    this.seekTo = options.seekTo;
    this.schedule = options.schedule ?? defaultSchedule;
    this.cancel = options.cancel ?? defaultCancel;
  }

  setRange(range: LoopRange): void {
    this.range = range;
  }

  /** One evaluation of the loop condition. Pure given getCurrentTime/seekTo. */
  tick(): void {
    if (!this.range) return;
    const EPSILON = 0.05; // seconds; absorbs polling/float drift at the loop end
    const t = this.getCurrentTime();
    if (t >= this.range.end - EPSILON || t < this.range.start) {
      this.seekTo(this.range.start);
    }
  }

  start(): void {
    if (this.rafId !== null) return;
    const loop = (): void => {
      this.tick();
      this.rafId = this.schedule(loop);
    };
    this.rafId = this.schedule(loop);
  }

  stop(): void {
    if (this.rafId !== null) {
      this.cancel(this.rafId);
      this.rafId = null;
    }
  }
}
