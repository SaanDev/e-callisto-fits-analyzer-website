"""Package the owner-supplied v3.1.0 installers and original PDF metadata."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'C:\Users\CALLISTO\Downloads\v3.1.0\v3.1.0')
releases=json.loads((ROOT/'releases-verified.json').read_text(encoding='utf-8-sig'))
new=[]
for old in releases:
    if not old['tag'].startswith('v3.0.0('): continue
    record=json.loads(json.dumps(old).replace('3.0.0','3.1.0'))
    for asset in record['assets']:
        file=SOURCE/asset['name']
        asset['size']=file.stat().st_size
        asset['digest']='sha256:'+hashlib.file_digest(file.open('rb'),'sha256').hexdigest()
    record['verification']='Size and SHA-256 from owner-supplied files, 2026-10-05. URLs updated to v3.1.0 as instructed by the release owner; GitHub releases are drafted.'
    new.append(record)
(ROOT/'releases-verified.json').write_text(json.dumps(new+[r for r in releases if not r['tag'].startswith('v3.1.0(')],indent=2)+'\n',encoding='utf-8')
pdf=SOURCE/'e-CALLISTO_FITS_Analyzer_User_Guide_v3.1.0.pdf'
data=pdf.read_bytes();size=12*1024*1024
folder=ROOT/'public/docs/handbook-v3.1.0';folder.mkdir(parents=True,exist_ok=True)
parts=[]
for i,start in enumerate(range(0,len(data),size)):
    name=f'part-{i+1}.bin';part=data[start:start+size];(folder/name).write_bytes(part)
    parts.append(dict(url=f'/docs/handbook-v3.1.0/{name}',size=len(part)))
manifest=dict(filename=pdf.name,size=len(data),pages=174,sha256=hashlib.sha256(data).hexdigest(),parts=parts)
(ROOT/'content/guide-pdf.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Prepared three platform records and the original PDF; SHA-256:',manifest['sha256'])
