# AGENTS.md — RangeTube v2

RangeTube is a free, backendless YouTube **segment looper**: paste a video URL, pick a start/end range, loop that segment endlessly.

## Stack

Astro (static) · Preact islands (`@astrojs/preact`, with `@preact/compat` aliasing `react`/`react-dom`) · TypeScript (strict) · Tailwind CSS v4 · Vitest + jsdom + Testing Library. Deploys static to **Cloudflare Pages** (`dist/`). No backend. Node 22 (`.nvmrc` / `.node-version`). Package manager: **pnpm** (pinned via `packageManager` in `package.json`; enable with `corepack enable`).

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build to `dist/`
- `pnpm preview` — serve the build
- `pnpm test` — run unit/component tests once
- `pnpm test:watch` — watch mode
- `pnpm typecheck` — `astro check`

## Architecture (the spine)

Click-to-load facade → real `YT.Player` (via `src/lib/youtube/iframeApi.ts`) → `YouTubeSource` adapter (`src/lib/player/youtubeSource.ts`) implementing the source-agnostic `SourcePlayer` interface (`src/lib/player/types.ts`) → `LoopEngine` (`src/lib/player/loopEngine.ts`) drives segment looping by polling `getCurrentTime()` and `seekTo()`-ing back to the range start. The looper is one `client:idle` island (`src/components/Looper.tsx`); content pages must stay zero-JS. The slider is `src/components/RangeSlider.tsx` (ARIA multi-thumb). URL parsing is `src/lib/youtube/parseVideoId.ts`. The portfolio embed handshake is `src/lib/embed/portfolioEmbed.ts`.

## Conventions

- TDD: write the failing test first; pure logic (`src/lib/`) is unit-tested, components use Testing Library.
- Keep files focused and small; pure logic in `src/lib/`, UI in `src/components/`.
- New playback sources implement `SourcePlayer` — do not special-case YouTube in the engine or UI.
- Avoid the deprecated namespace-qualified event types from the React-compat layer (`React.FormEvent` etc.); prefer inline-inferred handler events or named imports.
- Frequent, conventional commits.

## YouTube ToS / legal do-NOT list

- Do **not** strip or obscure the player; keep play/pause/seek/captions/fullscreen; viewport ≥200×200.
- Keep the **"Developed with YouTube"** attribution near the player; keep the non-affiliation disclaimer.
- No audio extraction, no downloading/caching media, no in-app keyword search (Data API quota/key).
- Default to `youtube-nocookie.com`; the player loads only after the user clicks (consent boundary).
- Preserve the portfolio embed `frame-ancestors` CSP in `public/_headers` (Cloudflare Pages serves it).

## Durable project context

Historical planning and research files are intentionally not kept in Git. Keep durable product, compliance, performance, and positioning decisions summarized in `PROJECT_CONTEXT.md`.
