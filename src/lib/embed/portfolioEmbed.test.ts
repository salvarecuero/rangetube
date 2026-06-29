import { describe, it, expect, vi, afterEach } from "vitest";
import { startPortfolioReady } from "./portfolioEmbed";

afterEach(() => vi.restoreAllMocks());

describe("startPortfolioReady", () => {
  it("is a no-op when not embedded (window.parent === window)", () => {
    // jsdom: window.parent === window by default (top-level)
    const add = vi.spyOn(window, "addEventListener");
    startPortfolioReady();
    expect(add).not.toHaveBeenCalledWith("message", expect.anything());
  });
});
