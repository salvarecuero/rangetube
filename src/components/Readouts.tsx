export interface ReadoutsProps {
  start: number;
  end: number;
  format: (seconds: number) => string;
}

export function Readouts({ start, end, format }: ReadoutsProps) {
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
            c.accent ? "border-transparent bg-brand-50" : "border-line bg-white"
          }`}
        >
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">
            {c.k}
          </div>
          <div className={`tabnum mt-0.5 text-xl ${c.accent ? "text-brand-700" : "text-ink"}`}>
            {c.v}
          </div>
        </div>
      ))}
    </div>
  );
}
