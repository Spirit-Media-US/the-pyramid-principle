# Design Tokens — The Pyramid Principle

Extracted from https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/ on 2026-05-11
Source builder: **Bricks** (WordPress)
Measurements taken at desktop `1280×800` and mobile `375×812` via Playwright computed styles.

## Colors

The authoritative color table is **["Brand palette read"](#brand-palette-read-dom-enumeration-of-every-rendered-color-homepage-desktop)** further down — it enumerates every distinct color actually rendered on the live homepage (frequency-counted).

> Earlier drafts of this file had a `bodyBg`/`headerBg`/`footerBg`/`linkColor` table at the top sampled from bare `body`/`header`/`footer`/`a` selectors. Bricks leaves those wrappers transparent (`rgba(0, 0, 0, 0)`) and paints colors on `.brxe-section` / `.brxe-block` children instead — same selector trap as the spacing capture. The `linkColor` reading of `rgb(255, 255, 255)` was the first `<a>` on the page (the "Skip to main content" link sitting on a dark band), not a brand link color. Removed to avoid contradicting the verified palette.

## Typography — Desktop

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| h1 | "Bebas Neue" | 60px | 700 | 60px | normal |
| h2 | "DM Sans" | 16px | 700 | 16px | normal |
| h3 | "DM Sans" | 15px | 700 | 18px | normal |
| body | "Open Sans" | 16px | 400 | 27.2px | normal |
| navLink | "Open Sans" | 16px | 400 | 27.2px | normal |
| button | "DM Sans" | 18px | 400 | 20.7px | normal |
| footerText | "Open Sans" | 16px | 400 | 27.2px | normal |

## Typography — Mobile

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| h1 | "Bebas Neue" | 50px | 700 | 50px | normal |
| h2 | "DM Sans" | 16px | 700 | 16px | normal |
| h3 | "DM Sans" | 12px | 700 | 14.4px | normal |
| body | "Open Sans" | 14px | 400 | 23.8px | normal |
| navLink | "Open Sans" | 14px | 400 | 23.8px | normal |
| button | "DM Sans" | 18px | 400 | 20.7px | normal |
| footerText | "Open Sans" | 14px | 400 | 23.8px | normal |

## Spacing & Layout

| Element | Desktop padding | Mobile padding | Desktop margin | Mobile margin |
|---------|-----------------|----------------|----------------|---------------|
| headerBox | 0px | 0px | 0px | 0px |
| footerBox | 0px | 0px | 0px | 0px |
| mainBox | 0px | 0px | 0px | 0px |
| hero | 0px | 0px | 0px | 0px |

## Decorations

| Element | Border radius (desktop) | Box shadow (desktop) | Transition (desktop) |
|---------|------------------------|----------------------|----------------------|
| button | 0px | none | transform 0.1s cubic-bezier(0, 0, 0.2, 1) |
| hero | 0px | none | all |

## Navigation

> **Correction 2026-05-11:** the earlier "Row 1 yellow tagline bar" reading was a Phase 2 extraction error. The header is a **single row** on `#F5F5F5` — no yellow bar above it. The yellow `"A Gift of Courage!"` band is a hero/section element that appears further down the page, not part of the chrome. Verified via direct DOM read of `<header>` and `#menu-main-menu` on 2026-05-11.

| Viewport | Type | Details |
|----------|------|---------|
| Desktop  | Single row, three regions | **Background:** `#F5F5F5`. **Height:** ~133px. **Left:** logo wordmark (`TPP-Logo-2-1024x502.png`, rendered 190×93). **Center** (immediately right of logo): 6 social icons in a horizontal row — Instagram, Facebook, X, LinkedIn, TikTok, YouTube. Font Awesome glyphs (`fab fa-instagram`, etc.), color `rgb(33, 33, 33)`, size 20px, plain (no circular borders). **Right:** horizontal nav menu — **About** (dropdown chevron, contains John Vallely / Paul Weissenstein / Coach John Wooden), **Retailers**, **The Pyramid Success**, **Give Courage**. Nav typography: DM Sans 18px, weight 400, color `rgb(33, 33, 33)`, uppercase, letter-spacing normal. |
| Mobile   | Stacked with hamburger | Logo + hamburger trigger only. Tapping the hamburger opens a slide-out (`bricks-mobile-menu-wrapper.left`) at width 300px with the same nav items plus social icons below. Header rendered height = 177px at 375px viewport (vs 133px desktop). |

> Screenshots captured at /tmp/the-pyramid-principle-images/\_screenshot-home-{desktop,mobile}.png. Mobile homepage is ~12,000px tall (long-scroll landing page).

## Brand palette read (DOM enumeration of every rendered color, homepage desktop)

The logo wordmark is the file `TPP-Logo-2-1024x502.png` rendered in solid yellow — there is **no brand red** despite first-glance screenshot impression. Confirmed by direct sampling of every visible element on the live page.

| Role | Color | Hex | Frequency | Used on |
|------|-------|-----|-----------|---------|
| **Brand yellow (primary)** | `rgb(255, 209, 0)` | `#FFD100` | 19 elements | Logo wordmark, top tagline bar, "GIVE THE GIFT OF COURAGE" banner, nav-active highlight, H2 accents |
| **John-Vallely blue (UCLA)** | `rgb(39, 116, 174)` | `#2774AE` | 9 elements | "John Vallely / Paul Weissenstein / Coach Wooden" list — UCLA blue accent |
| **Give-Courage pink** | `rgb(249, 153, 203)` | `#F999CB` | 1 element | "Give Courage" link accent (matches pediatric cancer ribbon palette) |
| **Spirit Media gold** | `rgb(202, 169, 73)` | `#CAA949` | 1 element | Footer "Contact Spirit Media" link |
| Near-black (H1) | `rgb(29, 29, 31)` | `#1D1D1F` | 20 elements | H1 headings |
| Dark on light (nav/links) | `rgb(33, 33, 33)` | `#212121` | 21 elements | Nav links, button text on light bg |
| Body gray | `rgb(97, 97, 97)` | `#616161` | 244 elements | Body paragraphs, footer text — dominant text color |
| Muted text | `rgb(66, 66, 66)` | `#424242` | 3 elements | "Limited Time Only!" announcement text |
| First section bg | `rgb(245, 245, 245)` | `#F5F5F5` | 30 sections | Light gray background under hero / between sections |
| Alt section bg | `rgb(247, 247, 247)` | `#F7F7F7` | 2 sections | Slight tint variant for striping |
| Border / divider | `rgb(230, 231, 232)` | `#E6E7E8` | 1 element | Card / divider line |
| White | `rgb(255, 255, 255)` | `#FFFFFF` | 55 elements | Text on the yellow bar + dark/red CTA banner backgrounds |
| Black accent | `rgb(0, 0, 0)` | `#000000` | 15 elements | "Skip to main content" link, occasional emphasis |

## LCP element by page (mobile 375)

| Page | LCP tag | LCP src / text | Natural dims |
|------|---------|----------------|--------------|
| home | IMG | 3D-Book-1-886x1024.png | 374×433 |
| john-vallely | IMG | valley_109.jpg | 375×467 |
| paul-weissenstein | IMG | image-1.png | 375×371 |
| coach-john-wooden | IMG | American-basketball-coach-John-Wooden-1993.webp | 351×450 |
| retailers | H1 | Order your stock today through Ingram Book Distributors | — |
| the-pyramid-success | H1 | The Pyramid Success | — |
| give-courage | H2 | Help GIVE THE GIFTOF COURAGE TO | — |
| media-center | H2 | Generosity Campaign Launched To Share a Gift of Courage with 400,000 Families Fi | — |
| reviews | H1 |  Thanks for Sharing Your Review! | — |

> Per performance-gate.md §6: if mobile LCP resolves to `picture > img` AND mobile Perf < 95, apply the text-first mobile remediation. Otherwise leave the hero as a photo LCP.


## Bricks-aware layout & button measurements (supplemental — preferred over the earlier "Spacing & Layout" table)

> The original spacing capture used bare `header`/`main`/`footer` selectors which Bricks leaves at `0px`. These values come from `.brxe-section` / `.brxe-button` / Bricks header & footer wrappers and are what Phase 3 should use.

### Hero / section spacing

| Token | Desktop | Mobile |
|-------|---------|--------|
| First section background | rgb(245, 245, 245) | rgb(245, 245, 245) |
| First section padding   | `0px` | `0px` |
| Distinct section paddings (desktop) | `0px`, `40px 0px`, `0px 40px`, `20px 0px` |   |
| Distinct section paddings (mobile)  |   | `0px`, `0px 20px 20px`, `0px 20px`, `30px 20px 20px`, `20px 0px` |

### Header (top of page)

| | Desktop | Mobile |
|---|---------|--------|
| tag/classes | `HEADER`  | `HEADER` |
| padding | `0px` | `0px` |
| backgroundColor | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) |
| rendered height | 133.140625px | 177.015625px |

