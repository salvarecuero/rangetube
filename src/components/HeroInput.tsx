import { ArrowRight, ClipboardPaste } from "lucide-react";

export interface HeroInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
  error: string | null;
}

export function HeroInput({ value, onChange, onSubmit, onTryExample, error }: HeroInputProps) {
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text.trim());
    } catch {
      /* clipboard unavailable or denied (e.g. embedded) — user can paste manually */
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto_1fr] text-center">
      {/* Above the input — anchored to the bottom of its region so it sits just above the centered form. */}
      <div className="flex flex-col justify-end pb-7">
        <h2 className="font-display mx-auto mb-4 max-w-[18ch] text-4xl font-bold leading-[1.06] tracking-tight @md:text-5xl">
          Loop the{" "}
          <span className="bg-[image:var(--rt-grad)] bg-clip-text text-transparent">
            exact part
          </span>{" "}
          of any YouTube video
        </h2>
        <p className="mx-auto max-w-[46ch] text-base text-muted">
          Pick a start and an end, and it repeats — endlessly.
        </p>
      </div>

      {/* The input — the page's vertical anchor. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-auto flex w-full max-w-2xl gap-2 rounded-2xl border border-line bg-white p-2 shadow-lg shadow-brand-900/5"
      >
        <label htmlFor="yt-url" className="sr-only">
          YouTube video URL
        </label>
        <input
          id="yt-url"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a YouTube link (or video ID)"
          className="min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-brand-700/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:rounded-lg"
        />
        <button
          type="button"
          onClick={handlePaste}
          aria-label="Paste from clipboard"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-3.5"
        >
          <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Paste</span>
        </button>
        <button
          type="submit"
          aria-label="Load video"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[image:var(--rt-grad)] px-3.5 py-2.5 font-semibold text-brand-900 shadow-md shadow-brand-500/30 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-5"
        >
          <ArrowRight className="h-5 w-5 sm:hidden" aria-hidden="true" strokeWidth={2.5} />
          <span className="hidden sm:inline">Load</span>
        </button>
      </form>

      {/* Below the input — anchored to the top of its region so it sits just below the form. */}
      <div className="flex flex-col items-center pt-5">
        {error && (
          <p role="alert" className="mb-1 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onTryExample}
          className="mt-3 text-sm font-semibold text-brand-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 focus-visible:rounded-sm"
        >
          ▶ Try an example
        </button>
        <ul className="mx-auto mt-8 flex w-fit flex-col items-start gap-3 text-sm text-brand-800 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-6">
          {["Paste a link", "Set start & end", "Press play"].map((s, i) => (
            <li key={s} className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-line bg-white text-xs text-brand-700">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
