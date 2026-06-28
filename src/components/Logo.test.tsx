import { describe, it, expect } from "vitest";
import { render } from "@testing-library/preact";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the RangeTube wordmark with an accessible name", () => {
    expect(render(<Logo />).getByLabelText("RangeTube")).toBeInTheDocument();
  });
});
