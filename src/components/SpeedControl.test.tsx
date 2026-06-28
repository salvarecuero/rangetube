import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import { SpeedControl } from "./SpeedControl";

describe("SpeedControl", () => {
  it("renders a button per preset inside a labelled group", () => {
    render(<SpeedControl rate={1} onRate={() => {}} />);
    expect(screen.getByRole("group", { name: /playback speed/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /0\.5/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /1\.5/ })).toBeInTheDocument();
  });

  it("marks the active rate as pressed", () => {
    render(<SpeedControl rate={0.75} onRate={() => {}} />);
    expect(screen.getByRole("button", { name: /0\.75/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^1×/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onRate when a preset is clicked", () => {
    const onRate = vi.fn();
    render(<SpeedControl rate={1} onRate={onRate} />);
    fireEvent.click(screen.getByRole("button", { name: /1\.25/ }));
    expect(onRate).toHaveBeenCalledWith(1.25);
  });
});
