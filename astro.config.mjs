import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: Replace site URL once the live domain is known.
export default defineConfig({
  site: 'https://REPLACE_WITH_DOMAIN.com',
  integrations: [sitemap()],
  build: {
    // Trait 6: Astro inlines small stylesheets, externalizes larger ones.
    // scripts/async-css.mjs converts the externalized bundles to async via the
    // media="print" onload swap so they never block first paint.
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
  },
});
