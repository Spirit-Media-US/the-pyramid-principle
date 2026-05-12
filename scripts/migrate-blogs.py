#!/usr/bin/env python3
"""WP → Sanity blog migration for The Pyramid Principle.
- Parses each blog HTML for title, hero image, publish date, body
- Uploads hero image to Sanity
- Converts body HTML to portable-text blocks
- Creates one blogPost document per post via Sanity HTTP mutation API
Straight migration per Kevin's directive — no content enhancement.
"""
import os, re, ssl, sys, json, urllib.request, urllib.error, urllib.parse, mimetypes, time, uuid
from html import unescape
from html.parser import HTMLParser

# Source has a TLS hostname mismatch; bypass verify when fetching hero images.
INSECURE_CTX = ssl.create_default_context()
INSECURE_CTX.check_hostname = False
INSECURE_CTX.verify_mode = ssl.CERT_NONE

SANITY_PROJECT = "uenxsjdw"
SANITY_DATASET = "production"
SANITY_TOKEN = os.environ.get("SANITY_TOKEN", "")
ASSET_URL = f"https://{SANITY_PROJECT}.api.sanity.io/v2021-06-07/assets/images/{SANITY_DATASET}"
MUTATE_URL = f"https://{SANITY_PROJECT}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"

STAGING_HOST = "wordpress-1227270-4701771.cloudwaysapps.com"

POSTS = [
    "the-pyramid-principle-a-journey-of-faith-from-court-to-life",
    "spirit-media-publishes-the-pyramid-principle-by-john-vallely-with-paul-weissenstein",
    "the-pyramid-principle-now-available-in-chinese",
    "the-pyramid-principle-translated-into-portuguese",
    "the-pyramid-principle-by-john-vallely-with-paul-weissenstein-translated-into-spanish",
    "from-the-court-to-the-cause-dribble-for-a-cure-and-the-pyramid-principle-book-signing-on-october-6",
]


def http(method, url, *, data=None, headers=None, binary=False, insecure=False):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    ctx = INSECURE_CTX if insecure else None
    with urllib.request.urlopen(req, context=ctx) as r:
        body = r.read()
        return body if binary else body.decode("utf-8")


def upload_image(remote_url, filename=None):
    """Download remote image, upload to Sanity, return asset _id."""
    if not filename:
        filename = remote_url.rsplit("/", 1)[-1].split("?")[0]
    print(f"  ↪ uploading {filename}", file=sys.stderr)
    insecure = STAGING_HOST in remote_url
    img_bytes = http("GET", remote_url, binary=True, insecure=insecure)
    ct, _ = mimetypes.guess_type(filename)
    if not ct:
        ct = "image/jpeg"
    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": ct,
    }
    resp = http("POST", f"{ASSET_URL}?filename={urllib.parse.quote(filename)}",
                data=img_bytes, headers=headers)
    return json.loads(resp)["document"]["_id"]


# ─────────────────────────────────────────────────────────────────────────
# Source extraction
# ─────────────────────────────────────────────────────────────────────────

def extract_meta(html, slug):
    """Pull title, publish date, hero image URL from a WP post page."""
    # Title — h1 inside the post region (Bricks uses .brxe-post-title or similar)
    m = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    title = unescape(m.group(1)) if m else slug
    # Strip site-name suffix variants
    title = re.sub(r"\s+[-|]\s+(thepyramidprinciple\.org|The Pyramid Principle|TPP).*$", "", title).strip()

    # Publish date — try article:published_time meta
    m = re.search(r'<meta property="article:published_time" content="([^"]+)"', html)
    date = ""
    if m:
        date = m.group(1)[:10]  # YYYY-MM-DD
    else:
        m = re.search(r'<time[^>]*datetime="([^"]+)"', html)
        if m:
            date = m.group(1)[:10]

    # Hero image — og:image
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    hero = m.group(1) if m else None

    # Excerpt — og:description
    m = re.search(r'<meta property="og:description" content="([^"]+)"', html)
    excerpt = unescape(m.group(1)) if m else ""

    return {"title": title, "publishDate": date, "heroImage": hero, "excerpt": excerpt}


def extract_body_html(html):
    """Pull the post body HTML from the Bricks-rendered <section>.
    The TPP blog template uses a long article body inside a brxe-section.
    We find the title, then grab content until the page footer."""
    # Strategy: find the post content container. Bricks template wraps the
    # post body in containers with .brxe-text or similar. The simplest:
    # find everything between the H1 and the footer.
    # First, isolate <main> / <article> region.
    m = re.search(r'<section[^>]+class="[^"]*brxe-post-content[^"]*"[^>]*>(.*?)</section>',
                  html, re.S)
    if m:
        return m.group(1)
    # Fallback: look for the post-area Bricks container after the H1
    m = re.search(r'<h1[^>]*class="[^"]*brxe-post-title[^"]*"[^>]*>.*?</h1>(.*?)<footer',
                  html, re.S)
    if m:
        return m.group(1)
    # Final fallback: extract the main element content
    m = re.search(r'<main[^>]*>(.*)</main>', html, re.S)
    return m.group(1) if m else ""


