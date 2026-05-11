# The Pyramid Principle

> **CLAUDE.md belongs in version control — NEVER add it to .gitignore. This file is the shared source of truth for all developers and all Claude Code sessions.**

This site: The Pyramid Principle | Repo: github.com/Spirit-Media-US/the-pyramid-principle | Domain: TBD | Sanity ID: `uenxsjdw` | Slug: `the-pyramid-principle`

Client URL (source of migration): https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/

**Migration protocol:** /home/deploy/bin/tools-api/pipelines/migration/CLAUDE.md

## Dev Commands

- `npm run dev` — local preview (port assignment pending — see /srv/sites/CLAUDE.md port map)
- `npm run build` — production build to dist/ (includes Sanity studio build into public/studio)

## Mandatory — Before Starting Work

Always start Claude sessions from inside this directory:
```
cd /srv/sites/the-pyramid-principle && claude
```
Then run: `git checkout dev && git pull origin dev`

## Stack

- Astro 5 + Tailwind CSS v4 (template baseline)
- Sanity Studio embedded at `/studio` (project `uenxsjdw`, dataset `production`)
- Cloudflare Pages — auto-deploys dev branch to `dev.the-pyramid-principle.pages.dev` and main to `the-pyramid-principle.pages.dev`

## Migration State — as of 2026-05-11

### Phase 1 — Infrastructure (in progress)
- [x] GitHub repo created from spirit-media-template
- [x] Sanity project created (`uenxsjdw`, org `ouZBq4dwV`)
- [x] Sanity dataset `production` created
- [x] Cloudflare Pages project created (main + dev preview branches connected)
- [x] Repo cloned locally to /srv/sites/the-pyramid-principle
- [x] sanity.config.ts + sanity.cli.js patched with project ID
- [x] dev branch created
- [x] First `npm run build` succeeds
- [x] content/ directory created for Phase 2 output
- [ ] Portal dashboard card added
- [ ] "inspect dev preview" returns 0 errors
- [ ] Custom domain — deferred to Phase 8 (no CF zone exists yet, so CF zone Phase 0 settings apply at launch)

### Phase 2 — Content + CSS Extraction (complete 2026-05-11)
- [x] Cloudways crawl with Playwright + `ignoreHTTPSErrors: true` (TLS hostname mismatch on staging cert)
- [x] 9 pages extracted: 7 nav-linked + media-center + reviews (user direction 2026-05-11). 4 WP sitemap orphans (blogs, download, free-resources, pediatric-cancer-research-foundation-copy) explicitly excluded. `/victory-over-cancer/` is a 301 → `/give-courage/` (preserve as redirect in Phase 8).
- [x] `content/site-inventory.md` — URL map + page inventory
- [x] `content/design-tokens.md` — colors, typography (Bebas Neue / DM Sans / Open Sans), Bricks-aware spacing, LCP-by-page, full brand palette read (yellow `#FFD100` + UCLA blue `#2774AE`, no red)
- [x] `content/images.md` — 170 unique images cataloged with destinations (all → Sanity)
- [x] `content/pages/*.md` — 9 files (one per page)
- [x] All 170 images downloaded to `/tmp/the-pyramid-principle-images/` (NOT in repo)
- [x] Screenshots captured for Phase 3 design review at `/tmp/the-pyramid-principle-images/_screenshot-*-{desktop,mobile}.png`
- [x] No TBD/TODO/FIXME in content/

### Phase 3 — Design + Build (pending)
- [ ] Stitch design system from design tokens, generate screens for 9 pages
- [ ] Self-host fonts (Bebas Neue, DM Sans, Open Sans) to `assets.spiritmediapublishing.com/fonts/`
- [ ] Build Astro pages from approved Stitch designs
- [ ] Hero must ship with all 8 perf-gate traits from the first build (not Phase 7)

### Phases 4-9
- [ ] Pending

## DNS Pattern

Not yet chosen. Default = **Pattern 1** (registrar DNS → Pages, nameservers stay at current registrar). To use Pattern 2 (move DNS to Cloudflare for orange-cloud apex), add an explicit opt-in line here with reason AND get Kevin's confirmation BEFORE touching DNS — see migration CLAUDE.md Step 1c.

## Rules

- All work goes to the **dev** branch — never push directly to main
- Only merge dev to main when Kevin says "push to main"
- Media never in git: images → Sanity, audio → R2, video → YouTube iframe
- External image URLs banned (must resolve to `cdn.sanity.io` or `assets.spiritmediapublishing.com`) — scan before completing Phases 4 and 7
