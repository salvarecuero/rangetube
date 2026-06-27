import { type KeyboardEvent } from "react";

export interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
  /** Format a raw value into accessible text (e.g. mm:ss). */
  formatValueText?: (value: number) => string;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function RangeSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
  formatValueText,
}: RangeSliderProps) {
  const [start, end] = value;

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

  function onStartKey(e: KeyboardEvent): void {
    const d = keyDelta(e);
    if (d === null) return;
    e.preventDefault();
    const next = d === "min" ? min : d === "max" ? end : clamp(start + d, min, end);
    if (next !== start) onChange([next, end]);
  }

  function onEndKey(e: KeyboardEvent): void {
    const d = keyDelta(e);
    if (d === null) return;
    e.preventDefault();
    const next = d === "min" ? start : d === "max" ? max : clamp(end + d, start, max);
    if (next !== end) onChange([start, next]);
  }

  const text = (v: number): string => (formatValueText ? formatValueText(v) : String(v));

  return (
    <div
      role="group"
      aria-label="Loop range"
      className="relative flex w-full items-center gap-4 py-4"
    >
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
        className="inline-block h-6 w-6 cursor-default rounded-full bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
        className="inline-block h-6 w-6 cursor-default rounded-full bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      />
    </div>
  );
}
