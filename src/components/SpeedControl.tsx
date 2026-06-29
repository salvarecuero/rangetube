import { Minus, Plus } from "lucide-react";
import { stepSpeed, isSpeedAtEnd } from "../lib/ui/speed";

export interface SpeedControlProps {
  rate: number;
  onRate: (rate: number) => void;
  dark?: boolean;
}

export function SpeedControl({ rate, onRate, dark = false }: SpeedControlProps) {
  const stepBtn = `grid h-9 w-9 place-items-center rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40 ${
    dark ? "text-focus-muted enabled:hover:text-focus-ink" : "text-muted enabled:hover:text-ink"
  }`;

  return (
    <div
      role="group"
      aria-label="Playback speed"
      className={`inline-flex items-center gap-0.5 rounded-xl border p-0.5 ${
        dark ? "border-white/12 bg-white/[0.06]" : "border-line bg-white"
      }`}
    >
      <button
        type="button"
        aria-label="Slower"
        disabled={isSpeedAtEnd(rate, -1)}
        onClick={() => onRate(stepSpeed(rate, -1))}
        className={stepBtn}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={`min-w-[2.75rem] text-center text-xs font-semibold tabular-nums ${
          dark ? "text-brand-300" : "text-brand-700"
        }`}
      >
        {rate}×
      </span>
      <button
        type="button"
        aria-label="Faster"
        disabled={isSpeedAtEnd(rate, 1)}
        onClick={() => onRate(stepSpeed(rate, 1))}
        className={stepBtn}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
