import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Readouts } from "./Readouts";

describe("Readouts", () => {
  it("shows start, loop length and end using the formatter", () => {
    render(<Readouts start={92} end={98.5} format={(s) => `${s}s`} />);
    expect(screen.getByText("Start").nextSibling).toHaveTextContent("92s");
    expect(screen.getByText("End").nextSibling).toHaveTextContent("98.5s");
    expect(screen.getByText("Loop length").nextSibling).toHaveTextContent("6.5s");
  });
});
