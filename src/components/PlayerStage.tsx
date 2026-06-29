import type { RefObject } from "react";

export type StageStatus = "loading" | "ready" | "error";
export interface StageError {
  kind: "invalid" | "unavailable" | "network";
  message: string;
}

export interface PlayerStageProps {
  status: StageStatus;
  hostRef: RefObject<HTMLDivElement | null>;
  error: StageError | null;
  onRetry: () => void;
}

export function PlayerStage({ status, hostRef, error, onRetry }: PlayerStageProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-stage)] bg-brand-900 shadow-2xl shadow-brand-900/25">
      {/* YT.Player replaces the inner mount node with an <iframe>, copying its
          class/id. So the mount carries no sizing/visibility class to inherit;
          the wrapper forces the resulting iframe to fill the 16:9 stage. */}
      <div className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full">
        <div ref={hostRef} />
      </div>
      {status === "loading" && (
        <div role="status" className="absolute inset-0 grid place-items-center text-brand-100">
          <span className="flex items-center gap-3 text-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-300 border-t-transparent" />
            Loading…
          </span>
        </div>
      )}
      {status === "error" && error && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-brand-100">
          <div>
            <p className="mb-3 max-w-sm text-sm">{error.message}</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg border border-brand-300/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {error.kind === "unavailable" ? "Try another video" : "Retry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
