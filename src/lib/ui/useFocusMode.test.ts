import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/preact";
import { useFocusMode } from "./useFocusMode";

describe("useFocusMode", () => {
  beforeEach(() => localStorage.clear());

  it("starts off and toggles", () => {
    const { result } = renderHook(() => useFocusMode());
    expect(result.current.focus).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.focus).toBe(true);
  });

  it("enters on 'f' and exits on Escape", () => {
    const { result } = renderHook(() => useFocusMode());
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "f" }));
    });
    expect(result.current.focus).toBe(true);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(result.current.focus).toBe(false);
  });

  it("persists the last choice to localStorage", () => {
    const { result } = renderHook(() => useFocusMode());
    act(() => result.current.enter());
    expect(localStorage.getItem("rt:focus")).toBe("1");
  });

  it("ignores 'f' typed into an input field", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const { result } = renderHook(() => useFocusMode());
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "f", bubbles: true }));
    });
    expect(result.current.focus).toBe(false);
    input.remove();
  });

  it("moves focus to the enter target when entering focus mode", () => {
    const playBtn = document.createElement("button");
    const focusBtn = document.createElement("button");
    document.body.append(playBtn, focusBtn);
    const enterFocusRef = { current: playBtn };
    const exitFocusRef = { current: focusBtn };

    const { result } = renderHook(() => useFocusMode({ enterFocusRef, exitFocusRef }));
    act(() => result.current.enter());

    expect(document.activeElement).toBe(playBtn);
    playBtn.remove();
    focusBtn.remove();
  });

  it("returns focus to the exit target when leaving focus mode", () => {
    const playBtn = document.createElement("button");
    const focusBtn = document.createElement("button");
    document.body.append(playBtn, focusBtn);
    const enterFocusRef = { current: playBtn };
    const exitFocusRef = { current: focusBtn };

    const { result } = renderHook(() => useFocusMode({ enterFocusRef, exitFocusRef }));
    act(() => result.current.enter());
    act(() => result.current.exit());

    expect(document.activeElement).toBe(focusBtn);
    playBtn.remove();
    focusBtn.remove();
  });

  it("does not steal focus on initial mount", () => {
    const sentinel = document.createElement("input");
    const playBtn = document.createElement("button");
    const focusBtn = document.createElement("button");
    document.body.append(sentinel, playBtn, focusBtn);
    sentinel.focus();

    renderHook(() =>
      useFocusMode({
        enterFocusRef: { current: playBtn },
        exitFocusRef: { current: focusBtn },
      }),
    );

    expect(document.activeElement).toBe(sentinel);
    sentinel.remove();
    playBtn.remove();
    focusBtn.remove();
  });
});
