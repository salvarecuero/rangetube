import { describe, it, expect } from "vitest";
import { PORTFOLIO_ORIGINS } from "./origins";

describe("PORTFOLIO_ORIGINS", () => {
  it("includes apex, www, and localhost", () => {
    expect(PORTFOLIO_ORIGINS).toEqual([
      "https://salvarecuero.dev",
      "https://www.salvarecuero.dev",
      "http://localhost:4321",
    ]);
  });
});
