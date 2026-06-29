import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const KEY = "rt:focus";

export function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export interface FocusMode {
  focus: boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
}

export interface FocusModeOptions {
  /** Control to focus when entering focus mode (the play/pause button). */
  enterFocusRef?: RefObject<HTMLElement | null>;
  /** Control to focus when leaving focus mode (the focus-mode toggle). */
  exitFocusRef?: RefObject<HTMLElement | null>;
}

export function useFocusMode({ enterFocusRef, exitFocusRef }: FocusModeOptions = {}): FocusMode {
  const [focus, setFocus] = useState(false);

  const enter = useCallback(() => {
    setFocus(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable (e.g. embedded) — non-fatal */
    }
  }, []);

  const exit = useCallback(() => {
    setFocus(false);
    try {
      localStorage.setItem(KEY, "0");
    } catch {
      /* non-fatal */
    }
  }, []);

  const toggle = useCallback(() => (focus ? exit() : enter()), [focus, enter, exit]);

  // Move focus to a sensible control on each transition so keyboard users land
  // somewhere useful: the play/pause button on enter, the focus toggle on exit.
  // We never trap focus — this is a one-time move; Tab and Esc keep working.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return; // don't steal focus on initial mount
    }
    const target = focus ? enterFocusRef?.current : exitFocusRef?.current;
    target?.focus();
  }, [focus, enterFocusRef, exitFocusRef]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        exit();
        return;
      }
      if (
        (e.key === "f" || e.key === "F") &&
        !isTypingTarget(e.target) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, exit]);

  return { focus, enter, exit, toggle };
}
