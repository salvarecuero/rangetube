import { describe, it, expect } from "vitest";
import { webApplication } from "./schema";

describe("webApplication", () => {
  const obj = webApplication("https://rangetube.salvarecuero.dev");

  it("is a free WebApplication with the canonical url", () => {
    expect(obj["@type"]).toBe("WebApplication");
    expect(obj.name).toBe("RangeTube");
    expect(obj.url).toBe("https://rangetube.salvarecuero.dev/");
    expect(obj.offers.price).toBe("0");
    expect(obj.offers.priceCurrency).toBe("USD");
  });

  it("lists features and has no fabricated rating", () => {
    expect(Array.isArray(obj.featureList)).toBe(true);
    expect(obj.featureList.length).toBeGreaterThan(0);
    expect("aggregateRating" in obj).toBe(false);
  });
});
