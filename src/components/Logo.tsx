export interface LogoProps {
  dark?: boolean;
  /** Smaller wordmark + track, for the player view where vertical space is tight. */
  compact?: boolean;
}

/** RangeTube wordmark: the a (teal) and b (coral) are the loop's start/end, joined by an A→B track. */
export function Logo({ dark = false, compact = false }: LogoProps) {
  const handleBg = dark ? "var(--color-focus-bg)" : "var(--color-surface)";
  const ring = compact ? 3 : 3.5;
  return (
    <span
      className={`inline-flex select-none flex-col ${compact ? "gap-1" : "gap-1.5"}`}
      aria-label="RangeTube"
    >
      <span
        aria-hidden="true"
        className={`font-logo leading-none tracking-[-0.02em] ${
          compact ? "text-2xl" : "text-[2.1rem] sm:text-[2.85rem]"
        } ${dark ? "text-focus-ink" : "text-ink"}`}
      >
        R<span className="text-brand-600">a</span>ngeTu<span className="text-coral-500">b</span>e
      </span>
      <span aria-hidden="true" className={`relative block w-full ${compact ? "h-3" : "h-4"}`}>
        <span
          className="absolute left-[9%] right-[9%] top-1/2 h-[5px] -translate-y-1/2 rounded-full"
          style={{ background: "linear-gradient(100deg,#0d9488,#2aa58a,#e9c46a 70%,#e76f51)" }}
        />
        <span
          className={`absolute left-[9%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            compact ? "h-3 w-3" : "h-4 w-4"
          }`}
          style={{ background: handleBg, boxShadow: `0 0 0 ${ring}px #0d9488` }}
        />
        <span
          className={`absolute left-[91%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            compact ? "h-3 w-3" : "h-4 w-4"
          }`}
          style={{ background: handleBg, boxShadow: `0 0 0 ${ring}px #d85a3d` }}
        />
      </span>
    </span>
  );
}
