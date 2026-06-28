import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Transport } from "./Transport";

describe("Transport", () => {
  it("toggles play/pause", () => {
    const onPlayPause = vi.fn();
    render(
      <Transport
        playing={false}
        onPlayPause={onPlayPause}
        onRestart={() => {}}
        onFocus={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /play/i }));
    expect(onPlayPause).toHaveBeenCalled();
  });
  it("shows a pause label when playing", () => {
    render(<Transport playing onPlayPause={() => {}} onRestart={() => {}} onFocus={() => {}} />);
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });
  it("fires restart and focus", () => {
    const onRestart = vi.fn();
    const onFocus = vi.fn();
    render(<Transport playing onPlayPause={() => {}} onRestart={onRestart} onFocus={onFocus} />);
    fireEvent.click(screen.getByRole("button", { name: /restart loop/i }));
    fireEvent.click(screen.getByRole("button", { name: /focus mode/i }));
    expect(onRestart).toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();
  });
});
