import { type KeyboardEvent, type PointerEvent, forwardRef, useRef } from "react";
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
  /** Live preview during a drag (e.g. seek) — does NOT commit. */
  onPreview?: (value: [number, number]) => void;
  formatValueText?: (value: number) => string;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  { min, max, value, step = 1, minGap = 0, onChange, onPreview, formatValueText },
  trackRef,
) {
  const [start, end] = value;
  const localTrack = useRef<HTMLDivElement | null>(null);
  const dragging = useRef<null | "start" | "end">(null);

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
      (e.target as Element).setPointerCapture(e.pointerId);
    };
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
    onPreview?.(next);
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
    <div role="group" aria-label="Loop range" className="relative py-3">
      <div
        ref={setTrack}
        className="relative flex h-11 items-center"
        onPointerMove={thumbMove}
        onPointerUp={thumbUp}
      >
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
          className="absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-brand-600 bg-white shadow-md after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_var(--color-brand-500)]"
        />
      </div>
    </div>
  );
});
