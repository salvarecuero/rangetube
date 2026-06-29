import type { LoopState } from "../share/loopState";

/** Minimal Storage surface we depend on (injectable for tests). */
export type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** A persisted, named loop for a specific video. */
export interface SavedLoop extends LoopState {
  id: string;
  name: string;
  createdAt: number;
}
