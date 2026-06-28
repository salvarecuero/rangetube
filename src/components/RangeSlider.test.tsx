import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RangeSlider } from "./RangeSlider";

describe("RangeSlider", () => {
  it("renders two sliders labelled start and end", () => {
    render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={() => {}} />);
    expect(screen.getByRole("slider", { name: /loop start/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /loop end/i })).toBeInTheDocument();
  });

  it("exposes aria-valuemin/now/max on the start thumb", () => {
    render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={() => {}} />);
    const start = screen.getByRole("slider", { name: /loop start/i });
    expect(start).toHaveAttribute("aria-valuemin", "0");
    expect(start).toHaveAttribute("aria-valuenow", "10");
    expect(start).toHaveAttribute("aria-valuemax", "90");
  });

  it("marks each thumb with horizontal orientation and groups them", () => {
    render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: /loop range/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /loop start/i })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
    expect(screen.getByRole("slider", { name: /loop end/i })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("ArrowRight on the start thumb increases start by one step", () => {
    const onChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider", { name: /loop start/i }), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([11, 90]);
  });

  it("start thumb cannot cross the end thumb", () => {
    const onChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[90, 90]} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider", { name: /loop start/i }), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Home sets the start thumb to min", () => {
    const onChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider", { name: /loop start/i }), { key: "Home" });
    expect(onChange).toHaveBeenCalledWith([0, 90]);
  });

  it("enforces a minimum gap between thumbs on keyboard move", () => {
    const onChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[50, 51]} minGap={2} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider", { name: /loop start/i }), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled(); // would close the gap below 2
  });

  it("renders a track element exposing the loop fill", () => {
    render(<RangeSlider min={0} max={100} value={[20, 60]} onChange={() => {}} />);
    expect(screen.getByTestId("slider-fill")).toBeInTheDocument();
  });
});
