import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroInput } from "./HeroInput";

describe("HeroInput", () => {
  it("submits the typed value", () => {
    const onSubmit = vi.fn();
    render(
      <HeroInput
        value="abc"
        onChange={() => {}}
        onSubmit={onSubmit}
        onTryExample={() => {}}
        error={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /load video/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
  it("shows an inline error when provided", () => {
    render(
      <HeroInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onTryExample={() => {}}
        error="That doesn't look like a YouTube link."
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/youtube link/i);
  });
  it("fires onTryExample", () => {
    const onTryExample = vi.fn();
    render(
      <HeroInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onTryExample={onTryExample}
        error={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /try an example/i }));
    expect(onTryExample).toHaveBeenCalled();
  });
});
