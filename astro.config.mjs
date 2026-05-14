import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thepyramidprinciple.com',
  integrations: [
    sitemap({
      serialize(item) {
        const today = new Date().toISOString();
        // Blog index — high-value listing, weekly refresh.
        if (/\/blog\/?$/.test(item.url)) {
          return { ...item, changefreq: 'weekly', priority: 0.8, lastmod: today };
        }
        // Individual blog post — highest priority for SEO.
        if (/\/blog\/[^/]+\/?$/.test(item.url)) {
          return { ...item, changefreq: 'weekly', priority: 0.9, lastmod: today };
        }
        return item;
      },
    }),
  ],
  build: {
    // Trait 6: Astro inlines small stylesheets, externalizes larger ones.
    // scripts/async-css.mjs converts the externalized bundles to async via the
    // media="print" onload swap so they never block first paint.
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
    // Phase 7: concatenate all per-page CSS into a single shared bundle.
    // Lighthouse's render-blocking-insight audit estimated ~2.1s mobile LCP
    // savings from collapsing the 3 render-blocking CSS files into fewer
    // requests. With HTTP/2 multiplexing the savings are smaller than
    // Lighthouse's serial-RTT assumption, but eliminating the 2 extra round
    // trips still wins on slow-4G mobile (~700ms RTT × 2 = ~1.4s).
    // Subsequent navigation gets the cached bundle = zero CSS download.
    build: {
      cssCodeSplit: false,
    },
  },
});
