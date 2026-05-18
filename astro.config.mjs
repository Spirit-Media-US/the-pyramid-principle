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
    // Inline ALL stylesheets into the HTML to eliminate the 1-2 render-blocking
    // CSS round-trips on slow-4G mobile. Phase 6 reverted this because the
    // bundle was 25KB → 110KB (HTML), but that was before splide.css was
    // moved off the critical path (commit 6846690) and before fallback fonts
    // were calibrated (commit f50f5da). Current state: HTML 57KB + 50KB
    // external CSS → 107KB inlined (12KB → 22KB gzipped). Eliminates 1 RTT
    // (~300-450ms FCP on slow-4G), which is the dominant remaining bottleneck.
    inlineStylesheets: 'always',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
  },
});
