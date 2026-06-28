import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import { createRef } from "react";
import { ControlDeck } from "./ControlDeck";

function props(over: Partial<React.ComponentProps<typeof ControlDeck>> = {}) {
  return {
    min: 0,
    max: 100,
    range: [10, 40] as [number, number],
    playing: false,
    trackRef: createRef<HTMLDivElement>(),
    currentTimeRef: createRef<HTMLSpanElement>(),
    onCommit: () => {},
    onPreview: () => {},
    onScrubStart: () => {},
    onSeek: () => {},
    onPlayPause: () => {},
    onRestart: () => {},
    onFocus: () => {},
    onToggleTimeMode: () => {},
    onToggleLoop: () => {},
    looping: true,
    focusActive: false,
    timeMode: "video" as const,
    format: (s: number) => `${s}s`,
    ...over,
  };
}

describe("ControlDeck", () => {
  it("renders the slider, play, editable A/B fields, restart and focus", () => {
    render(<ControlDeck {...props()} />);
    expect(screen.getByRole("group", { name: /loop range/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /loop start/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /loop end/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restart loop/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /focus mode/i })).toBeInTheDocument();
  });

  it("hides the focus button when showFocusButton is false", () => {
    render(<ControlDeck {...props({ showFocusButton: false })} />);
    expect(screen.queryByRole("button", { name: /focus mode/i })).not.toBeInTheDocument();
  });

  it("shows time in video by default with the total as denominator", () => {
    render(<ControlDeck {...props({ timeMode: "video" })} />);
    expect(screen.getByText(/in video/i)).toBeInTheDocument();
    expect(screen.getByText("100s")).toBeInTheDocument(); // total duration
  });

  it("shows time in loop with the loop length as denominator", () => {
    render(<ControlDeck {...props({ timeMode: "loop" })} />);
    expect(screen.getByText(/in loop/i)).toBeInTheDocument();
    expect(screen.getByText("30s")).toBeInTheDocument(); // 40 - 10
  });

  it("toggles the time mode when the readout is clicked", () => {
    const onToggleTimeMode = vi.fn();
    render(<ControlDeck {...props({ onToggleTimeMode })} />);
    fireEvent.click(screen.getByRole("button", { name: /switch time readout/i }));
    expect(onToggleTimeMode).toHaveBeenCalled();
  });

  it("commits a new start when the A field is edited", () => {
    const onCommit = vi.fn();
    render(<ControlDeck {...props({ onCommit })} />);
    const a = screen.getByRole("textbox", { name: /loop start/i });
    fireEvent.change(a, { target: { value: "20" } });
    fireEvent.keyDown(a, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith([20, 40]);
  });

  it("commits a new end when the B field is edited", () => {
    const onCommit = vi.fn();
    render(<ControlDeck {...props({ onCommit })} />);
    const b = screen.getByRole("textbox", { name: /loop end/i });
    fireEvent.change(b, { target: { value: "60" } });
    fireEvent.keyDown(b, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith([10, 60]);
  });

  it("exposes the loop button as a pressed toggle when looping", () => {
    render(<ControlDeck {...props({ looping: true })} />);
    const loop = screen.getByRole("button", { name: /toggle loop/i });
    expect(loop).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the loop toggle as not pressed when looping is off", () => {
    render(<ControlDeck {...props({ looping: false })} />);
    expect(screen.getByRole("button", { name: /toggle loop/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("toggles looping when the loop button is clicked", () => {
    const onToggleLoop = vi.fn();
    render(<ControlDeck {...props({ onToggleLoop })} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle loop/i }));
    expect(onToggleLoop).toHaveBeenCalled();
  });

  it("reflects focus-mode state on the focus toggle", () => {
    render(<ControlDeck {...props({ focusActive: true })} />);
    expect(screen.getByRole("button", { name: /focus mode/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows the speed control only when the source supports speed", () => {
    const onRate = vi.fn();
    const { rerender } = render(<ControlDeck {...props({ canSetSpeed: false, rate: 1, onRate })} />);
    expect(screen.queryByRole("group", { name: /playback speed/i })).not.toBeInTheDocument();

    rerender(<ControlDeck {...props({ canSetSpeed: true, rate: 1, onRate })} />);
    expect(screen.getByRole("group", { name: /playback speed/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /1\.5/ }));
    expect(onRate).toHaveBeenCalledWith(1.5);
  });
});
