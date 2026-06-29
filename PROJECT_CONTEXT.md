# RangeTube Project Context

RangeTube is a free, backendless YouTube segment looper. The product loads the
official YouTube IFrame Player only after user intent, lets the user choose a
start/end range, and loops that segment client-side.

## Durable Constraints

- Keep the official YouTube player visible and functional. Do not strip or
  obscure play/pause, seek, captions, fullscreen, settings, branding, metadata,
  ads, or related YouTube UI.
- Keep the "Developed with YouTube" attribution close to the player and keep a
  clear non-affiliation disclaimer.
- Use `youtube-nocookie.com` by default and preserve click-to-load as the consent
  boundary. Do not load the real YouTube iframe on initial page load.
- Do not download, cache, proxy, extract, or separate media/audio. RangeTube only
  sends playback commands to the official player.
- Avoid in-app keyword search unless there is a deliberate server/API-key plan.
  Client-side YouTube Data API keys are quota and abuse risks.
- Preserve the portfolio embed `frame-ancestors` CSP for `salvarecuero.dev`,
  `www.salvarecuero.dev`, and local development.

## Product Decisions

- Segment looping is implemented by polling `getCurrentTime()` and seeking back
  to the selected start when the playhead reaches the selected end. YouTube does
  not provide native A-B segment looping.
- The playback core is source-agnostic: new providers should implement
  `SourcePlayer` instead of special-casing YouTube in UI or loop engine code.
- The best audience wedge is practice and study: musicians, language learners,
  dancers, and students need repeatable short sections more than whole-video
  looping.
- Useful feature depth includes precise time entry, mark-in/mark-out, playback
  speed, shareable links, saved local loops, and mobile-friendly controls.
- Content pages should remain zero-JS. The interactive looper is the only Preact
  island.

## Compliance And Privacy Posture

- RangeTube has no backend, accounts, database, or server-side user storage.
- The primary privacy exposure is the browser connecting to Google/YouTube once
  the user loads the player.
- Privacy and terms pages should plainly explain the YouTube embed, Google data
  handling, `youtube-nocookie.com`, click-to-load, and the fact that RangeTube is
  independent from YouTube/Google.
- Legal text is a good-faith draft and should not claim to be legal advice.

## Performance And SEO Posture

- The click-to-load facade is both a privacy boundary and the main performance
  strategy because it avoids eager YouTube iframe cost.
- Keep third-party JavaScript minimal, content pages static, and page metadata
  explicit.
- SEO pages should target concrete jobs: loop a section, A-B repeat, slow down a
  YouTube video, mobile looping, music practice, language learning, dance, and
  lecture review.

## Competitive Notes

- YouTube's native loop covers whole-video repeat, not segment/A-B looping.
- The competitor space is real but mostly commoditized. RangeTube should compete
  on clarity, design, no ads, privacy-conscious loading, shareable ranges, and
  focused practice workflows.
