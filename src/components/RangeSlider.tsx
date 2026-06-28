import { type KeyboardEvent, type PointerEvent, forwardRef, useRef, useState } from "react";
import { valueFromPointer } from "../lib/ui/sliderMath";

export interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  /** Minimum seconds between the two thumbs (no zero-length loop). */
  minGap?: number;
  /** Commit (e.g. engine.setRange) — fires on keyboard change and pointer release. */
  onChange: (value: [number, number]) => void;
  /** Live preview during a drag — `scrubSeconds` is the thumb's current second. Does NOT commit. */
  onPreview?: (value: [number, number], scrubSeconds: number) => void;
  /** Fired when a thumb drag begins (e.g. to pause playback while scrubbing). */
  onScrubStart?: () => void;
  /** Jump the playhead to a point on the track (clicking the bar, not a thumb). */
  onSeek?: (value: number) => void;
  formatValueText?: (value: number) => string;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  { min, max, value, step = 1, minGap = 0, onChange, onPreview, onScrubStart, onSeek, formatValueText },
  trackRef,
) {
  const [start, end] = value;
  const localTrack = useRef<HTMLDivElement | null>(null);
  const dragging = useRef<null | "start" | "end">(null);
  const [hover, setHover] = useState<{ pct: number; value: number } | null>(null);

  function keyDelta(e: KeyboardEvent): number | "min" | "max" | null {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        return step;
      case "ArrowLeft":
      case "ArrowDown":
        return -step;
      case "PageUp":
        return step * 10;
      case "PageDown":
        return -step * 10;
      case "Home":
        return "min";
      case "End":
        return "max";
      default:
        return null;
    }
  }

  /**
   * Commit only if the thumb actually moved AND, for stepped arrow/page moves,
   * it moved in the intended direction. A move clamped past the min-gap boundary
   * (which would flip direction) is treated as a blocked no-op.
   */
  function moved(d: number | "min" | "max", current: number, next: number): boolean {
    if (next === current) return false;
    if (d === "min" || d === "max") return true;
    return Math.sign(next - current) === Math.sign(d);
  }

  function onStartKey(e: KeyboardEvent): void {
    const d = keyDelta(e);
    if (d === null) return;
    e.preventDefault();
    const hi = end - minGap;
    const next = d === "min" ? min : d === "max" ? hi : clamp(start + d, min, hi);
    if (moved(d, start, next)) onChange([next, end]);
  }

  function onEndKey(e: KeyboardEvent): void {
    const d = keyDelta(e);
    if (d === null) return;
    e.preventDefault();
    const lo = start + minGap;
    const next = d === "min" ? lo : d === "max" ? max : clamp(end + d, lo, max);
    if (moved(d, end, next)) onChange([start, next]);
  }

  function thumbDown(which: "start" | "end") {
    return (e: PointerEvent) => {
      dragging.current = which;
      setHover(null);
      onScrubStart?.();
      (e.target as Element).setPointerCapture(e.pointerId);
    };
  }

  /** Press on the bar itself (not a thumb) jumps the playhead to that point. */
  function trackDown(e: PointerEvent): void {
    if ((e.target as HTMLElement).closest('[role="slider"]')) return;
    const el = localTrack.current;
    if (!el || !onSeek) return;
    onSeek(valueFromPointer(e.clientX, el.getBoundingClientRect(), min, max, step));
  }

  /** Track the hovered time so the tooltip can show it (skipped while dragging). */
  function trackHover(e: PointerEvent): void {
    if (dragging.current) return;
    const el = localTrack.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover({ pct: ratio * 100, value: valueFromPointer(e.clientX, rect, min, max, step) });
  }

  function onTrackMove(e: PointerEvent): void {
    thumbMove(e);
    trackHover(e);
  }

  function thumbMove(e: PointerEvent): void {
    const which = dragging.current;
    const el = localTrack.current;
    if (!which || !el) return;
    const rect = el.getBoundingClientRect();
    const raw = valueFromPointer(e.clientX, rect, min, max, step);
    const next: [number, number] =
      which === "start"
        ? [clamp(raw, min, end - minGap), end]
        : [start, clamp(raw, start + minGap, max)];
    onPreview?.(next, which === "start" ? next[0] : next[1]);
  }

  function thumbUp(e: PointerEvent): void {
    const which = dragging.current;
    const el = localTrack.current;
    if (!which || !el) return;
    const rect = el.getBoundingClientRect();
    const raw = valueFromPointer(e.clientX, rect, min, max, step);
    const next: [number, number] =
      which === "start"
        ? [clamp(raw, min, end - minGap), end]
        : [start, clamp(raw, start + minGap, max)];
    dragging.current = null;
    onChange(next);
  }

  const text = (v: number): string => (formatValueText ? formatValueText(v) : String(v));
  const pct = (v: number): string => `${((v - min) / Math.max(1, max - min)) * 100}%`;

  const setTrack = (node: HTMLDivElement | null) => {
    localTrack.current = node;
    if (typeof trackRef === "function") trackRef(node);
    else if (trackRef) trackRef.current = node;
  };

  return (
    <div role="group" aria-label="Loop range" className="relative py-2">
      <div
        ref={setTrack}
        className="relative flex h-11 cursor-pointer items-center"
        onPointerDown={trackDown}
        onPointerMove={onTrackMove}
        onPointerUp={thumbUp}
        onPointerLeave={() => setHover(null)}
      >
        {hover && (
          <div
            aria-hidden="true"
            className="tabnum pointer-events-none absolute bottom-full z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white shadow-lg"
            style={{ left: `${hover.pct}%` }}
          >
            {text(hover.value)}
          </div>
        )}
        <div className="absolute inset-x-0 h-2.5 rounded-full bg-line shadow-inner" />
        <div
          data-testid="slider-fill"
          className="absolute h-2.5 rounded-full bg-[image:var(--rt-grad)] shadow-[0_4px_14px_rgba(16,185,129,.45)]"
          style={{ left: pct(start), width: `calc(${pct(end)} - ${pct(start)})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-7 w-[3px] -translate-y-1/2 rounded bg-white shadow-[0_0_0_2px_var(--color-brand-600)]"
          style={{ left: "var(--rt-playhead, 0%)" }}
        />
        <span
          role="slider"
          tabIndex={0}
          aria-label="Loop start"
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={end}
          aria-valuenow={start}
          aria-valuetext={text(start)}
          onKeyDown={onStartKey}
          onPointerDown={thumbDown("start")}
          style={{ left: pct(start) }}
          className="absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-brand-600 bg-white shadow-md after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_var(--color-brand-500)]"
        />
        <span
          role="slider"
          tabIndex={0}
          aria-label="Loop end"
          aria-orientation="horizontal"
          aria-valuemin={start}
          aria-valuemax={max}
          aria-valuenow={end}
          aria-valuetext={text(end)}
          onKeyDown={onEndKey}
          onPointerDown={thumbDown("end")}
          style={{ left: pct(end) }}
          className="absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-coral-600 bg-white shadow-md after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_var(--color-coral-600)]"
        />
      </div>
    </div>
  );
});
