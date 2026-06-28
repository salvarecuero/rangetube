import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Compliance } from "./Compliance";

describe("Compliance", () => {
  it("links to YouTube and states non-affiliation", () => {
    render(<Compliance />);
    const link = screen.getByRole("link", { name: /developed with youtube/i });
    expect(link).toHaveAttribute("href", "https://www.youtube.com");
    expect(screen.getByText(/not affiliated/i)).toBeInTheDocument();
  });
});
