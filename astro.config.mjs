import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: Replace site URL once the live domain is known.
export default defineConfig({
  site: 'https://REPLACE_WITH_DOMAIN.com',
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
    // 'always' inlines every stylesheet into <head>, eliminating render-blocking
    // CSS network requests. Increases HTML payload by ~22KB on the homepage
    // (~5KB on the wire after brotli) but removes a critical-chain dependency
    // on slow-4G. Tradeoff favors LCP over HTML size.
    inlineStylesheets: 'always',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
  },
});
