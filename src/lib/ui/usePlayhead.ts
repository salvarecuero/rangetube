import { useEffect } from "react";
import type { RefObject } from "react";
import type { SourcePlayer } from "../player/types";
import { playheadPercent, playheadTimeText, type TimeMode } from "./playhead";

/**
 * While `active`, writes the live playhead position as `--rt-playhead` (a %
 * string) onto `targetRef`, and — if `timeRef` is given — the current-time
 * numerator as that element's text (absolute, or loop-relative from
 * `rangeStart`, per `timeMode`). Both update via rAF/DOM, avoiding React renders.
 */
export function usePlayhead(
  targetRef: RefObject<HTMLElement | null>,
  source: SourcePlayer | null,
  min: number,
  max: number,
  active: boolean,
  timeRef?: RefObject<HTMLElement | null>,
  timeMode: TimeMode = "video",
  rangeStart = 0,
): void {
  useEffect(() => {
    if (!active || !source || !targetRef.current) return;
    let raf = 0;
    const el = targetRef.current;
    const loop = () => {
      const t = source.getCurrentTime();
      el.style.setProperty("--rt-playhead", `${playheadPercent(t, min, max)}%`);
      if (timeRef?.current) timeRef.current.textContent = playheadTimeText(t, rangeStart, timeMode);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [targetRef, source, min, max, active, timeRef, timeMode, rangeStart]);
}
