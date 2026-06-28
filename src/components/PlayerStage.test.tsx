import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { PlayerStage } from "./PlayerStage";

describe("PlayerStage", () => {
  it("renders a loading status region when loading", () => {
    render(<PlayerStage status="loading" hostRef={createRef()} error={null} onRetry={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  });
  it("renders an error message with a retry when error", () => {
    render(
      <PlayerStage
        status="error"
        hostRef={createRef()}
        error={{ kind: "network", message: "Couldn't load the video." }}
        onRetry={() => {}}
      />,
    );
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
