export interface LogoProps {
  dark?: boolean;
}

/** RangeTube wordmark: the a (teal) and b (coral) are the loop's start/end, joined by an A→B track. */
export function Logo({ dark = false }: LogoProps) {
  const handleBg = dark ? "var(--color-focus-bg)" : "var(--color-surface)";
  return (
    <span className="inline-flex select-none flex-col gap-1.5" aria-label="RangeTube">
      <span
        aria-hidden="true"
        className={`font-logo text-[2.85rem] leading-none tracking-[-0.02em] ${dark ? "text-focus-ink" : "text-ink"}`}
      >
        R<span className="text-brand-600">a</span>ngeTu<span className="text-coral-500">b</span>e
      </span>
      <span aria-hidden="true" className="relative block h-4 w-full">
        <span
          className="absolute left-[9%] right-[9%] top-1/2 h-[5px] -translate-y-1/2 rounded-full"
          style={{ background: "linear-gradient(100deg,#0d9488,#2aa58a,#e9c46a 70%,#e76f51)" }}
        />
        <span
          className="absolute left-[9%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: handleBg, boxShadow: "0 0 0 3.5px #0d9488" }}
        />
        <span
          className="absolute left-[91%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: handleBg, boxShadow: "0 0 0 3.5px #d85a3d" }}
        />
      </span>
    </span>
  );
}
