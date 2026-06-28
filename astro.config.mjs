import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rangetube.salvarecuero.dev",
  integrations: [react(), sitemap()],
  build: {
    // Inline the global stylesheet into each page to remove the render-blocking
    // <link>. "always" (vs default "auto") trades cross-page CSS caching for a
    // faster first paint — the right call for this home-page-first static site.
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
