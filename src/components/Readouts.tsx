export interface ReadoutsProps {
  start: number;
  end: number;
  format: (seconds: number) => string;
  variant?: "light" | "dark";
}

export function Readouts({ start, end, format, variant = "light" }: ReadoutsProps) {
  const dark = variant === "dark";
  const cells: Array<{ k: string; v: string; accent?: boolean; dot?: string }> = [
    { k: "Start (A)", v: format(start), dot: "var(--color-brand-600)" },
    { k: "Loop length", v: format(Math.max(0, end - start)), accent: true },
    { k: "End (B)", v: format(end), dot: "var(--color-coral-600)" },
  ];
  return (
    <div className="flex flex-col gap-2 @sm:flex-row @sm:flex-wrap @sm:justify-center">
      {cells.map((c) => (
        <div
          key={c.k}
          className={`rounded-[14px] border px-3.5 py-2 @sm:flex-none @sm:min-w-[7rem] ${
            c.accent
              ? dark
                ? "border-transparent bg-brand-500/15"
                : "border-transparent bg-brand-50"
              : dark
                ? "border-white/10 bg-white/5"
                : "border-line bg-white"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider ${dark ? "text-focus-muted" : "text-muted"}`}
          >
            {c.dot && (
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: c.dot }} />
            )}
            {c.k}
          </div>
          <div
            className={`tabnum mt-0.5 text-lg ${
              c.accent
                ? dark
                  ? "text-brand-300"
                  : "text-brand-700"
                : dark
                  ? "text-focus-ink"
                  : "text-ink"
            }`}
          >
            {c.v}
          </div>
        </div>
      ))}
    </div>
  );
}
