import type { LoopState } from "../share/loopState";
import type { SavedLoop, StorageLike } from "./types";

const KEY = "rangetube.savedLoops";

function readAll(storage: StorageLike): SavedLoop[] {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedLoop[]) : [];
  } catch {
    return [];
  }
}

function writeAll(storage: StorageLike, loops: SavedLoop[]): void {
  try {
    storage.setItem(KEY, JSON.stringify(loops));
  } catch {
    /* storage full / unavailable — best-effort */
  }
}

/** Loops for one video, newest first. */
export function listLoops(storage: StorageLike, videoId: string): SavedLoop[] {
  const allLoops = readAll(storage);
  const filtered = allLoops.filter((l) => l.videoId === videoId);
  // Sort by createdAt descending, but stable-sort ties by reverse insertion order.
  return filtered.sort((a, b) => {
    const createdDiff = b.createdAt - a.createdAt;
    if (createdDiff !== 0) return createdDiff;
    // Tie: maintain reverse insertion order by index in full list.
    return allLoops.indexOf(b) - allLoops.indexOf(a);
  });
}

/** Persist a new named loop and return it. */
export function saveLoop(storage: StorageLike, state: LoopState, name: string): SavedLoop {
  const loop: SavedLoop = {
    ...state,
    id: crypto.randomUUID(),
    name: name.trim() || "Untitled loop",
    createdAt: Date.now(),
  };
  writeAll(storage, [...readAll(storage), loop]);
  return loop;
}

export function renameLoop(storage: StorageLike, id: string, name: string): void {
  writeAll(
    storage,
    readAll(storage).map((l) => (l.id === id ? { ...l, name: name.trim() || l.name } : l)),
  );
}

export function removeLoop(storage: StorageLike, id: string): void {
  writeAll(
    storage,
    readAll(storage).filter((l) => l.id !== id),
  );
}
