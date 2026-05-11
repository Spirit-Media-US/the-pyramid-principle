#!/usr/bin/env node
// Programmatic Bricks-page → typed-block JSON parser.
// Usage: node scripts/parse-page.mjs <slug>
//   (expects _source/<slug>.html to exist; writes src/data/pages/<slug>.json)
//
// Produces an array of typed blocks. Each block:
//   { type, id, ...payload }
// Where `type` is one of the section-level types this site renders:
//   hero-intro, highlight-cards, featured-podcasts, video-popup-grid,
//   photo-carousel, player-profile-grid, dedication, media-contact-card,
//   interview-questions, story-section, etc.
//
// Image filenames are mapped to Sanity URLs via /tmp/tpp-sanity-map.json
// (the existing 170-asset map). Missing assets are logged at the end.
//
// URL rewriting:
//   - https://wordpress-1227270-4701771.cloudwaysapps.com/tpp/foo/  →  /foo/
//   - #brxe-* fragment anchors are stripped (Bricks element IDs)
//   - third-party deep links (wikipedia, buzzsprout, hoag, etc.) preserved verbatim
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parse } from 'node-html-parser';

const slug = process.argv[2];
if (!slug) { console.error('Usage: node scripts/parse-page.mjs <slug>'); process.exit(1); }
const sourcePath = `_source/${slug}.html`;
const outPath = `src/data/pages/${slug}.json`;
const sanityMapPath = '/tmp/tpp-sanity-map.json';

const html = readFileSync(sourcePath, 'utf8');
const root = parse(html);

const sanityMap = existsSync(sanityMapPath) ? JSON.parse(readFileSync(sanityMapPath, 'utf8')) : {};
const missingAssets = new Set();
function resolveImage(srcOrFile) {
  if (!srcOrFile) return null;
  const filename = srcOrFile.split('/').pop().split('?')[0];
  if (sanityMap[filename]) return { file: filename, sanityUrl: sanityMap[filename].sanityUrl, dims: sanityMap[filename].dimensions };
  missingAssets.add(filename);
  return { file: filename, sanityUrl: null, dims: null };
}

