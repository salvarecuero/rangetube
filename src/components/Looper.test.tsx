import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Looper } from "./Looper";

describe("Looper", () => {
  it("renders the hero input on first paint", () => {
    render(<Looper />);
    expect(screen.getByRole("button", { name: /^load$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/youtube link/i)).toBeInTheDocument();
  });

  it("always shows the compliance attribution", () => {
    render(<Looper />);
    expect(screen.getByRole("link", { name: /developed with youtube/i })).toBeInTheDocument();
  });
});
