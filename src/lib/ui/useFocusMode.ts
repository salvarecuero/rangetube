import { useCallback, useEffect, useState } from "react";

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

export function useFocusMode(): FocusMode {
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
