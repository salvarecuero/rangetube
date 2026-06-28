export interface ReadoutsProps {
  start: number;
  end: number;
  format: (seconds: number) => string;
  variant?: "light" | "dark";
}

export function Readouts({ start, end, format, variant = "light" }: ReadoutsProps) {
  const dark = variant === "dark";
  const cells: Array<{ k: string; v: string; accent?: boolean }> = [
    { k: "Start", v: format(start) },
    { k: "Loop length", v: format(Math.max(0, end - start)), accent: true },
    { k: "End", v: format(end) },
  ];
  return (
    <div className="flex gap-2.5">
      {cells.map((c) => (
        <div
          key={c.k}
          className={`flex-1 rounded-[14px] border px-3.5 py-2.5 ${
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
            className={`text-[10.5px] font-semibold uppercase tracking-wider ${dark ? "text-focus-muted" : "text-muted"}`}
          >
            {c.k}
          </div>
          <div
            className={`tabnum mt-0.5 text-xl ${
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
