# Site Inventory — The Pyramid Principle

**Source:** https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/ (Cloudways WP staging)
**Extracted:** 2026-05-11
**Page count:** 9 (7 nav-linked + media-center + reviews per user direction 2026-05-11)
**Builder:** Bricks (WordPress)

## Page Map

| Slug | URL | Title (desktop) | HTTP |
|------|-----|-----------------|------|
| `home` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/ | The Pyramid Principle \| Homepage | 200 |
| `john-vallely` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/john-vallely/ | The Pyramid Principle \| John Vallely | 200 |
| `paul-weissenstein` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/paul-weissenstein/ | The Pyramid Principle \| Paul Weissenstein | 200 |
| `coach-john-wooden` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/coach-john-wooden/ | The Pyramid Principle \| Coach John Wooden | 200 |
| `retailers` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/retailers/ | The Pyramid Principle \| Retailers | 200 |
| `the-pyramid-success` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/the-pyramid-success/ | The Pyramid Principle \| The Pyramid Success | 200 |
| `give-courage` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/give-courage/ | The Pyramid Principle \| Pediatric Cancer Research Foundation | 200 |
| `media-center` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/media-center/ | Media Center (In the News) - thepyramidprinciple.org | 200 |
| `reviews` | https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/reviews/ | Reviews - thepyramidprinciple.org | 200 |

## Pages NOT migrated (decision 2026-05-11)

Found in WP page-sitemap.xml but explicitly excluded:

- `/tpp/blogs/` — empty post index (post-sitemap.xml has 0 entries)
- `/tpp/download/` — stub page, title reuses "John Vallely"
- `/tpp/free-resources/` — stub page, title reuses "John Vallely"
- `/tpp/pediatric-cancer-research-foundation-copy/` — WIP, "-copy" suffix

Redirect (preserved as 301 in Phase 8 cutover):
- `/tpp/victory-over-cancer/` → `/give-courage/`

## Source path prefix

Cloudways staging has all pages under `/tpp/`. New site lives at the apex (e.g. `/john-vallely/`) — the `/tpp/` prefix is dropped in the migrated routes.

## Builder note

Original site is built with Bricks (WordPress page builder). Element classes are prefixed `brxe-`. Lazy loading uses `data-src` / `data-srcset` rather than `src`/`srcset`. Captured via Playwright with scroll-to-bottom + 800ms settle.
