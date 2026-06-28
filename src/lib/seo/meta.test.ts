import { describe, it, expect } from "vitest";
import { buildHeadMeta } from "./meta";

const SITE = "https://rangetube.salvarecuero.dev";

describe("buildHeadMeta", () => {
  it("builds absolute canonical and og url from pathname", () => {
    const m = buildHeadMeta({
      title: "T",
      description: "D",
      site: SITE,
      pathname: "/privacy",
    });
    expect(m.canonical).toBe("https://rangetube.salvarecuero.dev/privacy");
    expect(m.ogUrl).toBe("https://rangetube.salvarecuero.dev/privacy");
  });

  it("defaults og image to /og.png made absolute", () => {
    const m = buildHeadMeta({ title: "T", description: "D", site: SITE, pathname: "/" });
    expect(m.ogImage).toBe("https://rangetube.salvarecuero.dev/og.png");
    expect(m.ogType).toBe("website");
    expect(m.noindex).toBe(false);
  });

  it("passes through noindex and a custom og image", () => {
    const m = buildHeadMeta({
      title: "T",
      description: "D",
      site: SITE,
      pathname: "/x",
      ogImage: "/share/x.png",
      noindex: true,
    });
    expect(m.ogImage).toBe("https://rangetube.salvarecuero.dev/share/x.png");
    expect(m.noindex).toBe(true);
  });

  it("throws if site is missing", () => {
    // @ts-expect-error intentionally invalid
    expect(() => buildHeadMeta({ title: "T", description: "D", pathname: "/" })).toThrow();
  });
});
