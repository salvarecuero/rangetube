import { useEffect } from "react";
import type { RefObject } from "react";
import type { SourcePlayer } from "../player/types";
import { playheadPercent } from "./playhead";

/**
 * While `active`, writes the live playhead position as `--rt-playhead` (a %
 * string) onto `targetRef`. Avoids per-frame React renders.
 */
export function usePlayhead(
  targetRef: RefObject<HTMLElement | null>,
  source: SourcePlayer | null,
  min: number,
  max: number,
  active: boolean,
): void {
  useEffect(() => {
    if (!active || !source || !targetRef.current) return;
    let raf = 0;
    const el = targetRef.current;
    const loop = () => {
      const pct = playheadPercent(source.getCurrentTime(), min, max);
      el.style.setProperty("--rt-playhead", `${pct}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [targetRef, source, min, max, active]);
}
