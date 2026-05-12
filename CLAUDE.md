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
  - `/retailers/` ISBN list — verify with Kevin that all 5 ISBNs are final/correct: Paperback 979-8-89307-115-3, Hardback 979-8-89307-116-0, Audiobook 979-8-89307-118-4, eBook 979-8-89307-117-7. If any format (hardback/eBook/audiobook) hasn't been issued yet, hide those rows until ready.
  - `/retailers/` LCCN 2024918727 — verify with Kevin.
  - `/retailers/` Spirit Media publisher URL — source lists `www.wordpress-1227270-4701771.cloudwaysapps.com` (Cloudways staging). Set to placeholder `https://spiritmediapublishing.com/` in the build. Confirm the canonical publisher URL with Kevin and update both the Retailers page and the footer Spirit Media link to match.
  - `/retailers/` semantic re-shape — source uses double-H3 markup for ISBN label/value pairs (Bricks editor quirk) and H3-per-crumb for BISAC category breadcrumbs. The rebuild re-semanticizes these as `<dl>/<dt>/<dd>` (ISBN) and `<nav><ol>` with literal `›` separators (breadcrumbs) for accessibility. Phase 6 polish if Kevin wants to revert.
  - `/retailers/` Amazon Global Marketplaces inner H2 — source reads "Amazon Global Marketplaces :" with an awkward space before the colon. Preserved verbatim per Phase 3 fidelity. Confirm with Kevin whether to tidy to "Amazon Global Marketplaces:" (no space).
  - `/retailers/` Amazon "Netherland" button — source spelling is "Netherland" (singular). Preserved verbatim. Confirm with Kevin whether to correct to "Netherlands".
  - `/retailers/` US Amazon URL — source had the full search-result tracking URL with `?_encoding=UTF8&dib_tag=se&dib=…&qid=…&sr=8-4` (the tracking params attribute the click to a specific in-app search). Stripped to the clean canonical `/dp/B0DGY1WNQG`.
  - `/retailers/` Australia Amazon URL FIXED — source had `https://www.amazon.ca/dp/B0DGX5YWDC` (Canada URL) for the Australia button — a copy-paste error in the live build. Replaced with `https://www.amazon.com.au/dp/B0DGX5YWDC`. Confirm with Kevin that the book is actually listed on amazon.com.au under this ASIN; if not yet listed there, the button should either link to a fallback URL or be hidden until launch.
  - `/retailers/` Other International Retailers H2 — source reads "Other International Retailers : " with an awkward space before the colon AND trailing space. Preserved verbatim. Cleanup with the "Amazon Global Marketplaces :" formatting quirk.
  - `/retailers/` Sweden retailer URL — source had Google Shopping tracking params (`?srsltid=AfmBOoor…`); stripped to the canonical `https://www.akademibokhandeln.se/bok/the-pyramid-principle/9798893071160`.
  - `/retailers/` France international button — links to `bol.com` Belgium (`/be/fr/` path), not an actual French retailer. Confirm with Kevin whether the label should be "Belgium" or the URL should be replaced with a real French retailer (Fnac, Cultura, etc.).
  - `/retailers/` United Kingdom international button — links to `best-book-price.co.uk`, a price aggregator (not a primary retailer). Confirm with Kevin if there's a preferred direct UK retailer (Waterstones, Foyles, Blackwell's, Hive.co.uk).
  - `/retailers/` Translation Editions section conflict — homepage Latest Blog has posts announcing the Chinese, Portuguese, and Spanish editions as published, but the Retailers page Translation grid is captioned "Other languages are coming soon …." (4-dot ellipsis). Two scenarios: (a) blog posts are premature and the translations aren't actually shipped yet, or (b) this Retailers caption is stale and the translations have already launched. Confirm with Kevin which is true and fix the inconsistent messaging.
  - `/retailers/` Translation grid Spanish cover — source filename is `unnamed-683x1024.jpg` (generic auto-name). Confirm with Kevin whether this is the final Spanish edition cover or a placeholder needing replacement before launch.
  - `/retailers/` Translation grid heading — source uses "Other languages are coming soon ...." (4-dot ellipsis, four periods). Preserved verbatim per Phase 3. Phase 6 polish: replace with proper `…` (U+2026) ellipsis character or 3-dot.
  - `/retailers/` Translation grid Chinese label — source has two adjacent H3 elements ("CHINESE " with trailing space + "( Mandarin )" with internal spaces) treated as a single label split across two lines. Re-semanticized as one `<h3>` ("Chinese") + a smaller `<p>` sublabel ("(Mandarin)") for clearer document outline. Phase 6 polish if Kevin wants the source double-H3 markup back.
  - `/retailers/` Heart-Gripping Story callout subtitle — source reads "Erin's Story of Courage Brings Hope, Healing, and Deliverance to Everyone fighting Cancer." with lowercase "fighting" and capital "Cancer". Same mid-sentence capitalisation quirk appears on the homepage footer Give-Courage block ("Families fighting CAncer…"). Phase 6 polish: pick one casing and apply consistently across both occurrences.
  - `/retailers/` Heart-Gripping Story callout images — files are named `6-1.png` and `7-1.png` (generic auto-names from a campaign asset folder). Both are 1250x750 PNGs already in Sanity. Confirm with Kevin what these depict and add meaningful alt text before launch.
  - `/retailers/` Global Interest stat callout — source uses an `<h3>` element for what is semantically a long-form stat paragraph ("American Basketball is a popular sport globally, with over 3.3 billion fans …"). Re-rendered as `<p>` with the same Libre Baskerville italic styling. Markup re-shape only; visual identical to source.
  - `/retailers/` Global Interest stat callout copy — slightly awkward "American Basketball" capitalisation; reading flows better as "American basketball" or just "basketball". Flag for client polish. Also the 3.3 billion fans / 68→74% growth stats have no citation in source — add a source or remove.
  - `/retailers/` Global Interest right-column images — filenames `sxLWowjDTE2A98z7JXVezg-1024x375.png` and `fyheb_01-1024x538.jpg` are random hashes; `Global-Leadership.jpg` is descriptive. All three already in Sanity. Confirm content with Kevin and add meaningful alt text before launch.
  - **`/retailers/` image-licensing audit required before launch.** This page imports multiple third-party / stock-source images that may not have transferable licenses from the Cloudways WP install:
    - `USATSI_8741865.webp` — USA Today Sports Images (already flagged on Wooden About-UCLA).
    - `gettyimages-1245851899-612x612-transformed.jpeg` — Getty Images. NBA Stats Card 1 ("Younger audiences"). Confirm Getty subscription/license transfers to the new site domain, or swap.
    - `SLIKA-4-1.webp` — "SLIKA" is Slovenian/Croatian for "image"; likely a translated/sourced stock photo. NBA Stats Card 2 ("International players"). Verify.
    - `images.png` — literally `images.png` at 225×225 (Google Images default thumbnail dimensions). NBA Stats Card 3 ("Social media"). Almost certainly downloaded from a Google Images search result and not licensed — needs replacing before launch.
    - `EVP-1693249197814.webp` — filename has a Unix timestamp (Aug 28 2023). NBA Stats Card 4 ("Global social responsibility"). Verify source/license.
    Action: compile a single licensing-review batch for Kevin to clear before main-merge. Replace anything that can't be verified.
  - `/retailers/` NBA Stats Grid copy — cites "200 countries", "50 languages", "26%", "2.3 billion" etc. with no source/citation in source content. Confirm with Kevin if these need attribution or are acceptable as marketing claims.
  - `/retailers/` India section copy — cites "100 million unique viewers" for the NBA 2022-23 season in India with no citation. Confirm with Kevin or remove.
  - `/retailers/` Populations list — source has the full list duplicated for responsive purposes (single-col mobile markup + 2-col desktop markup, with display:none toggling between them). Rebuilt as a single semantic 2-`<ul>` structure with CSS grid layout (1 col mobile, 2 cols desktop). Visual identical to source on both viewports without the markup duplication.
  - `/retailers/` Populations list copy — cites 1.42B / 1.44B / 745M / etc. with no source citation. Confirm with Kevin if these need attribution.
  - `/retailers/` Populations list logical issue — "Spanish (all) – 575M" includes Brazil as a sub-item (Brazil's primary language is Portuguese, not Spanish). Either the parent label should be "Latin America" / "Lusophone + Hispanophone" or Brazil should not be nested under "Spanish". Flag for Kevin to clarify intent.
  - `/retailers/` Populations image (`ag-pic-PllbLCTilUo-unsplash.jpg`) — Unsplash source, permissive license, no clearance concern. Confirm with Kevin what the photo depicts for proper alt text (currently empty).
  - `/retailers/` Top 20 Languages list item 1 "English 1.4B" — missing the em-dash that every other item has ("English **1.4B**" vs "Mandarin (Chinese) **– 1.3B**"). Source inconsistency, preserved verbatim. Phase 6 polish — add the em-dash.
  - `/retailers/` Top 20 Languages list item 11 "Indonesians – 199M" — "Indonesians" is the people; the language is "Indonesian" (singular). Likely a typo. Preserved verbatim. Confirm with Kevin.
  - `/retailers/` Top 20 Languages bold treatment — items 1-4 (English, Mandarin, Hindi, Spanish) and item 13 (Japanese) are bold; all others regular. The bolded set matches the book's current + planned translation editions (per homepage Latest Blog + Section 6 "Translation Editions Coming Soon"). Editorial signal is intentional — verified with Kevin.
  - `/retailers/` Top 20 Languages population stats — no source citation. Same question as the Populations section.
  - `/retailers/` Top 20 Languages image (`dan-gold-xy4zPgetBQg-unsplash.jpg`) — Unsplash source, photographer credit Dan Gold. Alt text set to "Photo by Dan Gold on Unsplash" per Unsplash's recommended (not required) attribution practice.
  - `/the-pyramid-success/` Section 4 "Walt Hazzard, Gail Goodrich, Lucius Allen, and Keith Erickson" profile card — source has NO bio paragraph and NO "Learn More" link, only an H3 heading + 4 photos. Likely a content gap left unfinished by the client. Confirm with Kevin: (a) provide bio content for these 4 players; (b) provide Learn More link(s) — separate Wikipedia links per player, one combined link, or none. Phase 6 follow-up.
  - `/give-courage/` Section 1 carousel — all 11 photos are stock-library cancer/illness imagery (filenames carry timestamp patterns like `2023-11-27-05-30-11-utc` typical of stock services). Image-licensing audit required before launch: verify each photo can transfer to the new site domain. Most are ~30KB ezgif-converted webps with generic descriptive filenames suggesting a single stock library was bulk-licensed for the WP install — confirm the license is still valid on the production domain.
  - `/give-courage/` Section 1 banner copy — "Cancer" vs "cancer" capitalization is inconsistent across the site (some headings capitalize "Cancer" mid-sentence, others use lowercase). Source on this page renders "FIGHTING CANCER" all-caps via the H2's text-transform. Phase 6 polish: standardize capitalization rules sitewide for body copy. See related items on /retailers/ and homepage footer.
  - `/the-pyramid-success/` Section 4 Lynn Shackelford card — spelling inconsistency between heading ("Shackelford") and image filenames ("Shackleford", no "e"). Heading matches Wikipedia and is correct. The 2 image filenames carry the misspelling but don't surface to readers — preserved verbatim per Phase 3. Flag for awareness; no action needed unless Kevin wants the alt text to read "Shackelford" with the canonical spelling.
  - `/the-pyramid-success/` Section 4 Ron Von Hagen card hero image (`Screenshot-at-Oct-04-03-16-25.png`) — generic screenshot filename suggests an ad-hoc screen capture (date in filename matches Oct 4, 2024). Verify with Kevin what the screenshot depicts (likely a Von Hagen-related sports archive/wiki page or video frame) and confirm licensing — screenshots of copyrighted material may not transfer to the new domain. Already in the broader image-licensing audit batch but flagged separately here for the Von Hagen card.
  - `/the-pyramid-success/` Section 4 Hazzard et al. card image 3 (`Walt_Frazier_and_Lucius_Allen.jpeg`) — filename references Walt **Frazier** (not Walt **Hazzard**, who heads this card). Walt Frazier has no UCLA connection (played at Southern Illinois, then NY Knicks). Either the filename is wrong and the photo actually depicts Hazzard, or the photo is genuinely of Frazier and was misplaced into the Hazzard et al card. Flag for Kevin to verify the photo's identity before launch — if Frazier, replace with a Hazzard photo; if mislabeled, update the alt text to clarify.
  - `/the-pyramid-success/` Section 4 source HTML has Bricks-editor leftovers throughout — deeply nested `<b><b><b>` tags and empty `<a>` (Wikipedia link) wrappers without `href` inside paragraph text. Rebuild strips them and renders clean semantic markup (text inside `<p>` without redundant nesting). No visible regression — visual identical, accessibility improved.
  - `/the-pyramid-success/` Section 4 Orange Coast College profile card — image `Orange-Coast-College-Science-Building-GRI-14-1024x827-1.jpg` is from the Julius Shulman photography archive (1936-1997). Filename hints at Getty Research Institute (GRI) source. Verify image licensing transfers to the new site domain before launch — Shulman estate licenses are typically per-publication. May need replacement.
  - `/the-pyramid-success/` Section 4 profile-card images — many other filenames are random-hash auto-names or third-party stock similar to /retailers/ findings. Licensing audit needed before launch: `GettyImages-395004-1024x688-1.jpg` (Denny Crum — Getty Images), `s-l400.jpg`/`s-l1200.webp` (Denny Crum + Lynn Shackelford — eBay listing thumbnails), `images.jpeg` (Gary Cunningham — generic name, likely Google Images), `85fd5123…3f3d8.webp` (Denny Crum — random hash), `45536_f544bedd643a88d6_001.jpg` (Walt Hazzard et al — random hash). Verify each can transfer to the new domain or replace before main-merge.
  - `/the-pyramid-success/` Section 4 profile-card images — all 34 photos have empty alt text in source; preserved in rebuild. Add meaningful alt text per image before launch (or before main-merge).
  - `/the-pyramid-success/` Section 4 Greg Lee card image 2 (`308578103_3075608022585560_4295920655483154845_n.jpg`) — Facebook-uploaded image (filename pattern `<FB-photo-id>_<FB-fbid>_<FB-uploader-id>_n.jpg`). Re-hosted from the WP install. Verify licensing/permission with the original FB uploader before launch — Facebook photos are not public-domain by default. Same concern as the Coach Wetzel card's 3 photos.
  - `/the-pyramid-success/` Section 4 Coach Wetzel card — all 3 photos are Facebook-uploaded images. Source filenames start with Facebook photo IDs `300997137_…`, `301011092_…`, `301137185_…` followed by Facebook fbid + uploader-id + naming-hash. These were grabbed from a Facebook profile/page and re-hosted on the WP install. Verify licensing/permission with the original uploader before launch — Facebook photos are not public-domain by default; permission to redistribute outside the platform should be confirmed.
  - `/the-pyramid-success/` Section 1 hero (#brxe-7d2e09) eyebrow uses `<h3>` for the small "THE PYRAMID PRINCIPLE" caption. Source styles it 15px Montserrat (10px mobile) — visually a small eyebrow caption, not a section heading. Heading-level outline is unusual: this H3 outranks subsequent H3s elsewhere in the page (when later sections are added). Preserved verbatim per Phase 3 fidelity. Phase 6 review: downgrade to `<p class="tc-eyebrow">` or change tag without changing styling.

### Phases 5-9
- [ ] Pending

## DNS Pattern

Not yet chosen. Default = **Pattern 1** (registrar DNS → Pages, nameservers stay at current registrar). To use Pattern 2 (move DNS to Cloudflare for orange-cloud apex), add an explicit opt-in line here with reason AND get Kevin's confirmation BEFORE touching DNS — see migration CLAUDE.md Step 1c.

## Rules

- All work goes to the **dev** branch — never push directly to main
- Only merge dev to main when Kevin says "push to main"
- Media never in git: images → Sanity, audio → R2, video → YouTube iframe
- External image URLs banned (must resolve to `cdn.sanity.io` or `assets.spiritmediapublishing.com`) — scan before completing Phases 4 and 7
