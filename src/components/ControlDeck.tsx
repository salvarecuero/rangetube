import type { RefObject } from "react";
import { Play, Pause, RotateCcw, Repeat, Focus, ArrowRightLeft } from "lucide-react";
import { RangeSlider } from "./RangeSlider";
import { TimeField } from "./TimeField";
import type { TimeMode } from "../lib/ui/playhead";
import { MIN_GAP } from "../lib/player/markRange";

export interface ControlDeckProps {
  min: number;
  max: number;
  range: [number, number];
  playing: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  /** Play/pause button — focused when entering focus mode. */
  playPauseRef?: RefObject<HTMLButtonElement | null>;
  /** Focus-mode toggle — focused when leaving focus mode. */
  focusButtonRef?: RefObject<HTMLButtonElement | null>;
  /** Live current-time numerator is written here via rAF (no React re-render). */
  currentTimeRef: RefObject<HTMLSpanElement | null>;
  onCommit: (r: [number, number]) => void;
  onPreview: (r: [number, number], scrubSeconds: number) => void;
  onScrubStart: () => void;
  onSeek: (seconds: number) => void;
  onPlayPause: () => void;
  onRestart: () => void;
  onFocus: () => void;
  /** Toggle the current-time readout between "in video" and "in loop". */
  onToggleTimeMode: () => void;
  timeMode: TimeMode;
  /** Whether the A→B loop is active (repeats) vs. plays through. */
  looping: boolean;
  onToggleLoop: () => void;
  /** Whether focus mode is currently on (reflected on the focus toggle). */
  focusActive?: boolean;
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
  playPauseRef,
  focusButtonRef,
  currentTimeRef,
  onCommit,
  onPreview,
  onScrubStart,
  onSeek,
  onPlayPause,
  onRestart,
  onFocus,
  onToggleTimeMode,
  timeMode,
  looping,
  onToggleLoop,
  focusActive = false,
  format,
  showFocusButton = true,
  variant = "light",
}: ControlDeckProps) {
  const dark = variant === "dark";
  const loopLength = Math.max(0, range[1] - range[0]);
  const denom = timeMode === "loop" ? format(loopLength) : format(max);
  const modeLabel = timeMode === "loop" ? "in loop" : "in video";
  const initialNumerator = timeMode === "loop" ? format(0) : format(range[0]);

  // Cluster button styling; `active` is the pressed-toggle look (loop on / focus on).
  const clusterBtn = (active: boolean) => {
    const base =
      "grid h-10 w-10 place-items-center rounded-[14px] border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
    if (active) {
      return `${base} ${dark ? "border-brand-400/50 bg-brand-500/20 text-brand-300" : "border-brand-500 bg-brand-50 text-brand-700"}`;
    }
    return `${base} ${dark ? "border-white/12 bg-white/[0.06] text-brand-300 hover:border-brand-400" : "border-line bg-white text-brand-700 hover:border-brand-500"}`;
  };

  return (
    <div
      className={`rounded-[var(--radius-stage)] border p-3 transition-colors duration-500 @2xl:px-4 ${
        dark
          ? "border-white/10 bg-white/[0.06] backdrop-blur"
          : "border-line bg-surface shadow-xl shadow-brand-900/5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 @2xl:flex-nowrap @2xl:gap-4">
        {/* Play — far left on wide, joins the button row on narrow */}
        <button
          ref={playPauseRef}
          type="button"
          onClick={onPlayPause}
          aria-label={playing ? "Pause" : "Play"}
          className="order-2 grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-[image:var(--rt-grad)] text-brand-900 shadow-lg shadow-brand-500/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 @2xl:order-1"
        >
          {playing ? (
            <Pause className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Play className="h-6 w-6 translate-x-px" aria-hidden="true" />
          )}
        </button>

        {/* Slider + A | current | B */}
        <div className="order-1 w-full min-w-0 @2xl:order-2 @2xl:flex-1">
          <RangeSlider
            ref={trackRef}
            min={min}
            max={max}
            value={range}
            minGap={MIN_GAP}
            onChange={onCommit}
            onPreview={onPreview}
            onScrubStart={onScrubStart}
            onSeek={onSeek}
            formatValueText={format}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <TimeField
              label="A"
              ariaLabel="Loop start"
              seconds={range[0]}
              min={min}
              max={range[1] - MIN_GAP}
              format={format}
              onCommit={(s) => onCommit([s, range[1]])}
              variant="start"
              dark={dark}
            />
            <button
              type="button"
              onClick={onToggleTimeMode}
              aria-label="Switch time readout"
              title="Switch between time in video and time in loop"
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                timeMode === "loop"
                  ? dark
                    ? "bg-brand-500/15"
                    : "bg-brand-50"
                  : "hover:bg-brand-500/10"
              }`}
            >
              <span
                className={`tabnum text-[13px] font-bold ${dark ? "text-focus-ink" : "text-ink"}`}
              >
                <span ref={currentTimeRef} aria-label="Current time">
                  {initialNumerator}
                </span>
                <span className={dark ? "text-focus-muted" : "text-muted"}> / </span>
                <span className={dark ? "text-focus-muted" : "text-muted"}>{denom}</span>
              </span>
              <span
                className={`flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider ${
                  dark ? "text-brand-300" : "text-brand-700"
                }`}
              >
                <ArrowRightLeft className="h-2.5 w-2.5 opacity-70" aria-hidden="true" />
                {modeLabel}
              </span>
            </button>
            <TimeField
              label="B"
              ariaLabel="Loop end"
              seconds={range[1]}
              min={range[0] + MIN_GAP}
              max={max}
              format={format}
              onCommit={(s) => onCommit([range[0], s])}
              variant="end"
              dark={dark}
            />
          </div>
        </div>

        {/* Restart · loop toggle · focus toggle */}
        <div className="order-3 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRestart}
            aria-label="Restart loop"
            className={clusterBtn(false)}
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToggleLoop}
            aria-label="Toggle loop"
            aria-pressed={looping}
            title={looping ? "Loop on — repeats A→B" : "Loop off — plays past B"}
            className={clusterBtn(looping)}
          >
            <Repeat className="h-5 w-5" aria-hidden="true" />
          </button>
          {showFocusButton && (
            <button
              ref={focusButtonRef}
              type="button"
              onClick={onFocus}
              aria-label="Focus mode"
              aria-pressed={focusActive}
              title={
                focusActive
                  ? "Exit focus mode (Esc)"
                  : "Focus mode — hide everything but the player"
              }
              className={clusterBtn(focusActive)}
            >
              <Focus className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
