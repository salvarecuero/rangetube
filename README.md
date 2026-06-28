# RangeTube

Free, backendless YouTube **segment looper**: paste a video URL, pick a start/end range, and loop that segment endlessly. No ads, no signup — just the clip and you.

## Stack

Astro (static) · React islands (`@astrojs/react`) · TypeScript (strict) · Tailwind CSS v4 · Vitest + jsdom + Testing Library. Deploys static to **Cloudflare Pages** (`dist/`). No backend.

## Requirements

- **Node 22** (see `.nvmrc` / `.node-version`) — `nvm use`
- **pnpm** via Corepack — `corepack enable` (version pinned by `packageManager` in `package.json`)

## Getting started

```bash
pnpm install
pnpm dev        # dev server at http://localhost:4321
```

## Scripts

| Command           | What it does                  |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Dev server                    |
| `pnpm build`      | Production build to `dist/`   |
| `pnpm preview`    | Serve the production build    |
| `pnpm test`       | Run unit/component tests once |
| `pnpm test:watch` | Tests in watch mode           |
| `pnpm typecheck`  | `astro check`                 |
| `pnpm lint`       | ESLint + Prettier check       |
| `pnpm format`     | Prettier write                |

## Architecture

Click-to-load facade → real `YT.Player` (`src/lib/youtube/iframeApi.ts`) → `YouTubeSource` adapter (`src/lib/player/youtubeSource.ts`) implementing the source-agnostic `SourcePlayer` interface (`src/lib/player/types.ts`) → `LoopEngine` (`src/lib/player/loopEngine.ts`) drives looping by polling `getCurrentTime()` and `seekTo()`-ing back to the range start. The looper is a single `client:idle` island (`src/components/Looper.tsx`); content pages stay zero-JS. The range slider is `src/components/RangeSlider.tsx` (ARIA multi-thumb). URL parsing lives in `src/lib/youtube/parseVideoId.ts`.

## Conventions

- **TDD**: write the failing test first. Pure logic lives in `src/lib/` (unit-tested); UI in `src/components/` (Testing Library).
- New playback sources implement `SourcePlayer` — don't special-case YouTube in the engine or UI.

See [`AGENTS.md`](./AGENTS.md) for the full contributor guide, and `docs/` for specs, plans, and research (including the YouTube ToS / legal constraints).
