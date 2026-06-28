import { Play, Pause, RotateCcw, Repeat, Maximize2 } from "lucide-react";

export interface TransportProps {
  playing: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onFocus: () => void;
  /** Hide the focus button in focus mode (Esc/F still work). */
  showFocusButton?: boolean;
}

const iconBtn =
  "grid h-11 w-11 place-items-center rounded-[14px] border border-line bg-white text-brand-700 transition hover:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export function Transport({
  playing,
  onPlayPause,
  onRestart,
  onFocus,
  showFocusButton = true,
}: TransportProps) {
  return (
    <div className="flex items-center justify-center gap-3.5">
      <button type="button" onClick={onRestart} aria-label="Restart loop" className={iconBtn}>
        <RotateCcw className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onPlayPause}
        aria-label={playing ? "Pause" : "Play"}
        className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[image:var(--rt-grad)] text-brand-900 shadow-lg shadow-brand-500/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {playing ? (
          <Pause className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Play className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
      <span
        role="img"
        aria-label="Loop on"
        title="Loop on"
        className={`${iconBtn} cursor-default text-brand-600`}
      >
        <Repeat className="h-5 w-5" aria-hidden="true" />
      </span>
      {showFocusButton && (
        <button type="button" onClick={onFocus} aria-label="Focus mode" className={iconBtn}>
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
