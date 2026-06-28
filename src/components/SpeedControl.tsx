import { SPEED_PRESETS } from "../lib/share/loopState";

export interface SpeedControlProps {
  rate: number;
  onRate: (rate: number) => void;
  dark?: boolean;
}

export function SpeedControl({ rate, onRate, dark = false }: SpeedControlProps) {
  return (
    <div
      role="group"
      aria-label="Playback speed"
      className={`inline-flex items-center gap-0.5 rounded-xl border p-0.5 ${
        dark ? "border-white/12 bg-white/[0.06]" : "border-line bg-white"
      }`}
    >
      {SPEED_PRESETS.map((preset) => {
        const active = preset === rate;
        return (
          <button
            key={preset}
            type="button"
            aria-label={`${preset}× speed`}
            aria-pressed={active}
            onClick={() => onRate(preset)}
            className={`min-w-[2.5rem] rounded-lg px-2 py-1.5 text-xs font-semibold tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
              active
                ? dark
                  ? "bg-brand-500/20 text-brand-300"
                  : "bg-brand-50 text-brand-700"
                : dark
                  ? "text-focus-muted hover:text-focus-ink"
                  : "text-muted hover:text-ink"
            }`}
          >
            {preset}×
          </button>
        );
      })}
    </div>
  );
}
