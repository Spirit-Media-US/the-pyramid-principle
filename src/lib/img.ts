// Image helper — resolves original WP filename / URL to Sanity CDN URL.
// Phase 4 will replace this with Sanity content-document references and
// the `urlFor()` builder; for Phase 3 the map is the bridge.
import map from '../data/sanity-images.json';

type Asset = { originalUrl: string; sanityUrl: string; alt: string; sanityAssetId: string; size: number; dimensions: { width: number; height: number; aspectRatio: number } | null };

const byFilename: Record<string, Asset> = map as any;

const byOriginalUrl: Record<string, Asset> = {};
for (const a of Object.values(byFilename)) byOriginalUrl[a.originalUrl] = a;

export function img(filenameOrUrl: string): Asset {
  const a = byFilename[filenameOrUrl] || byOriginalUrl[filenameOrUrl];
  if (!a) throw new Error(`No Sanity asset for "${filenameOrUrl}". Check src/data/sanity-images.json.`);
  return a;
}

// Generate a transformed Sanity URL. The Sanity image pipeline supports `?w=`,
// `?h=`, `?fm=webp`, `?q=80`, `?auto=format`, `?fit=max|crop`, etc.
// `width` is required for Trait 1 (pre-resized hero per viewport).
export function srcW(filenameOrUrl: string, width: number, opts: { fm?: 'webp'|'jpg'|'png'; q?: number; fit?: 'max'|'crop' } = {}): string {
  const a = img(filenameOrUrl);
  const params = new URLSearchParams({
    w: String(width),
    fm: opts.fm ?? 'webp',
    q: String(opts.q ?? 80),
    fit: opts.fit ?? 'max',
  });
  return `${a.sanityUrl}?${params.toString()}`;
}

// Two-entry srcset for the hero pattern: mobile + desktop.
export function heroSrcset(filenameOrUrl: string, opts: { mobile?: number; desktop?: number } = {}): { mobile: string; desktop: string; srcset: string; sizes: string } {
  const mobile = opts.mobile ?? 640;
  const desktop = opts.desktop ?? 1200;
  const mU = srcW(filenameOrUrl, mobile);
  const dU = srcW(filenameOrUrl, desktop);
  return {
    mobile: mU,
    desktop: dU,
    srcset: `${mU} ${mobile}w, ${dU} ${desktop}w`,
    sizes: `(max-width: 640px) ${mobile}px, ${desktop}px`,
  };
}

// Natural dimensions from Sanity for width/height attrs.
export function dims(filenameOrUrl: string): { width: number; height: number } {
  const a = img(filenameOrUrl);
  if (!a.dimensions) return { width: 1200, height: 675 };
  return { width: a.dimensions.width, height: a.dimensions.height };
}

// Alt text from the WP source (mostly empty — flagged in images.md for client fill).
export function alt(filenameOrUrl: string, fallback = ''): string {
  return img(filenameOrUrl).alt || fallback;
}