### Footer

| | Desktop | Mobile |
|---|---------|--------|
| padding | `0px` | `0px` |
| backgroundColor | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) |
| color | rgb(97, 97, 97) | rgb(97, 97, 97) |

### Real `.brxe-button` measurements (use these in Phase 3, not the typography-table button row)

| # | Text | Desktop bg / text | Padding | Radius | Size / weight |
|---|------|--------------------|---------|--------|---------------|
| 1 |  | rgba(0, 0, 0, 0) / rgb(33, 33, 33) | `0px` | `0px` | 18px / 400 |
| 2 |  | rgba(0, 0, 0, 0) / rgb(0, 0, 0) | `0px` | `0px` | 18px / 400 |
| 3 |  | rgba(0, 0, 0, 0) / rgb(255, 255, 255) | `0px 30px` | `0px` | 18px / 400 |

### Container max-widths (first 5 `.brxe-container` / direct section children)

| # | Desktop maxWidth | Desktop padding | Mobile maxWidth | Mobile padding |
|---|------------------|-----------------|-----------------|----------------|
| 1 | `100%` | `0px` | `100%` | `10px 20px 0px` |
| 2 | `100%` | `0px` | `100%` | `0px 20px` |
| 3 | `100%` | `80px 0px` | `100%` | `0px 20px 40px` |
| 4 | `100%` | `0px` | `100%` | `0px` |
| 5 | `100%` | `0px` | `100%` | `0px` |
