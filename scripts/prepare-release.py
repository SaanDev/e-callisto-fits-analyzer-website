"""Record release metadata for new installers and publish the user guide PDF.

Usage: python scripts/prepare-release.py <folder with installers and PDF> <new version> <previous version>
Example: python scripts/prepare-release.py "C:/Users/CALLISTO/Downloads/v3.1.0/v3.1.0" 3.1.0 3.0.0

Copies the previous release records, substitutes the version, and reads sizes
and SHA-256 digests from the local installers. The PDF is copied to
public/docs unchanged; update guidePdf in lib/site.ts if its name changes.
"""
import hashlib, json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source, new_version, old_version = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
releases = json.loads((ROOT / 'releases-verified.json').read_text(encoding='utf-8-sig'))
records = []
for old in releases:
    if not old['tag'].startswith(f'v{old_version}('): continue
    record = json.loads(json.dumps(old).replace(old_version, new_version))
    for asset in record['assets']:
        file = source / asset['name']
        asset['size'] = file.stat().st_size
        asset['digest'] = 'sha256:' + hashlib.file_digest(file.open('rb'), 'sha256').hexdigest()
    record['verification'] = 'Size and SHA-256 from the release installers.'
    records.append(record)
rest = [r for r in releases if not r['tag'].startswith(f'v{new_version}(')]
(ROOT / 'releases-verified.json').write_text(json.dumps(records + rest, indent=2) + '\n', encoding='utf-8')
for pdf in source.glob('*User_Guide*.pdf'):
    shutil.copy2(pdf, ROOT / 'public/docs' / pdf.name)
    print('Copied', pdf.name, hashlib.sha256(pdf.read_bytes()).hexdigest())
print(f'Recorded {len(records)} v{new_version} platform releases.')
