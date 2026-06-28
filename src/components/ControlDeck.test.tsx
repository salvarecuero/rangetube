import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { ControlDeck } from "./ControlDeck";
import { formatTime } from "../lib/ui/formatTime";

function props() {
  return {
    min: 0,
    max: 100,
    range: [10, 40] as [number, number],
    playing: false,
    trackRef: createRef<HTMLDivElement>(),
    onCommit: () => {},
    onPreview: () => {},
    onPlayPause: () => {},
    onRestart: () => {},
    onFocus: () => {},
    format: (s: number) => formatTime(s, true),
  };
}

describe("ControlDeck", () => {
  it("renders readouts, slider and transport together", () => {
    render(<ControlDeck {...props()} />);
    expect(screen.getByRole("group", { name: /loop range/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(screen.getByText("Loop length")).toBeInTheDocument();
  });
});
