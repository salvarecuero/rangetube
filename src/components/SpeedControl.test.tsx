import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import { SpeedControl } from "./SpeedControl";

describe("SpeedControl", () => {
  it("renders a stepper inside a labelled group and shows the active rate", () => {
    render(<SpeedControl rate={1} onRate={() => {}} />);
    expect(screen.getByRole("group", { name: /playback speed/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /slower/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /faster/i })).toBeInTheDocument();
    expect(screen.getByText("1×")).toBeInTheDocument();
  });

  it("steps up to the next preset", () => {
    const onRate = vi.fn();
    render(<SpeedControl rate={1} onRate={onRate} />);
    fireEvent.click(screen.getByRole("button", { name: /faster/i }));
    expect(onRate).toHaveBeenCalledWith(1.25);
  });

  it("steps down to the previous preset", () => {
    const onRate = vi.fn();
    render(<SpeedControl rate={1} onRate={onRate} />);
    fireEvent.click(screen.getByRole("button", { name: /slower/i }));
    expect(onRate).toHaveBeenCalledWith(0.75);
  });

  it("disables slower at the minimum preset", () => {
    render(<SpeedControl rate={0.5} onRate={() => {}} />);
    expect(screen.getByRole("button", { name: /slower/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /faster/i })).not.toBeDisabled();
  });

  it("disables faster at the maximum preset", () => {
    render(<SpeedControl rate={1.5} onRate={() => {}} />);
    expect(screen.getByRole("button", { name: /faster/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /slower/i })).not.toBeDisabled();
  });
});
