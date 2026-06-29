import { useEffect, useState, type RefObject } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Focus,
  ArrowRightLeft,
  ArrowLeftToLine,
  ArrowRightToLine,
  Link2,
  Check,
} from "lucide-react";
import { RangeSlider } from "./RangeSlider";
import { SpeedControl } from "./SpeedControl";
import { TimeField } from "./TimeField";
import type { TimeMode } from "../lib/ui/playhead";
import { MIN_GAP } from "../lib/player/markRange";

/** Below this viewport width the deck uses the stacked mobile arrangement.
 *  Viewport-based is sufficient: the deck only becomes narrow at narrow
 *  viewports (its width is otherwise capped by the stage's height-based
 *  maxWidth, which is still wide enough for the desktop cluster). Tune in
 *  visual verification. */
const COMPACT_QUERY = "(max-width: 600px)";

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
  /** Whether the active source supports speed (capability-gated). */
  canSetSpeed?: boolean;
  /** Current playback rate. */
  rate?: number;
  onRate?: (rate: number) => void;
  /** Set A to the current playhead. */
  onMarkIn?: () => void;
  /** Set B to the current playhead. */
  onMarkOut?: () => void;
  /** Build the absolute deep-link URL for the current loop (enables Copy link). */
  getShareUrl?: () => string;
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
  canSetSpeed = false,
  rate = 1,
  onRate,
  onMarkIn,
  onMarkOut,
  getShareUrl,
}: ControlDeckProps) {
  const dark = variant === "dark";

  // Desktop arrangement by default (also the jsdom/SSR default — avoids a
  // hydration mismatch); a client-side media query switches to the mobile
  // arrangement. Only one arrangement is ever mounted, so refs stay unique.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(COMPACT_QUERY);
    const apply = () => setCompact(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  const [copied, setCopied] = useState(false);
  async function copyLink() {
    if (!getShareUrl) return;
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op; URL is still in the address bar */
    }
  }

  const loopLength = Math.max(0, range[1] - range[0]);
  const denom = timeMode === "loop" ? format(loopLength) : format(max);
  const modeLabel = timeMode === "loop" ? "in loop" : "in video";
  const initialNumerator = timeMode === "loop" ? format(0) : format(range[0]);

  // Cluster button styling; `active` is the pressed-toggle look (loop on / focus on).
  const clusterBtn = (active: boolean) => {
    const base =
      "grid h-9 w-9 place-items-center rounded-[14px] border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
    if (active) {
      return `${base} ${dark ? "border-brand-400/50 bg-brand-500/20 text-brand-300" : "border-brand-500 bg-brand-50 text-brand-700"}`;
    }
    return `${base} ${dark ? "border-white/12 bg-white/[0.06] text-brand-300 hover:border-brand-400" : "border-line bg-white text-brand-700 hover:border-brand-500"}`;
  };

  // Each control is defined once; placed into the desktop or mobile
  // arrangement below. Conditional controls collapse to `false` (render
  // nothing) when their prop is absent.
  const playBtn = (
    <button
      ref={playPauseRef}
      type="button"
      onClick={onPlayPause}
      aria-label={playing ? "Pause" : "Play"}
      className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-[image:var(--rt-grad)] text-brand-900 shadow-lg shadow-brand-500/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      {playing ? (
        <Pause className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Play className="h-6 w-6 translate-x-px" aria-hidden="true" />
      )}
    </button>
  );

  const aField = (
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
  );

  const bField = (
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
  );

  const markInBtn = onMarkIn && (
    <button
      type="button"
      onClick={onMarkIn}
      title="Mark in — set A to current time ([)"
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        dark
          ? "border-white/12 bg-white/[0.06] text-brand-300 hover:border-brand-400"
          : "border-line bg-white text-brand-700 hover:border-brand-500"
      }`}
      aria-label="Mark in (set loop start to current time)"
    >
      <ArrowLeftToLine className="h-3.5 w-3.5" aria-hidden="true" />A
    </button>
  );

  const markOutBtn = onMarkOut && (
    <button
      type="button"
      onClick={onMarkOut}
      title="Mark out — set B to current time (])"
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        dark
          ? "border-white/12 bg-white/[0.06] text-coral-500 hover:border-coral-500"
          : "border-line bg-white text-coral-600 hover:border-coral-600"
      }`}
      aria-label="Mark out (set loop end to current time)"
    >
      B<ArrowRightToLine className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );

  const readoutBtn = (
    <button
      type="button"
      onClick={onToggleTimeMode}
      aria-label="Switch time readout"
      title="Switch between time in video and time in loop"
      className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        timeMode === "loop" ? (dark ? "bg-brand-500/15" : "bg-brand-50") : "hover:bg-brand-500/10"
      }`}
    >
      <span className={`tabnum text-[13px] font-bold ${dark ? "text-focus-ink" : "text-ink"}`}>
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
  );

  const speedCtl = canSetSpeed && onRate && (
    <SpeedControl rate={rate} onRate={onRate} dark={dark} />
  );

  const restartBtn = (
    <button
      type="button"
      onClick={onRestart}
      aria-label="Restart loop"
      className={clusterBtn(false)}
    >
      <RotateCcw className="h-5 w-5" aria-hidden="true" />
    </button>
  );

  const loopBtn = (
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
  );

  const focusBtn = showFocusButton && (
    <button
      ref={focusButtonRef}
      type="button"
      onClick={onFocus}
      aria-label="Focus mode"
      aria-pressed={focusActive}
      title={focusActive ? "Exit focus mode (Esc)" : "Focus mode — hide everything but the player"}
      className={clusterBtn(focusActive)}
    >
      <Focus className="h-5 w-5" aria-hidden="true" />
    </button>
  );

  const shareBtn = getShareUrl && (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link to this loop"
        title="Copy a shareable link to this loop"
        className={clusterBtn(false)}
      >
        {copied ? (
          <Check className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Link2 className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      {copied && (
        <span
          role="status"
          className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ${
            dark ? "bg-white/15 text-focus-ink" : "bg-ink text-white"
          }`}
        >
          Copied!
        </span>
      )}
    </span>
  );

  return (
    <div
      className={`rounded-[var(--radius-stage)] border p-3 transition-colors duration-500 @2xl:px-4 ${
        dark
          ? "border-white/10 bg-white/[0.06] backdrop-blur"
          : "border-line bg-surface shadow-xl shadow-brand-900/5"
      }`}
    >
      {/* Row 1 — timeline, full width */}
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

      {compact ? (
        <>
          {/* Mobile — time centered; A·⇤A · Play · B⇥·B; secondary cluster centered */}
          <div className="mt-2 flex justify-center">{readoutBtn}</div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              {aField}
              {markInBtn}
            </div>
            {playBtn}
            <div className="flex items-center gap-1.5">
              {markOutBtn}
              {bField}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {speedCtl}
            {restartBtn}
            {loopBtn}
            {focusBtn}
            {shareBtn}
          </div>
        </>
      ) : (
        <>
          {/* Desktop — A · time · B aligned; centered cluster with Play in the middle */}
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
            <div className="justify-self-start">{aField}</div>
            <div className="justify-self-center">{readoutBtn}</div>
            <div className="justify-self-end">{bField}</div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {markInBtn}
            {speedCtl}
            {restartBtn}
            {playBtn}
            {loopBtn}
            {focusBtn}
            {shareBtn}
            {markOutBtn}
          </div>
        </>
      )}
    </div>
  );
}
