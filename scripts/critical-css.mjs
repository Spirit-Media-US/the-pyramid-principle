#!/usr/bin/env node
/**
 * Phase 7 critical-CSS extractor.
 *
 * Runs Beasties (maintained fork of Critters) across every dist/*.html file
 * after Astro builds. Beasties parses the rendered DOM, extracts the CSS
 * selectors that match above-the-fold (and any) elements on each page, and:
 *
 *   1. Inlines that critical CSS into the page's <head>
 *   2. Replaces the original <link rel="stylesheet"> tags with a JS-injected
 *      lazy-loader (preloadMode: 'js-lazy') that creates <link rel="stylesheet">
 *      elements on requestIdleCallback. NO media="print" onload swap — the
 *      Phase 5/6 attempts using that pattern caused CLS regressions on this
 *      site (see CLAUDE.md Phase 6 notes). The js-lazy mechanism appends a
 *      real stylesheet link via JS, so when the deferred CSS arrives it
 *      doesn't trigger a media-state swap that the prior pattern did.
 *
 * The deferred CSS is pruned (pruneSource: true) so it only carries the
 * below-fold rules — the critical rules already in <head> are stripped.
 *
 * If FOUC or CLS regressions appear in PSI median measurements, revert
 * the build pipeline change and remove this script.
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import Beasties from 'beasties';

const DIST = new URL('../dist/', import.meta.url).pathname;

/** Recursively collect every *.html file under a directory. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const p = join(dir, entry);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...await htmlFiles(p));
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

const beasties = new Beasties({
  path: DIST,
  publicPath: '/',
  preload: 'js-lazy',     // JS-appended <link rel=stylesheet> on idle. NO media=print.
  inlineFonts: false,
  keyframes: 'critical',  // Only inline keyframes used by critical selectors.
  // pruneSource: true was tested first but caused A11y/BP regressions
  // because Beasties' "non-critical" classification stripped CSS rules
  // for visible elements (image-aspect-ratio, target-size audits dropped
  // to 0). Keeping the deferred CSS as the FULL original sheet is safer:
  // duplicate bytes are tolerable but missing rules aren't.
  pruneSource: false,
  minimumExternalSize: 0, // Don't auto-inline pruned remainders.
  inlineThreshold: 0,
  logLevel: 'silent',
});

const files = await htmlFiles(DIST);
let processed = 0;
let critIn = 0;
let critOut = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const before = html.length;
  const out = await beasties.process(html);
  await writeFile(file, out);
  critIn += before;
  critOut += out.length;
  processed++;
}

const delta = critOut - critIn;
const sign = delta >= 0 ? '+' : '';
console.log(`critical-css: processed ${processed} files, ${sign}${(delta / 1024).toFixed(1)}KB HTML`);