function rewriteUrl(href) {
  if (!href) return null;
  // Strip Bricks element-id fragments (#brxe-*)
  href = href.replace(/#brxe-[a-z0-9]+/g, '');
  // Cloudways /tpp/* → local
  if (/cloudwaysapps\.com\/tpp(\/|#|\?|$)/.test(href)) {
    return href.replace(/^https?:\/\/[^/]+\/tpp/, '') || '/';
  }
  if (/^https?:\/\/[^/]+\/?$/.test(href) && /cloudwaysapps/.test(href)) return '/';
  return href; // external link — preserved
}

function imgSrc(imgEl) {
  return imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || imgEl.getAttribute('src') || '';
}

function textOf(el) { return (el?.text || '').replace(/\s+/g, ' ').trim(); }

const main = root.querySelector('#brx-content') || root.querySelector('main');
if (!main) { console.error('No <main> found'); process.exit(1); }

// Page title + meta description from <head>
const docTitle = root.querySelector('title')?.text || '';
const docDesc = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';

const blocks = [];

// ── HEAD METADATA ──
blocks.push({ type: '_meta', title: docTitle, description: docDesc, slug });

// ── SECTION 1 — hero-intro ──
const s1 = root.querySelector('#brxe-63667e');
if (s1) {
  const h6 = s1.querySelector('h6')?.text.trim();
  // Only h1+h2/h3 in the hero section's own scope (the rest are in nested sections)
  const heroBlock = s1.querySelector('#brxe-rrukim, .brxe-block') || s1;
  const h1 = s1.querySelector('h1')?.text.trim();
  // body P: find .brxe-text-basic / p immediately in the hero block
  const heroPara = s1.querySelector('.brxe-text-basic')?.text.trim().replace(/\s+/g, ' ');
  // sidebar image — valley_109.jpg referenced twice; take the FIRST visible img in the hero region
  const heroImg = s1.querySelector('img');
  const img = heroImg ? resolveImage(imgSrc(heroImg)) : null;
  blocks.push({
    type: 'hero-intro',
    id: s1.getAttribute('id'),
    eyebrow: h6,
    h1: h1,
    body: heroPara,
    image: img,
  });
}

// ── HIGHLIGHT-CARDS — actually nested inside the hero block #brxe-55ba7b ──
const heroBlock = root.querySelector('#brxe-55ba7b');
if (heroBlock) {
  // The 4 callout cards are .brxe-block children with specific known IDs
  const cardIds = ['brxe-kdqabc', 'brxe-qgrxhs', 'brxe-hqbltg', 'brxe-yfpzks'];
  const items = cardIds.map(cid => {
    const el = heroBlock.querySelector('#' + cid);
    return el ? el.text.replace(/\s+/g, ' ').trim() : null;
  }).filter(Boolean);
  if (items.length === 0) {
    // Fallback
    items.push(
      'JOHN VALLELY BATTLED THE BEST 2X NCAA CHAMPION AT UCLA',
      'JOHN VALLELY BATTLED THE BIGGEST FIGHT AGAINST BANK OF AMERICA',
      'John Battled the most brutal cancer as a survivor and warrior',
      "HIS COACH'S PROVEN LIFE PRINCIPLES GUIDED HIM AND GAVE HIM THE STRENGTH TO FIGHT WITH UNDYING FAITH",
    );
  }
  blocks.push({ type: 'highlight-cards', id: 'brxe-55ba7b', items });
}

// ── SECTION 3 — featured-podcasts ──
const s3 = root.querySelector('#brxe-hapjdg');
if (s3) {
  const heading = s3.querySelector('h2')?.text.trim() || 'Featured Podcasts';
  // Find image+link pairs
  const cards = [];
  const links = s3.querySelectorAll('a');
  links.forEach(a => {
    const href = a.getAttribute('href');
    const innerImg = a.querySelector('img');
    if (href && innerImg) {
      cards.push({
        href: rewriteUrl(href),
        image: resolveImage(imgSrc(innerImg)),
      });
    }
  });
  blocks.push({ type: 'featured-podcasts', id: s3.getAttribute('id'), heading, cards });
}

// ── SECTION 4 — story carousel + video popup grid ──
// User-confirmed templateId → YouTube ID mapping
const VIDEO_TEMPLATE_MAP = {
  '1509': 'lfSEgefu5O8',
  '1534': '9zOvZV8f9pQ',
  '1541': 'aXvkH0lt6d0',
  '1545': '2Jof-F0PqFU',
  '1548': 'GkTA5ePOaAg',
  '1552': 'TCTOkcqDyiE',
  '1555': 'BDDFnMR7ogo',
  '1558': 'UGHu9ErBqvo',
  '1561': 'VsL68tGphGI',
};

// Video-popup-grid lives in #brxe-glibgo. Heading lives in #brxe-ccqjqa.
const videoSection = root.querySelector('#brxe-glibgo');
const headingSection = root.querySelector('#brxe-ccqjqa');
if (videoSection) {
  const heading = headingSection?.querySelector('h2')?.text.trim() || 'A heart-gripping story of championship resilience';
  const tiles = [];
  const seen = new Set();
  videoSection.querySelectorAll('[data-interactions]').forEach(el => {
    const json = el.getAttribute('data-interactions') || '';
    const m = json.match(/"templateId":"(\d+)"/);
    if (!m) return;
    const tid = m[1];
    if (!VIDEO_TEMPLATE_MAP[tid] || seen.has(tid)) return;
    seen.add(tid);
    const innerImg = el.querySelector('img');
    const posterSrc = innerImg ? imgSrc(innerImg) : null;
    tiles.push({
      templateId: tid,
      youtubeId: VIDEO_TEMPLATE_MAP[tid],
      poster: posterSrc && !posterSrc.startsWith('data:') ? resolveImage(posterSrc) : null,
      posterCdn: `https://i.ytimg.com/vi/${VIDEO_TEMPLATE_MAP[tid]}/maxresdefault.jpg`,
    });
  });
  blocks.push({ type: 'video-popup-grid', id: 'brxe-glibgo', heading, tiles });
}

// ── SECTION 5 — DEDICATION + player-profile-grid ──
const s5 = root.querySelector('#brxe-zzvjem');
if (s5) {
  const h2s = s5.querySelectorAll('h2').map(h => h.text.trim());
  const paras = s5.querySelectorAll('.brxe-text-basic').map(p => p.text.replace(/\s+/g, ' ').trim()).filter(Boolean);
  // The first H2 is "DEDICATION", body is paragraphs that follow
  // Then 2nd H2 "John Vallely played beside college basketball greats…" + 5 player cards
  // Find a-tags with images (the 5 wiki-linked profile cards)
  const playerCards = [];
  s5.querySelectorAll('a').forEach(a => {
    const innerImg = a.querySelector('img');
    const href = a.getAttribute('href');
    if (innerImg && href && href.includes('wikipedia.org')) {
      // Try to extract name from caption or img alt
      const card = a.closest('.brxe-block, .brxe-div, .brxe-container') || a.parentNode;
      const caption = card?.querySelector('.brxe-text-basic, .brxe-text, h3, h4, p')?.text.trim() || innerImg.getAttribute('alt') || '';
      playerCards.push({
        name: caption.slice(0, 60),
        href,
        image: resolveImage(imgSrc(innerImg)),
      });
    }
  });
  blocks.push({
    type: 'dedication-and-players',
    id: s5.getAttribute('id'),
    dedicationHeading: h2s[0] || 'DEDICATION',
    dedicationBody: paras[0] || '',
    playersHeading: h2s[1] || 'John Vallely played beside college basketball greats…',
    playerCards,
  });
}

// ── SECTION 6 — media-contact-card ──
const s6 = root.querySelector('#brxe-nglrme');
if (s6) {
  const heading = s6.querySelector('h2')?.text.trim();
  const sub = s6.querySelector('h3')?.text.trim();
  const paras = s6.querySelectorAll('.brxe-text-basic').map(p => p.text.replace(/\s+/g, ' ').trim());
  const bgImg = s6.querySelector('img');
  blocks.push({
    type: 'media-contact-card',
    id: s6.getAttribute('id'),
    heading,
    sub,
    body: paras.join('\n\n'),
    image: bgImg ? resolveImage(imgSrc(bgImg)) : null,
  });
}

// ── SECTION 7 — interview-questions ──
const s7 = root.querySelector('#brxe-ferycf');
if (s7) {
  const heading = s7.querySelector('h2')?.text.trim();
  const sub = s7.querySelector('h3')?.text.trim();
  // Numbered list items
  const olItems = (s7.querySelectorAll('ol li').length
    ? s7.querySelectorAll('ol li').map(li => li.text.trim())
    : s7.querySelectorAll('ul li').map(li => li.text.trim())
  );
  const images = s7.querySelectorAll('img').map(i => resolveImage(imgSrc(i)));
  blocks.push({
    type: 'interview-questions',
    id: s7.getAttribute('id'),
    heading,
    sub,
    items: olItems,
    images,
  });
}

// Write JSON
writeFileSync(outPath, JSON.stringify(blocks, null, 2));
console.log(`✅ Wrote ${blocks.length} blocks to ${outPath}`);
console.log('Block types:', [...new Set(blocks.map(b => b.type))].join(', '));

if (missingAssets.size > 0) {
  console.log(`\n⚠️  ${missingAssets.size} missing Sanity assets (need upload):`);
  for (const f of missingAssets) console.log('  - ' + f);
}
