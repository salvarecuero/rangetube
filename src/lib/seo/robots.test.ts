import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { SITE_URL } from "../site";

describe("public/robots.txt", () => {
  const txt = readFileSync("public/robots.txt", "utf8");

  it("allows all and references the sitemap on the real domain", () => {
    expect(txt).toMatch(/User-agent: \*/);
    expect(txt).toMatch(/Allow: \//);
    expect(txt).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
  });
});
