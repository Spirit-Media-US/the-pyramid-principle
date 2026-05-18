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
    // 'always' was tried on 2026-05-18 (commit fcdb205) — same outcome as
    // phase-6 attempt 3762434: HTML 57KB → 107KB regressed mobile LCP
    // because the larger HTML download on slow-4G outweighs the saved
    // CSS RTT. 'auto' stays the right setting.
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
  },
});
