import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPlayer } from "./iframeApi";

function fakeYT(behavior: "ready" | "error" | "silent") {
  return {
    // Regular function (not an arrow) so it is constructable via `new YT.Player(...)`;
    // vitest 4 no longer auto-wraps mock implementations to be newable.
    Player: vi.fn().mockImplementation(function (
      _el: unknown,
      opts: {
        events: {
          onReady: (e: { target: unknown }) => void;
          onError: (e: { data: number }) => void;
        };
      },
    ) {
      const target = { _id: 1 } as never;
      if (behavior === "ready") queueMicrotask(() => opts.events.onReady({ target }));
      if (behavior === "error") queueMicrotask(() => opts.events.onError({ data: 150 }));
      return target;
    }),
  };
}

describe("createPlayer", () => {
  beforeEach(() => {
    (window as unknown as { YT: unknown }).YT = undefined;
  });

  it("resolves ok with the player on ready", async () => {
    (window as unknown as { YT: unknown }).YT = fakeYT("ready");
    const r = await createPlayer(document.createElement("div"), "abc", { timeoutMs: 50 });
    expect(r.ok).toBe(true);
  });

  it("resolves an unavailable error on YT onError 150", async () => {
    (window as unknown as { YT: unknown }).YT = fakeYT("error");
    const r = await createPlayer(document.createElement("div"), "abc", { timeoutMs: 50 });
    expect(r).toMatchObject({ ok: false, kind: "unavailable" });
  });

  it("resolves a timeout error when neither event fires", async () => {
    (window as unknown as { YT: unknown }).YT = fakeYT("silent");
    const r = await createPlayer(document.createElement("div"), "abc", { timeoutMs: 20 });
    expect(r).toMatchObject({ ok: false, kind: "timeout" });
  });
});
