export interface YouTubeFacadeProps {
  videoId: string;
  onActivate: () => void;
}

export function YouTubeFacade({ videoId, onActivate }: YouTubeFacadeProps) {
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="Play video"
      className="group relative block aspect-video w-full overflow-hidden rounded-[var(--radius-stage)] bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      <img
        src={thumb}
        alt="Video thumbnail"
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(16,185,129,.25),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/20 text-3xl text-white backdrop-blur transition group-hover:scale-105"
      >
        ▶
      </span>
    </button>
  );
}