# ─────────────────────────────────────────────────────────────────────────
# HTML → portable text
# ─────────────────────────────────────────────────────────────────────────

class BodyParser(HTMLParser):
    """Convert WordPress post HTML to a list of portable-text-like blocks.
    Output: list of dicts. Each block is either:
      { type: 'p' | 'h2' | 'h3', children: [span, ...] }
      { type: 'image', src, alt }
    A 'span' is { text, marks: [...], href: str|None }.
    """
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.cur_block = None  # current p/h2/h3 in progress
        self.cur_marks = []    # stack of decorators
        self.cur_href = None   # current link href (single-level only)
        self.skip_depth = 0    # ignore inside these tags (script, style, etc)
        self.skip_tags = {"script", "style", "noscript"}
        # Stack of tags we're "in" — for tracking nested formatting
        self.tag_stack = []

    def _open_block(self, btype):
        self._close_block()
        self.cur_block = {"type": btype, "children": []}

    def _close_block(self):
        if self.cur_block:
            # Drop empty paragraphs
            if any((s.get("text") or "").strip() for s in self.cur_block["children"]):
                self.blocks.append(self.cur_block)
        self.cur_block = None

    def _append_text(self, text):
        if not self.cur_block:
            self._open_block("p")
        self.cur_block["children"].append({
            "text": text,
            "marks": list(self.cur_marks),
            "href": self.cur_href,
        })

    def handle_starttag(self, tag, attrs):
        if self.skip_depth:
            self.skip_depth += 1
            return
        if tag in self.skip_tags:
            self.skip_depth = 1
            return
        self.tag_stack.append(tag)
        attrs_dict = dict(attrs)
        if tag in ("p", "div"):
            # paragraph break — open a new p block
            self._open_block("p")
        elif tag == "br":
            # treat as a soft break inside current block
            if self.cur_block:
                self.cur_block["children"].append({"text": "\n", "marks": [], "href": None})
        elif tag == "h1":
            # skip the post title (we capture it separately from og:title)
            self._open_block("p")  # eat content into a paragraph that we'll drop later
            self.cur_block["type"] = "h1-skip"
        elif tag == "h2":
            self._open_block("h2")
        elif tag == "h3":
            self._open_block("h3")
        elif tag == "h4":
            self._open_block("h3")  # demote
        elif tag in ("strong", "b"):
            self.cur_marks.append("strong")
        elif tag in ("em", "i"):
            self.cur_marks.append("em")
        elif tag == "a":
            href = (attrs_dict.get("href") or "").strip()
            # rewrite staging URLs to remove staging host
            if STAGING_HOST in href:
                # Convert staging URL to relative path if it's an internal link
                m = re.match(r"https?://" + re.escape(STAGING_HOST) + r"/tpp(/.+)", href)
                if m:
                    href = m.group(1)
                else:
                    href = href.replace(f"https://{STAGING_HOST}/tpp", "")
                    href = href.replace(f"http://{STAGING_HOST}/tpp", "")
                if not href:
                    href = None
            self.cur_href = href if href else None
        elif tag == "img":
            src = attrs_dict.get("src") or attrs_dict.get("data-src") or ""
            alt = attrs_dict.get("alt") or ""
            # Skip lazy-load placeholders (data:image/svg+xml SVG empty placeholders)
            if src.startswith("data:image/svg"):
                src = attrs_dict.get("data-src") or ""
            # Skip if not http(s)
            if src.startswith("http"):
                self._close_block()
                self.blocks.append({"type": "image", "src": src, "alt": alt})
        elif tag == "li":
            # treat list item as a paragraph prefixed with bullet
            self._open_block("p")
            self.cur_block["children"].append({"text": "• ", "marks": [], "href": None})
        elif tag in ("ul", "ol"):
            self._close_block()
        elif tag == "figure":
            self._close_block()

    def handle_endtag(self, tag):
        if self.skip_depth:
            self.skip_depth -= 1
            return
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        if tag in ("p", "div", "li", "h1", "h2", "h3", "h4"):
            self._close_block()
        elif tag in ("strong", "b"):
            try: self.cur_marks.remove("strong")
            except ValueError: pass
        elif tag in ("em", "i"):
            try: self.cur_marks.remove("em")
            except ValueError: pass
        elif tag == "a":
            self.cur_href = None

    def handle_data(self, data):
        if self.skip_depth:
            return
        if not data.strip() and not self.cur_block:
            return  # whitespace between blocks
        self._append_text(data)

    def finalize(self):
        self._close_block()
        # Drop the h1-skip blocks (post title is captured separately)
        return [b for b in self.blocks if b["type"] != "h1-skip"]


