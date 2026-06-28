export interface HeroInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
  error: string | null;
}

export function HeroInput({ value, onChange, onSubmit, onTryExample, error }: HeroInputProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
        No ads · no signup · just the clip and you
      </span>
      <h2 className="mx-auto mb-4 max-w-[14ch] text-4xl font-extrabold leading-[1.05] tracking-tight @md:text-5xl">
        Loop the{" "}
        <span className="bg-[image:var(--rt-grad)] bg-clip-text text-transparent">exact part</span>{" "}
        of any video. Endlessly.
      </h2>
      <p className="mx-auto mb-7 max-w-[46ch] text-base text-muted">
        Paste a YouTube link, drag two handles to pick a section, and it repeats forever.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-auto flex max-w-xl gap-2 rounded-2xl border border-line bg-white p-2 shadow-lg shadow-brand-900/5"
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
          type="submit"
          className="rounded-xl bg-[image:var(--rt-grad)] px-5 py-2.5 font-semibold text-brand-900 shadow-md shadow-brand-500/30 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          Load
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <div className="mt-4">
        <button
          type="button"
          onClick={onTryExample}
          className="text-sm font-semibold text-brand-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 focus-visible:rounded-sm"
        >
          ▶ Try an example
        </button>
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-brand-800">
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
  );
}
