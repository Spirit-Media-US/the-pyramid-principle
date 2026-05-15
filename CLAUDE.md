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

**Phase 4 to-dos + Phase 3 CARs (97-item content/editorial/licensing list) — see [`content/phase-4-CARs.md`](content/phase-4-CARs.md).**

### Phase 5 — Performance / Lighthouse (partial, stopped 2026-05-12)

Per Kevin's instruction "If still below 95 after medium fixes — STOP, log remaining gap as CAR, don't escalate to hard fixes tonight."

**Final PSI on `dev.the-pyramid-principle.pages.dev` (2026-05-12):**
- **Mobile:** Perf **86** / A11y **100** / BP **100** / SEO **100** (FCP 2.6s, LCP 3.7s, TBT 0ms, CLS **0.001**)
- **Desktop:** Perf **75** / A11y **100** / BP **100** / SEO **100** (FCP 0.3s, LCP 0.8s, TBT 0ms, CLS **1.354**)

**Quick wins + medium fixes shipped:**
- `main#main-content` landmark wrapper + reusable `.skip-link` styling (a11y → 100)
- Footer link contrast `#CAA949 → #7C5C00` (BP/a11y)
- Heading-order fixes (Based-on H6 → `<p>` eyebrow, H4 → `<h3>`; About-section H6 → H3)
- Header logo CLS fix — explicit width/height + `aspect-ratio: 190/93`, srcset 280w/400w
- YouTube facade (Cori Close) — poster image + click-to-load iframe (TBT 210ms → 0ms on desktop)
- All above-fold `<img>` got explicit `width`/`height`
- Retailer-card image CLS fix — `width:auto; height:60px; max-width:100%` (mobile CLS 0.791 → 0.001)

**Remaining gaps (Phase 6 candidates):**
- **Desktop CLS 1.354 — web font swap.** Lighthouse `layout-shifts` audit attributes the two largest shifts (`body` 0.737, `.home-hero-grid` 0.617) to `dm-sans-400` and `open-sans-400` loading. All 8 `@font-face` declarations already use `font-display: optional`, but PSI's lab profile is fast enough that the fonts DO load inside the optional window, then trigger a layout reflow when they apply. Fix requires `size-adjust`/`ascent-override`/`descent-override` descriptors on each fallback so the fallback metrics match the loaded font (the "Faux Font" technique). Architectural — not "tonight" work.
- **Mobile LCP 3.7s.** TBT/CLS already at floor; LCP is the only remaining mobile lever. The current LCP element appears to be the hero `<picture>` on mobile; tightening it further would mean either applying the §6 mobile-text-LCP flip (precondition: confirm Lighthouse `largest-contentful-paint-element` resolves to `picture > img` — needs re-check) or further reducing the mobile hero bytes.
- **PSI quota** — only 1 audit per category was run, not median-of-5. Re-measure once quota refreshes; current single-shot may be variance.

**Not eligible for main merge** until both perf scores ≥ 95. Blog Gold-Level audit is also blocking — see migration phase-4 CAR section below.

### Phase 6 — Performance push to 95+ (partial, stopped 2026-05-12)

Goal was both mobile + desktop ≥ 95. Outcome: **desktop hit, mobile 7 points short.**

**Final PSI on `dev.the-pyramid-principle.pages.dev` (commit d9e1a2d, median of 5):**
- **Mobile:** Perf **88** (range 88-89) / A11y **100** / BP **100** / SEO **100** — FCP 2.6s, LCP 3.3s, TBT 0ms, CLS 0.001
- **Desktop:** Perf **99** (range 99-100) / A11y **100** / BP **100** / SEO **100** — FCP 0.6s, LCP 0.7-0.8s, TBT 0ms, CLS 0

