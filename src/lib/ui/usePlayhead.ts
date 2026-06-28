import { useEffect } from "react";
import type { RefObject } from "react";
import type { SourcePlayer } from "../player/types";
import { playheadPercent } from "./playhead";
import { formatTime } from "./formatTime";

/**
 * While `active`, writes the live playhead position as `--rt-playhead` (a %
 * string) onto `targetRef`, and — if `timeRef` is given — the formatted current
 * time as that element's text. Both update via rAF/DOM, avoiding React renders.
 */
export function usePlayhead(
  targetRef: RefObject<HTMLElement | null>,
  source: SourcePlayer | null,
  min: number,
  max: number,
  active: boolean,
  timeRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active || !source || !targetRef.current) return;
    let raf = 0;
    const el = targetRef.current;
    const loop = () => {
      const t = source.getCurrentTime();
      el.style.setProperty("--rt-playhead", `${playheadPercent(t, min, max)}%`);
      if (timeRef?.current) timeRef.current.textContent = formatTime(t, true);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [targetRef, source, min, max, active, timeRef]);
}
