import { describe, it, expect, beforeEach } from "vitest";
import type { StorageLike } from "./types";
import { listLoops, saveLoop, renameLoop, removeLoop } from "./savedLoops";

function memStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
  };
}

const VID = "dQw4w9WgXcQ";
const OTHER = "abcdefghijk";
let store: StorageLike;
beforeEach(() => {
  store = memStorage();
});

describe("savedLoops", () => {
  it("returns an empty list for an unknown video", () => {
    expect(listLoops(store, VID)).toEqual([]);
  });

  it("saves a loop and lists it back for its video only", () => {
    const saved = saveLoop(store, { videoId: VID, start: 1, end: 5, rate: 1 }, "Chorus");
    expect(saved.name).toBe("Chorus");
    expect(saved.id).toBeTruthy();
    expect(listLoops(store, VID)).toHaveLength(1);
    expect(listLoops(store, OTHER)).toEqual([]);
  });

  it("lists newest first", () => {
    const a = saveLoop(store, { videoId: VID, start: 0, end: 1, rate: 1 }, "A");
    const b = saveLoop(store, { videoId: VID, start: 2, end: 3, rate: 1 }, "B");
    expect(listLoops(store, VID).map((l) => l.id)).toEqual([b.id, a.id]);
  });

  it("renames a loop", () => {
    const s = saveLoop(store, { videoId: VID, start: 1, end: 5, rate: 1 }, "Old");
    renameLoop(store, s.id, "New");
    expect(listLoops(store, VID)[0].name).toBe("New");
  });

  it("removes a loop", () => {
    const s = saveLoop(store, { videoId: VID, start: 1, end: 5, rate: 1 }, "Gone");
    removeLoop(store, s.id);
    expect(listLoops(store, VID)).toEqual([]);
  });

  it("tolerates corrupt storage by returning an empty list", () => {
    store.setItem("rangetube.savedLoops", "{not json");
    expect(listLoops(store, VID)).toEqual([]);
  });
});
