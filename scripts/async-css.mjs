#!/usr/bin/env node
/**
 * Post-build: convert SOME render-blocking <link rel="stylesheet"> tags
 * into async-loaded ones via the media="print" onload swap.
 *
 * Strategy: only defer page-scoped CSS bundles (index.*, [page-slug].*).
 * Keep the shared Layout bundle (_slug_.*) blocking so header / nav / global
 * tokens render with full styling at FCP. Page-scoped CSS contains mostly
 * below-fold component styles; those arriving 200-400ms after FCP causes
 * minor visual settling but no LCP-breaking CLS.
 *
 * Phase 6 fully-async approach was reverted on TPP — without the _slug_
 * bundle the header had no styling at FCP, causing CLS regression. Phase 7
 * Beasties also reverted because it pruned essential layout-driving CSS.
 *
 * This middle-ground keeps the shared Layout bundle render-blocking and
 * just defers the per-page leaf bundles.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

// CSS bundles to KEEP render-blocking (do NOT defer):
//   - _slug_.*.css        — the dynamic-route Layout bundle (header, footer, base)
// Every other /_astro/*.css gets async'd.
const KEEP_BLOCKING = /\/_astro\/_slug_\.[A-Za-z0-9_-]+\.css/;

function walk(dir) {
	const out = [];
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name);
		const stat = fs.statSync(p);
		if (stat.isDirectory()) out.push(...walk(p));
		else if (name.endsWith('.html')) out.push(p);
	}
	return out;
}

const re = /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g;
let converted = 0;
let kept = 0;
for (const file of walk(DIST)) {
	const before = fs.readFileSync(file, 'utf8');
	const after = before.replace(re, (m, href) => {
		if (KEEP_BLOCKING.test(href)) {
			kept++;
			return m; // leave render-blocking
		}
		converted++;
		// media="print" onload swap → non-blocking async CSS
		// <noscript> fallback keeps the site usable when JS is disabled
		return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
	});
	if (after !== before) fs.writeFileSync(file, after);
}
console.log(`async-css: deferred ${converted} stylesheet tag(s), kept ${kept} render-blocking`);
