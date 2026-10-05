"""Check conversion completeness, links and exact PDF reconstruction (stdlib only)."""
import hashlib
import html
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
book = json.loads((root / 'content/handbook.json').read_text(encoding='utf8'))
assert len(book) == 31, 'Missing chapters or reference material'
ids = {c['slug']: set(html.unescape(x) for x in re.findall(r'id="([^"]+)"', c['html'])) for c in book}
assert len(ids) == len(book), 'Duplicate chapter slug'
for chapter in book:
    for slug, anchor in re.findall(r'href="/guide/([^"#]+)(?:#([^"]+))?"', chapter['html']):
        assert slug in ids or slug == 'pdf', (chapter['slug'], slug)
        if anchor:
            assert html.unescape(anchor) in ids[slug], (chapter['slug'], anchor)
    assert not re.search(r'\\(?:gui|menu|file|appname|appversion|begin|ref)\b', chapter['text']), chapter['slug']
    assert not re.search(r'<(?:img|script)\b|\son\w+=', chapter['html']), chapter['slug']
    assert '\ufffd' not in chapter['html'], chapter['slug']
source = '\n'.join(p.read_text(encoding='utf8') for folder in ['chapters', 'backmatter', 'frontmatter'] for p in (root / 'content/guide-source' / folder).glob('*.tex'))
labels = set(re.findall(r'\\label\{([^}]+)\}', source))
assert not labels - set().union(*ids.values()), 'Missing source anchors'
manifest = json.loads((root / 'content/guide-pdf.json').read_text())
digest = hashlib.sha256()
size = 0
for part in manifest['parts']:
    data = (root / 'public' / part['url'].lstrip('/')).read_bytes()
    assert len(data) == part['size'] and len(data) < 25 * 1024 * 1024
    digest.update(data)
    size += len(data)
assert size == manifest['size'] and digest.hexdigest() == manifest['sha256'], 'PDF does not match original'
print(f'Validated {len(book)} chapters/reference pages, {len(labels)} source anchors and original {size:,}-byte PDF.')
