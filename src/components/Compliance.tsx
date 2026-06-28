/** YouTube ToS-required attribution + non-affiliation disclaimer. */
export function Compliance() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-muted">
      <a
        href="https://www.youtube.com"
        rel="noopener"
        className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-2 hover:underline"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#FF0000"
            d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12Z"
          />
          <path fill="#fff" d="M10 15.5 16 12l-6-3.5Z" />
        </svg>
        Developed with YouTube
      </a>
      <span>· RangeTube is not affiliated with or endorsed by YouTube or Google.</span>
    </p>
  );
}
