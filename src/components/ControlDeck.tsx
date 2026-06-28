import type { RefObject } from "react";
import { Readouts } from "./Readouts";
import { RangeSlider } from "./RangeSlider";
import { Transport } from "./Transport";

export interface ControlDeckProps {
  min: number;
  max: number;
  range: [number, number];
  playing: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  onCommit: (r: [number, number]) => void;
  onPreview: (r: [number, number]) => void;
  onPlayPause: () => void;
  onRestart: () => void;
  onFocus: () => void;
  format: (seconds: number) => string;
  showFocusButton?: boolean;
  variant?: "light" | "dark";
}

export function ControlDeck({
  min,
  max,
  range,
  playing,
  trackRef,
  onCommit,
  onPreview,
  onPlayPause,
  onRestart,
  onFocus,
  format,
  showFocusButton,
  variant = "light",
}: ControlDeckProps) {
  const dark = variant === "dark";
  return (
    <div
      className={`flex flex-col gap-5 rounded-[var(--radius-stage)] border p-5 transition-colors duration-500 ${dark ? "border-white/10 bg-white/[0.06] backdrop-blur" : "border-line bg-surface shadow-xl shadow-brand-900/5"}`}
    >
      <Readouts start={range[0]} end={range[1]} format={format} variant={variant} />
      <div>
        <RangeSlider
          ref={trackRef}
          min={min}
          max={max}
          value={range}
          minGap={0.5}
          onChange={onCommit}
          onPreview={onPreview}
          formatValueText={format}
        />
        <div
          className={`tabnum flex justify-between text-[11px] ${dark ? "text-focus-muted" : "text-muted"}`}
        >
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      </div>
      <Transport
        playing={playing}
        onPlayPause={onPlayPause}
        onRestart={onRestart}
        onFocus={onFocus}
        showFocusButton={showFocusButton}
      />
    </div>
  );
}
