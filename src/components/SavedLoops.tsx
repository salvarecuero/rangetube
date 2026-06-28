import { useState } from "react";
import { Bookmark, Play, Trash2 } from "lucide-react";
import type { LoopState } from "../lib/share/loopState";
import type { SavedLoop, StorageLike } from "../lib/loops/types";
import { listLoops, saveLoop, removeLoop } from "../lib/loops/savedLoops";

export interface SavedLoopsProps {
  videoId: string;
  current: LoopState;
  onApply: (state: LoopState) => void;
  format: (seconds: number) => string;
  storage?: StorageLike;
  dark?: boolean;
}

export function SavedLoops({
  videoId,
  current,
  onApply,
  format,
  storage,
  dark = false,
}: SavedLoopsProps) {
  const store = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  const [loops, setLoops] = useState<SavedLoop[]>(() => (store ? listLoops(store, videoId) : []));
  const [name, setName] = useState("");

  if (!store) return null;

  function refresh() {
    setLoops(listLoops(store!, videoId));
  }
  function onSave() {
    saveLoop(store!, current, name);
    setName("");
    refresh();
  }
  function onDelete(id: string) {
    removeLoop(store!, id);
    refresh();
  }

  return (
    <section
      aria-label="Saved loops"
      className={`rounded-[var(--radius-stage)] border p-3 text-sm ${
        dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-surface"
      }`}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="loop-name" className="sr-only">
          Name this loop
        </label>
        <input
          id="loop-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Name this loop"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        />
        <button
          type="button"
          onClick={onSave}
          aria-label="Save current loop"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[image:var(--rt-grad)] px-3 py-1.5 text-sm font-semibold text-brand-900 shadow transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Save loop
        </button>
      </div>

      {loops.length === 0 ? (
        <p className="mt-3 text-center text-xs text-muted">No saved loops for this video yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {loops.map((loop) => (
            <li
              key={loop.id}
              className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5"
            >
              <button
                type="button"
                onClick={() => onApply(loop)}
                aria-label={`Apply loop ${loop.name}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-brand-700 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-0 flex-1 truncate font-semibold text-ink">{loop.name}</span>
              <span className="tabular-nums text-xs text-muted">
                {format(loop.start)}–{format(loop.end)}
                {loop.rate !== 1 ? ` · ${loop.rate}×` : ""}
              </span>
              <button
                type="button"
                onClick={() => onDelete(loop.id)}
                aria-label={`Delete loop ${loop.name}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
