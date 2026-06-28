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
});
