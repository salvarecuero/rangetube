import { type KeyboardEvent, useRef, useState } from "react";
import { parseTime } from "../lib/ui/formatTime";

export interface TimeFieldProps {
  /** Short visible label, e.g. "A" or "B". */
  label: string;
  /** Accessible name for the input, e.g. "Loop start". */
  ariaLabel: string;
  /** Current value in seconds (source of truth — also updated by slider drags). */
  seconds: number;
  /** Clamp bounds for a committed value. */
  min: number;
  max: number;
  format: (seconds: number) => string;
  /** Commit a new (already in-range request) value, clamped to [min,max]. */
  onCommit: (seconds: number) => void;
  variant?: "start" | "end";
  dark?: boolean;
}

export function TimeField({
  label,
  ariaLabel,
  seconds,
  min,
  max,
  format,
  onCommit,
  variant = "start",
  dark = false,
}: TimeFieldProps) {
  const [text, setText] = useState(() => format(seconds));
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBlur = useRef(false);

  // Re-sync the display when the underlying value changes (e.g. a slider drag)
  // using React's "adjust state during render" pattern. Typing never changes
  // `seconds`, so an in-progress edit is never clobbered.
  const [syncedSeconds, setSyncedSeconds] = useState(seconds);
  if (seconds !== syncedSeconds) {
    setSyncedSeconds(seconds);
    setText(format(seconds));
  }

  function commit() {
    const parsed = parseTime(text);
    if (parsed === null) {
      setText(format(seconds));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onCommit(clamped);
    setText(format(clamped));
  }

  function revert() {
    setText(format(seconds));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      skipBlur.current = true;
      revert();
      inputRef.current?.blur();
    }
  }

  function onBlur() {
    if (skipBlur.current) {
      skipBlur.current = false;
      return;
    }
    commit();
  }

  const start = variant === "start";
  const labelColor = start
    ? dark
      ? "text-brand-300"
      : "text-brand-700"
    : dark
      ? "text-coral-500"
      : "text-coral-600";
  const dotColor = start ? "var(--color-brand-600)" : "var(--color-coral-600)";
  const focusRing = start ? "focus:border-brand-500" : "focus:border-coral-600";

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: dotColor }}
        aria-hidden="true"
      />
      <span className={`font-bold ${labelColor}`} aria-hidden="true">
        {label}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`tabnum w-[4.2rem] rounded-md border border-transparent px-1.5 py-0.5 text-center text-[12.5px] font-semibold outline-none ${
          dark
            ? "border-b-white/25 text-focus-ink hover:bg-white/5 focus:bg-white/10"
            : "border-b-line text-ink hover:bg-brand-50/60 focus:bg-white"
        } border-b-[1.5px] border-dashed ${focusRing} focus:border-solid`}
      />
    </span>
  );
}
