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
      className="relative block aspect-video w-full overflow-hidden bg-black focus-visible:outline focus-visible:outline-2"
    >
      <img
        src={thumb}
        alt="Video thumbnail"
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/70"
      >
        ▶
      </span>
    </button>
  );
}
