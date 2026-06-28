import { describe, it, expect } from "vitest";
import { USE_CASES } from "./useCases";
import { USE_CASE_LINKS } from "../lib/site";

describe("USE_CASES content data", () => {
  it("has exactly the 4 expected, unique slugs", () => {
    const slugs = USE_CASES.map((u) => u.slug);
    expect(slugs).toEqual(["musicians", "language-learners", "dancers", "students"]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has all required fields non-empty for every entry", () => {
    for (const u of USE_CASES) {
      expect(u.audience.trim()).not.toBe("");
      expect(u.h1.trim()).not.toBe("");
      expect(u.metaTitle.trim()).not.toBe("");
      expect(u.metaDescription.trim()).not.toBe("");
      expect(u.subhead.trim()).not.toBe("");
    }
  });

  it("has 3-4 why-bullets, exactly 3 steps, and 3-5 FAQ entries", () => {
    for (const u of USE_CASES) {
      expect(u.whyBullets.length).toBeGreaterThanOrEqual(3);
      expect(u.whyBullets.length).toBeLessThanOrEqual(4);
      expect(u.steps).toHaveLength(3);
      expect(u.faq.length).toBeGreaterThanOrEqual(3);
      expect(u.faq.length).toBeLessThanOrEqual(5);
      for (const f of u.faq) {
        expect(f.q.trim()).not.toBe("");
        expect(f.a.trim()).not.toBe("");
      }
    }
  });

  it("keeps meta titles within a sane length budget (<= 62 chars)", () => {
    for (const u of USE_CASES) {
      expect(u.metaTitle.length).toBeLessThanOrEqual(62);
    }
  });

  it("USE_CASE_LINKS covers exactly the USE_CASES slugs", () => {
    const linkSlugs = USE_CASE_LINKS.map((l) => l.href.replace("/for/", ""));
    expect(linkSlugs).toEqual(USE_CASES.map((u) => u.slug));
  });
});