def html_to_portable_text(body_html):
    """Parse body HTML into portable text blocks."""
    parser = BodyParser()
    parser.feed(body_html)
    raw_blocks = parser.finalize()

    # Convert to Sanity portable text format
    out = []
    for b in raw_blocks:
        if b["type"] == "image":
            # Skip — image embeds in body. We can attach as separate uploaded images,
            # but for the simple TPP blog template the hero image is the main visual.
            # Track for diagnostic.
            continue
        if b["type"] in ("p", "h2", "h3"):
            style = "normal" if b["type"] == "p" else b["type"]
            children = []
            mark_defs = []
            href_to_key = {}
            for s in b["children"]:
                text = s["text"]
                if not text:
                    continue
                # Collapse internal whitespace but preserve single newlines
                text = re.sub(r"[ \t]+", " ", text)
                marks = list(s.get("marks") or [])
                href = s.get("href")
                if href:
                    key = href_to_key.get(href)
                    if not key:
                        key = "link_" + uuid.uuid4().hex[:10]
                        href_to_key[href] = key
                        mark_defs.append({"_key": key, "_type": "link", "href": href})
                    marks.append(key)
                children.append({
                    "_type": "span",
                    "_key": uuid.uuid4().hex[:10],
                    "text": text,
                    "marks": marks,
                })
            if not children:
                continue
            # Trim leading/trailing whitespace-only spans
            while children and not children[0]["text"].strip():
                children.pop(0)
            while children and not children[-1]["text"].strip():
                children.pop()
            if not children:
                continue
            block = {
                "_type": "block",
                "_key": uuid.uuid4().hex[:10],
                "style": style,
                "children": children,
                "markDefs": mark_defs,
            }
            out.append(block)
    return out


# ─────────────────────────────────────────────────────────────────────────
# Main migration loop
# ─────────────────────────────────────────────────────────────────────────

def migrate(slug):
    print(f"=== {slug} ===", file=sys.stderr)
    html = open(f"/tmp/tpp-blogs/{slug}.html").read()
    meta = extract_meta(html, slug)
    print(f"  title: {meta['title']}", file=sys.stderr)
    print(f"  date:  {meta['publishDate']}", file=sys.stderr)
    print(f"  hero:  {meta['heroImage']}", file=sys.stderr)

    # Upload hero
    hero_asset_id = None
    if meta["heroImage"]:
        try:
            hero_asset_id = upload_image(meta["heroImage"])
            print(f"  hero asset: {hero_asset_id}", file=sys.stderr)
        except Exception as e:
            print(f"  ⚠ hero upload failed: {e}", file=sys.stderr)

    # Body
    body_html = extract_body_html(html)
    print(f"  body html chars: {len(body_html)}", file=sys.stderr)
    body = html_to_portable_text(body_html)
    print(f"  portable blocks: {len(body)}", file=sys.stderr)

    # Build doc
    doc = {
        "_type": "blogPost",
        "_id": "blogPost-" + slug.replace("_", "-"),
        "title": meta["title"],
        "slug": {"_type": "slug", "current": slug},
        "publishDate": meta["publishDate"] or "2024-01-01",
        "excerpt": meta["excerpt"],
        "body": body,
    }
    if hero_asset_id:
        doc["heroImage"] = {
            "_type": "image",
            "asset": {"_type": "reference", "_ref": hero_asset_id},
        }
        # Use same image for card by default
        doc["cardImage"] = {
            "_type": "image",
            "asset": {"_type": "reference", "_ref": hero_asset_id},
        }

    # Mutate
    mutations = {"mutations": [{"createOrReplace": doc}]}
    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": "application/json",
    }
    resp = http("POST", MUTATE_URL,
                data=json.dumps(mutations).encode("utf-8"),
                headers=headers)
    result = json.loads(resp)
    print(f"  ✓ doc id: {result.get('results', [{}])[0].get('id', '?')}", file=sys.stderr)
    return doc


if __name__ == "__main__":
    if len(sys.argv) > 1:
        slugs = sys.argv[1:]
    else:
        slugs = POSTS
    for slug in slugs:
        migrate(slug)
        print(file=sys.stderr)
