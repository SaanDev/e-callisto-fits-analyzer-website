"""Check conversion completeness, links, figures and the PDF edition (stdlib only)."""
import hashlib
import html
import json
import re
from pathlib import Path

PDF_SHA256 = '25a72ffa6718ebf255b77f2237ad659cc61ea577693f2d08cc88738d12a9b9be'

root = Path(__file__).resolve().parents[1]
book = json.loads((root / 'content/handbook.json').read_text(encoding='utf8'))
assert len(book) == 32, 'Missing chapters or reference material'
ids = {c['slug']: set(html.unescape(x) for x in re.findall(r'id="([^"]+)"', c['html'])) for c in book}
assert len(ids) == len(book), 'Duplicate chapter slug'
figures = 0
placeholders = []
for chapter in book:
    for slug, anchor in re.findall(r'href="/guide/([^"#/]+)/?(?:#([^"]+))?"', chapter['html']):
        assert slug in ids or slug == 'pdf', (chapter['slug'], slug)
        if anchor:
            assert html.unescape(anchor) in ids[slug], (chapter['slug'], anchor)
    assert not re.search(r'\\(?:gui|menu|file|appname|appversion|begin|ref)\b', chapter['text']), chapter['slug']
    assert not re.search(r'<span class="math[^>]*>\s*\\', chapter['html']), f'Unconverted math in {chapter["slug"]}'
    assert not re.search(r'<script\b|\son\w+=', chapter['html']), chapter['slug']
    assert '\ufffd' not in chapter['html'], chapter['slug']
    for src in re.findall(r'<img\b[^>]*\ssrc="([^"]+)"', chapter['html']):
        assert src.startswith('/guide/figures/') and (root / 'public' / src.lstrip('/')).is_file(), (chapter['slug'], src)
        figures += 1
    placeholders.extend(re.findall(r'data-figure-placeholder="([^"]+)"', chapter['html']))
source = '\n'.join(p.read_text(encoding='utf8') for folder in ['chapters', 'backmatter', 'frontmatter'] for p in (root / 'content/guide-source' / folder).glob('*.tex'))
labels = set(re.findall(r'\\label\{([^}]+)\}', source))
assert not labels - set().union(*ids.values()), 'Missing source anchors'
expected_figures = len(re.findall(r'\\screenshot\b', source)) + len(re.findall(r'\\includegraphics\b', source))
assert placeholders == ['figures/event-context/geomagnetic_card.png'], 'Unexpected source screenshot placeholders'
assert figures + len(placeholders) == expected_figures, f'{figures} images and {len(placeholders)} source placeholders online, {expected_figures} in the book'
pdf = root / 'public/docs/e-CALLISTO_FITS_Analyzer_User_Guide_v3.2.0.pdf'
assert hashlib.sha256(pdf.read_bytes()).hexdigest() == PDF_SHA256, 'PDF does not match original'
print(f'Validated {len(book)} chapters/reference pages, {len(labels)} source anchors, {figures} images, {len(placeholders)} source screenshot placeholder and the original {pdf.stat().st_size:,}-byte PDF.')
