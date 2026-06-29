import { useState, useId, useRef, useEffect } from "react";
import { Bookmark, Play, Trash2 } from "lucide-react";
import type { LoopState } from "../lib/share/loopState";
import type { SavedLoop, StorageLike } from "../lib/loops/types";
import { listLoops, saveLoop, removeLoop, renameLoop } from "../lib/loops/savedLoops";

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
  // renamingId: which loop is in edit mode; renameValue: the draft text.
  // We also keep a ref so blur/commit handlers always see the latest value even
  // if Preact batches state updates and closes over a stale snapshot.
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameValueRef = useRef(renameValue);
  // Guard against double-fire: jsdom sometimes triggers a second blur when an
  // input is removed from the DOM while it has focus.
  const commitingRef = useRef(false);
  // Ref for the active rename input so we can focus it programmatically
  // (avoids the jsx-a11y/no-autofocus lint rule).
  const renameInputRef = useRef<HTMLInputElement>(null);
  const nameInputId = useId();

  // Focus the rename input whenever we enter rename mode for a loop.
  useEffect(() => {
    if (renamingId) {
      renameInputRef.current?.focus();
    }
  }, [renamingId]);

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
  function startRename(loop: SavedLoop) {
    commitingRef.current = false;
    renameValueRef.current = loop.name;
    setRenamingId(loop.id);
    setRenameValue(loop.name);
  }
  function commitRename(id: string) {
    if (commitingRef.current) return;
    commitingRef.current = true;
    const next = renameValueRef.current.trim();
    if (next) {
      renameLoop(store!, id, next);
    }
    setRenamingId(null);
    renameValueRef.current = "";
    setRenameValue("");
    refresh();
  }
  function cancelRename() {
    commitingRef.current = true;
    setRenamingId(null);
    renameValueRef.current = "";
    setRenameValue("");
  }

  return (
    <section
      aria-label="Saved loops"
      className={`rounded-[var(--radius-stage)] border p-3 text-sm ${
        dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-surface"
      }`}
    >
      <div className="flex items-center gap-2">
        <label htmlFor={nameInputId} className="sr-only">
          Name this loop
        </label>
        <input
          id={nameInputId}
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
          {loops.map((loop) => {
            const isRenaming = renamingId === loop.id;
            const renameInputId = `${nameInputId}-rename-${loop.id}`;
            return (
              <li
                key={loop.id}
                className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5"
              >
                <button
                  type="button"
                  onClick={() => onApply(loop)}
                  aria-label={`Apply loop ${loop.name}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-brand-700 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                </button>

                {isRenaming ? (
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <label htmlFor={renameInputId} className="sr-only">
                      Loop name
                    </label>
                    <input
                      ref={renameInputRef}
                      id={renameInputId}
                      type="text"
                      value={renameValue}
                      onChange={(e) => {
                        renameValueRef.current = e.currentTarget.value;
                        setRenameValue(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitRename(loop.id);
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          cancelRename();
                        }
                      }}
                      onBlur={(e) => {
                        renameValueRef.current = e.currentTarget.value;
                        commitRename(loop.id);
                      }}
                      className="min-w-0 flex-1 rounded-md border border-brand-500 bg-white px-2 py-1 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startRename(loop)}
                    aria-label={`Rename loop ${loop.name}`}
                    className="min-w-0 flex-1 truncate text-left font-semibold text-ink min-h-11 flex items-center rounded-md px-1 transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {loop.name}
                  </button>
                )}

                <span className="tabular-nums text-xs text-muted">
                  {format(loop.start)}–{format(loop.end)}
                  {loop.rate !== 1 ? ` · ${loop.rate}×` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(loop.id)}
                  aria-label={`Delete loop ${loop.name}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted transition hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