**Major wins shipped:**
- **Disabled the `scripts/async-css.mjs` post-build step (commit d6c823f)** — root cause of the body-shift CLS that capped Phase 5. The script converted every `<link rel="stylesheet">` to `media="print" onload="this.media='all'"` (non-blocking), but the project only emits ~1.5KB of inline critical CSS (a LogoCarousel snippet). The page was painting unstyled, then the full Tailwind bundle was swapping in, restyling the entire body. That swap was the desktop CLS=1.0 and mobile CLS=0.79–1.0 we had been chasing. Reverting to render-blocking CSS (Astro's default `inlineStylesheets: 'auto'`) cost ~200ms FCP but eliminated the CLS entirely. **Net effect: mobile 61 → 87, desktop 75 → 99.**
- **`content-visibility: auto` on below-the-fold sections (commit d9e1a2d)** — main-thread Style+Layout was 105ms real (~420ms throttled). Skipping layout/paint for the 7 below-fold sections shaved ~+1 mobile perf, ~+1 desktop.

**Approaches that didn't work (reverted):**
- **Fix A: fallback font metrics with size-adjust / ascent-override** (commits e3bc816, c6ffd98 — reverted 0800a8a, ccdab4d). Generated via fontkit from each woff2's OS/2 table, wired into the family stacks. Mobile CLS oscillated 0.001 ↔ 0.79 across runs even after the formula correction (override % needed to be divided by sizeAdjust to keep absolute line-box). Net was zero measurable benefit because PSI's Linux headless Chrome environment substitutes `local('Arial')` for Liberation Sans / DejaVu Sans, whose metrics differ from Capsize's macOS Arial values — `size-adjust` calibration breaks.
- **`inlineStylesheets: 'always'`** (commit 3762434 — reverted 29e8612). HTML jumped from ~25KB to ~110KB. Mobile slow-4G download of the larger HTML cost more time than the saved CSS-fetch did, regressing perf 87→85. The win pattern is "inline only above-the-fold critical CSS", not "inline everything."
- **Retarget homepage preloads** (commit 338b49e — reverted 7184175). Swapped Bebas Neue 400 + hero image preloads for Open Sans 400 + DM Sans 700. Preloading the font used by the LCP text element ironically *hurt* LCP by ~700ms — with `font-display: optional`, preloading makes the font more likely to arrive within the optional window, which causes the browser to paint the text with the loaded font (longer wait) instead of the fallback (immediate). Counterintuitive but reproducible.
- **Remove Layout.astro font preloads** (commit f048d6b — reverted 1b6c949). Moving preloads to `_headers` only made mobile regress 87→82 because CF Pages preview URLs don't promote `Link:` headers to HTTP/2 103 Early Hints — only zones with `early_hints=on` do, and we have no zone yet.

**Remaining gap (Phase 7 / launch candidates):**
- **Mobile LCP 3.3s is the only bottleneck.** Lighthouse's `render-blocking-insight` audit estimates 2,100ms LCP savings *if* the 3 render-blocking CSS files (17KB on the wire combined) were deferred or inlined. The async-css approach can't be re-enabled without first extracting proper critical CSS for the hero — currently all critical above-the-fold styling is in scoped Astro `<style>` blocks per component, not in `@layer base` where the perf-gate rule expects it (trait 6).
- **CF zone Phase 0 settings** — `early_hints=on`, `mirage=off`, `0rtt=on`, `is_robots_txt_managed=false`, `ai_bots_protection=block` — are deferred to Phase 8 (no custom domain yet). The cf-zone-settings.md rule notes that prod scores typically run 4-6 points BELOW dev.pages.dev previews until Phase 0 is applied — so this is unlikely to be the bridge to 95 from 88, but it should at least not regress when the domain is connected. Likely net effect on mobile: 0 to +3.
- **Architectural options for Phase 7 (each blocked from "tonight" work):**
  1. Manual critical CSS extraction — pull hero + header CSS into a `<style>` tag in Layout.astro `<head>`, then re-enable async-css for the rest. ~1-2 hours.
  2. Tooling-based critical CSS — install Critters or Penthouse, run as part of build. ~2 hours including config + testing.
  3. Defer below-the-fold @font-face declarations via JS-injected stylesheet — currently 8 @font-face declarations all start loading on CSS parse, including libre-baskerville and abel which are only used in the Coach Wooden quote section. ~1 hour.
  4. Replace text-LCP with a styled-via-class HTML pattern that the browser can paint with system fallback fonts — requires verifying every hero element's font use stays cohesive. Risky on visual fidelity.

**Commits on dev branch from Phase 6 (all clean, no force-push):**
- d6c823f — disable async-css
- 1b6c949 — (revert of f048d6b layout-preload move)
- d9e1a2d — content-visibility on below-fold sections
- Plus reverts at 7184175, 29e8612, 0800a8a, ccdab4d cleaning up the experiments.

### Phase 6 — Post-launch checklist sweep (2026-05-13)

After Kevin promoted the site to `https://thepyramidprinciple.com` on 2026-05-12, a 58-point post-launch checklist sweep against the live origin surfaced gaps. Kevin authorized fixing everything we could ourselves; this session shipped 5 commits to dev:

| Commit | Fix | What changed |
|---|---|---|
| 68b422e | `robots.txt` `SITE_DOMAIN` placeholder | `public/robots.txt` — sitemap line now `https://thepyramidprinciple.com/sitemap-index.xml` |
| ca9b4b5 | Remove unverified 100 Club pill | `src/layouts/Layout.astro` — stripped `<span class="hundred-club-pill">` from footer + the matching CSS rule. **Reverted by `e0e9aba`** later the same session per Kevin's directive — pill stays in the footer. |
| b8e1b3c | www → apex 301 redirect | Cloudflare Dynamic Redirect rule added on zone `4c373d6ae0a6b61132ee48e96b10ea2e` (ruleset `384673be663745f0acb3ac610e2da2e5`, rule id `13325f6cd48a4da3a6b93647b97569c3`). Preserves path + query. Empty commit — pure infra change. |
| 69dda46 | Missing meta tags + apple-touch-icon | `src/layouts/Layout.astro` — added `<meta name="author">`, `<meta name="theme-color" content="#FFD100">`, `<meta name="twitter:image">`, `<meta property="og:image:width/height/alt">`, `<link rel="apple-touch-icon">`. Generated `public/apple-touch-icon.png` (180×180, brand-yellow ground, black pyramid path from `favicon.svg`) via sharp. Added precise `.gitignore` negation `!public/apple-touch-icon.png` so the icon ships (the global `*.png` media-block rule still holds for content media). |
| 7fb2dd9 | Deduplicate homepage H1 | `src/pages/index.astro` — mobile hero changed from `<h1>` to `<p role="heading" aria-level="1">`. Page now has a single literal `<h1>` (desktop variant); screen-reader users on mobile still hear the visible mobile hero as a level-1 heading. Visual unchanged. |

**TLS / certs — apex AND www are live**, both with Google Trust Services certs issued 2026-05-12 (valid through 2026-08-10). The earlier "TLS provisioning pending" note was already stale at the time of the sweep — flagged.

**Verified clean on `https://dev.the-pyramid-principle.pages.dev/`** after `git pushd origin dev` (Wrangler deploy alias `9683d72c`):
- robots.txt resolves with apex domain
- 0 occurrences of "100 Club" / "hundred-club" in served HTML
- All 6 new meta tags present
- `/apple-touch-icon.png` → HTTP 200, content-type `image/png`
- DOM contains exactly 1 `<h1>` (comment-strip count, not literal regex match)
- www → apex 301 verified live on the prod zone with root, path, and query-string cases

**Dev → main merge still requires Kevin's approval** per team-rules. Not coordinated in this session.

### Post-launch CARs (deferred — not blocking, log here so Phase 7 picks them up)

- **Google Search Console verification** — needs (a) GSC property access for `thepyramidprinciple.com` granted to whoever will paste the verification token, and (b) the verification HTML or DNS TXT value. Once we have either, drop `google<hex>.html` in `public/` or add the TXT to the CF DNS record. Then submit the sitemap inside GSC. **Blocker: need Kevin to grant GSC property + share the token.**
- **CTA click tracking (GA4 conversion events)** — homepage and `/retailers/` Amazon retailer cards, `/give-courage/` Givebutter widget click, `/give-courage/` and homepage "Give Courage" CTAs, header "In The News" + "Reviews" pills, retailer-page international Amazon buttons. Wire `gtag('event','click', { event_category:'cta', event_label:<retailer-or-button> })` on each anchor. Bundle with the Phase 7 perf work since both touch JS already deferred behind first-interaction. **Not breaking anything today — log + ship in Phase 7.**
- **100 Club pill** — kept in footer per Kevin's directive (hardcoded, bypasses the registry-gated `HundredClubBadge` component). Phase 7: evaluate switching to the registry component once TPP qualifies.

### Phase 7 — Mobile perf push (attempted, fully reverted 2026-05-14)

**Goal:** Cross mobile Lighthouse Perf 95+ from Phase 6's 88-90 median.
**Hard requirement (per session brief):** No CLS regression. Desktop ≥99.
No `media="print"` onload pattern. Mobile crossed 92 to count as progress.
Time-box: 90 min.

**Outcome: All three attempts reverted. Branch identical to f613be8
(pre-Phase-7 last commit). Mobile remains at 87-90 median. CARs below.**

| Attempt | Approach | PSI median (mobile / desktop) | CLS | Revert |
|---|---|---|---|---|
| Baseline | (none) | **90 / 100** | 0.001 / 0.000 | — |
| 1 | `vite.build.cssCodeSplit: false` to concatenate per-page CSS into one bundle (-1 render-blocking RTT) | 90 / 99 | 0.001 / 0.000 | `c7ab7bb` |
| 2 | Beasties critical-CSS extraction with `preload: 'js-lazy'` + `pruneSource: true` (no media=print pattern) | **99 / 100** | **0.000 / 0.000** | `b2f9198` |
| 3 | Same Beasties config but `pruneSource: false` (preserve full deferred CSS) | 87 / 99 | 0.011 / 0.000 | `fb0d580` |

**Attempt 2 result was almost perfect** — mobile Perf crossed 99 with CLS
0.000 (better than baseline). But it tanked **A11y 100→96** and
**Best-Practices 100→96** on both viewports. The two new failing audits
were:
  - `image-aspect-ratio` (BP) — image rendered dims didn't match HTML
    width/height attrs because the `.hero-book-img` `height: auto`
    rule (and similar layout-driving rules) were pruned from critical
    extraction. The deferred CSS would arrive AFTER Lighthouse's
    audit window, so the audit saw the page in its broken pre-deferred
    state.
  - `target-size` (A11y) — interactive elements rendered with default
    padding (no min-target sizing rules in critical extraction).

**Attempt 3** kept the deferred CSS as the full original sheet (not
pruned) to restore the missing rules. A11y/BP came back to 100, but:
  - Mobile Perf regressed to 87 (below baseline 90) because each page
    HTML grew ~17KB from duplicate critical+deferred rules
  - Mobile CLS spiked from 0.001 → 0.011 (10× regression — though
    still well within "Good" range, the brief said "any CLS regression
    = revert")

**Why this is a hard problem on this specific site:**
  1. The hero is split-column with the image on the right being a
     significant chunk of mobile viewport. Layout-driving CSS for
     that image (`.hero-book-img`, scoped via `data-astro-cid-*`) is
     above-the-fold AND affects PSI's image-aspect-ratio audit. If
     Beasties' DOM-walk extraction misses it, the audit fails. If
     duplicated to keep it complete, bytes regress slow-4G mobile.
  2. The site uses Astro scoped CSS heavily (each component compiles
     to per-page selectors with `data-astro-cid` attribute selectors).
     Beasties does match these correctly when extracting, but
     selectors that only become "visible" via scroll, interaction,
     or media-query state still get pruned and miss audit windows.
  3. Per-page CSS bundles are ~24KB raw each (~4-6KB gzip). Inlining
     all critical CSS (~21KB per page) AND keeping deferred CSS
     external roughly doubles the wire bytes on first load.

**What a dedicated Phase 7 session would need to try:**
  1. **`forceInclude` for Beasties** — manually list selectors that
     must always be inlined (`.hero-book-img`, all retailer-card
     classes, all button/anchor with significant padding). Restore
     A11y/BP completeness without breaking the prune. Beasties
     option name: `additionalStylesheets` or per-instance hook.
  2. **Manual critical CSS extraction** — write a `<style is:inline>`
     block in `Layout.astro` head with hand-picked critical hero +
     header + button styles. Disable Beasties. Defer the rest via
     `<link rel="preload" as="style">` + JS-driven append on idle.
     ~1-2 hours to identify the right rule set.
  3. **CF zone Phase 0 settings** — `early_hints=on`, `mirage=off`,
     `0rtt=on` on the production zone. Phase 6 notes say prod scores
     typically run 4-6 points BELOW dev.pages.dev until Phase 0 is
     applied. Could give +3 mobile for free without code changes.
     Per cf-zone-settings.md, this is mandatory anyway for the
     production zone.
  4. **Reduce per-page CSS bundle size** — audit `index.yodYpjSp.css`
     for unused rules (sections that don't appear on initial paint)
     and split into a separate route-level lazy chunk.
  5. **font-display: swap** with proper `size-adjust` per font —
     Phase 6 tried `size-adjust`/`ascent-override` and reverted
     because PSI Linux substitutes Liberation Sans with different
     metrics than macOS Capsize values. A future attempt should
     calibrate against the actual PSI runtime fonts (run a Lighthouse
     CI job that captures the substituted font's metrics, then
     compute size-adjust from those).

**Commits on dev branch from Phase 7 (3 attempts + 3 reverts, all clean):**
  - 93996e6 + c7ab7bb (attempt 1 + revert)
  - c1772bf + b2f9198 (attempt 2 + revert)
  - 72823f1 + fb0d580 (attempt 3 + revert)

**State at end of session:** branch HEAD identical to f613be8 (pre-
Phase-7 last commit). `npm ls beasties astro-critters` returns empty.
No leftover scripts, no lockfile drift, no node_modules drift.

### Phases 7-9

## DNS Pattern

Not yet chosen. Default = **Pattern 1** (registrar DNS → Pages, nameservers stay at current registrar). To use Pattern 2 (move DNS to Cloudflare for orange-cloud apex), add an explicit opt-in line here with reason AND get Kevin's confirmation BEFORE touching DNS — see migration CLAUDE.md Step 1c.

## Rules

- All work goes to the **dev** branch — never push directly to main
- Only merge dev to main when Kevin says "push to main"
- Media never in git: images → Sanity, audio → R2, video → YouTube iframe
- External image URLs banned (must resolve to `cdn.sanity.io` or `assets.spiritmediapublishing.com`) — scan before completing Phases 4 and 7
