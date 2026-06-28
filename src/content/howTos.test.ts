import { describe, it, expect } from "vitest";
import { HOW_TOS } from "./howTos";
import { USE_CASES } from "./useCases";
import { HOWTO_LINKS } from "../lib/site";

describe("HOW_TOS content data", () => {
  it("has exactly the 4 expected, unique slugs in order", () => {
    const slugs = HOW_TOS.map((h) => h.slug);
    expect(slugs).toEqual([
      "loop-a-section-of-a-youtube-video",
      "ab-loop-youtube",
      "slow-down-a-youtube-video",
      "loop-youtube-on-mobile",
    ]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has all required fields non-empty for every entry", () => {
    for (const h of HOW_TOS) {
      expect(h.navLabel.trim()).not.toBe("");
      expect(h.h1.trim()).not.toBe("");
      expect(h.metaTitle.trim()).not.toBe("");
      expect(h.metaDescription.trim()).not.toBe("");
      expect(h.intro.trim()).not.toBe("");
    }
  });

  it("has 3-5 steps, each with a non-empty name and text", () => {
    for (const h of HOW_TOS) {
      expect(h.steps.length).toBeGreaterThanOrEqual(3);
      expect(h.steps.length).toBeLessThanOrEqual(5);
      for (const s of h.steps) {
        expect(s.name.trim()).not.toBe("");
        expect(s.text.trim()).not.toBe("");
      }
    }
  });

  it("keeps meta titles within a sane length budget (<= 62 chars)", () => {
    for (const h of HOW_TOS) {
      expect(h.metaTitle.length).toBeLessThanOrEqual(62);
    }
  });

  it("links each guide to at least one existing use-case page", () => {
    const useCaseSlugs = new Set(USE_CASES.map((u) => u.slug));
    for (const h of HOW_TOS) {
      expect(h.relatedUseCases.length).toBeGreaterThan(0);
      for (const slug of h.relatedUseCases) {
        expect(useCaseSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("HOWTO_LINKS covers exactly the HOW_TOS slugs", () => {
    const linkSlugs = HOWTO_LINKS.map((l) => l.href.replace("/how-to/", ""));
    expect(linkSlugs).toEqual(HOW_TOS.map((h) => h.slug));
  });
});
