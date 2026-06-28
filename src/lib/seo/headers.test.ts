import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { PORTFOLIO_ORIGINS } from "../embed/origins";

describe("public/_headers CSP", () => {
  const txt = readFileSync("public/_headers", "utf8");
  const csp = txt.match(/Content-Security-Policy:.*/)?.[0] ?? "";

  it("keeps a frame-ancestors directive listing every portfolio origin", () => {
    expect(csp).toMatch(/frame-ancestors[^;]*/);
    for (const origin of PORTFOLIO_ORIGINS) {
      expect(csp).toContain(origin);
    }
  });

  it("allows the YouTube player resources", () => {
    expect(csp).toContain("https://www.youtube.com");
    expect(csp).toContain("https://www.youtube-nocookie.com");
    expect(csp).toContain("https://i.ytimg.com");
  });

  it("sets the baseline security headers", () => {
    expect(txt).toContain("X-Content-Type-Options: nosniff");
    expect(txt).toContain("Referrer-Policy: strict-origin-when-cross-origin");
  });

  it("does not set X-Frame-Options (would break the portfolio embed)", () => {
    expect(txt).not.toMatch(/X-Frame-Options/i);
  });
});
