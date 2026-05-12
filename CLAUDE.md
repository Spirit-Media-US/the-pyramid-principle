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

### Phase 4 — Wire Sanity CMS (pending)

**Phase 4 to-dos accumulated during Phase 3 build:**

- [ ] **Latest Blog grid (homepage section 9)** — currently hardcoded with 6 cards (blocks 71-89 of home.json). Swap for a GROQ query against the Sanity blog schema:
      ```
      *[_type == "blogPost"] | order(publishedAt desc) [0...6]
      ```
      All 6 "Read full article" `<a>` tags carry `data-pending-blog="true"` so they're auditable. The slugs they point to don't exist yet — they 404 on dev preview until the blog routes are created. Jufrey's list: 8 blogs total scope, 2 more beyond the 6 surfaced on the homepage.
- [ ] **Sponsor Copies CTA** — homepage section 2 currently links to `/give-courage/` (rewritten from the source's `/victory-over-cancer/`). In Phase 8 cutover, preserve a 301 redirect `/victory-over-cancer/ → /give-courage/`.
- [ ] **Carousel data** — `home.json` block 28 (`press-carousel`) carries 11 slides hardcoded with file + href. In Phase 4 a `pressCoverage` Sanity document type should drive this; replace the StructuredPage routing to query Sanity instead.
- [ ] **All hand-rendered home sections** read directly from `home.json` indices in `index.astro`. Phase 4 should restructure each section into Sanity schema types (`homepageHero`, `homepageHeartGripping`, `homepageStory`, `homepageBasedOn`, etc.) so the client can edit copy/images via Studio.
- [ ] **Editorial corrections logged for Phase 5 CAR**:
  - `<a href=pacdora.com>` wrap dropped on (a) Free Resources YouTube, (b) Wooden quote image — both packaging-design tool URLs, almost certainly client miswires.
  - `home.json` block 47 (Coach Cori Close attribution): source `<h2>` → reclassified to `<p>` + `<cite>` role.
  - `home.json` block 69 (Wooden quote): source `<h2>` → reclassified to `<blockquote>`.
  - `home.json` block 70 (Wooden attribution): source `<h2>` → reclassified to `<p>` + `<cite>` role.
  - "John Valley" (sic) typo preserved on Highlights items 5+6 of col 2 (live source has it).
  - Live source uses `Libre Baskerville` (quote) + `Abel` (cite) on the Wooden section. Both self-hosted from R2. Live H6 "A Heart-Gripping Story of Heroic Love and Legacy" uses Montserrat 20px 700.
  - Bricks shape-divider above John Vallely hero section dropped in migration — visually weak in the original, looked like a rendering bug in the rebuild. Confirm with Kevin whether to add it back with proper sizing.
  - `/paul-weissenstein/` hero body paragraph: source text ends without a period ("…into motion picture projects"). Preserved verbatim per Phase 3 fidelity. Confirm with client whether to add the period.
  - `/paul-weissenstein/` Acknowledgements — all personal names preserved verbatim. Flag for client review: (a) "Grace Westlin" spelling, (b) all named individuals + book titles + Psalm 96:3 quotation, (c) source has a few visibly-odd mid-sentence single `<br>`s preserved verbatim — P12 between "leading Princeton to success." and "Thank you to the Day One's", P15 inside "double<br>rainbow", P18 inside "His<br>faithfulness", P20 between the quote and `~ Coach John Wooden.` attribution. Confirm whether these are intentional line breaks or transcription artefacts.
  - Bricks `data-interactions` orphan references — on `/paul-weissenstein/` and `/coach-john-wooden/`, the OUTER container `data-interactions` `templateId`s for several video tiles point at popups from OTHER pages (e.g. Vallely's 1541/1545/1548 on Paul's outer tiles; 1661/1665/1678 on Wooden's outer tiles). The INNER `<i class="fa fa-circle-play">` `data-interactions` carries the correct page-local `templateId`. Used inner-icon IDs as authoritative. Not a migration bug — leftover Bricks editor state. Note for Kevin.
  - `/coach-john-wooden/` About UCLA collage uses **USATSI_8741865.webp** (image 1, 1000x600). "USATSI" = USA Today Sports Images stock photo. Verify licensing for this stock image carries over to the new site domain — the Cloudways WP install may have had a license that does NOT transfer with the migration. If licensing is unclear, swap for a different UCLA action photo before launch.
  - `/coach-john-wooden/` About UCLA collage staggered-image border color is **UCLA Blue `#0967B3`** in source (not white as on Vallely's interview-questions collage). The `image-collage-card` block exposes a `borderColor` field for this reason.

### Phases 5-9
- [ ] Pending

## DNS Pattern

Not yet chosen. Default = **Pattern 1** (registrar DNS → Pages, nameservers stay at current registrar). To use Pattern 2 (move DNS to Cloudflare for orange-cloud apex), add an explicit opt-in line here with reason AND get Kevin's confirmation BEFORE touching DNS — see migration CLAUDE.md Step 1c.

## Rules

- All work goes to the **dev** branch — never push directly to main
- Only merge dev to main when Kevin says "push to main"
- Media never in git: images → Sanity, audio → R2, video → YouTube iframe
- External image URLs banned (must resolve to `cdn.sanity.io` or `assets.spiritmediapublishing.com`) — scan before completing Phases 4 and 7
