import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rangetube.salvarecuero.dev",
  integrations: [preact({ compat: true }), sitemap()],
  build: {
    // Inline the global stylesheet into each page to remove the render-blocking
    // <link>. "always" (vs default "auto") trades cross-page CSS caching for a
    // faster first paint — the right call for this home-page-first static site.
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [
      tailwindcss(),
      // Bundle lucide-react into the SSR/prerender output (via a plugin so the
      // setting survives Astro's second Vite build pass). lucide is published as
      // ESM that imports "react" (-> preact/compat here) and uses preact's
      // context internally; left external it loads through a second preact/compat
      // instance and breaks the static renderer. Bundling keeps a single
      // instance so server-rendering the icons works.
      {
        name: "rangetube:bundle-lucide-for-preact-ssr",
        configEnvironment(name, options) {
          if (name === "ssr" || name === "prerender") {
            options.resolve ??= {};
            options.resolve.noExternal = [
              ...(Array.isArray(options.resolve.noExternal) ? options.resolve.noExternal : []),
              "lucide-react",
            ];
          }
        },
      },
    ],
  },
});
