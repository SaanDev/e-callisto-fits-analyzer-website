"""Convert the author's supplied LaTeX into the screenshot-free web handbook.

Usage: python scripts/build-handbook.py --pandoc /path/to/pandoc
The original PDF is distributed separately, without modification.
"""
import argparse, html, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content/guide-source'
parser = argparse.ArgumentParser()
parser.add_argument('--pandoc', required=True)
args = parser.parse_args()

def group(text, start):
    while start < len(text) and text[start].isspace(): start += 1
    if text[start] != '{': raise ValueError(text[start:start+80])
    depth, i = 1, start + 1
    while depth:
        if text[i] == '\\': i += 2; continue
        if text[i] == '{': depth += 1
        if text[i] == '}': depth -= 1
        i += 1
    return text[start+1:i-1], i

def macro(text, name, count, replacement):
    pattern = re.compile(r'\\' + name + r'(?![A-Za-z])')
    pos = 0
    while match := pattern.search(text, pos):
        end = match.end()
        while end < len(text) and text[end].isspace(): end += 1
        if end < len(text) and text[end] == '[':
            end = text.index(']', end) + 1
        values = []
        for _ in range(count):
            value, end = group(text, end); values.append(value)
        result = replacement(*values)
        text = text[:match.start()] + result + text[end:]
        pos = match.start() + len(result)
    return text

main = (SOURCE / 'main.tex').read_text(encoding='utf-8')
parts = []
part = 'About the book'
for line in main.splitlines():
    if line.lstrip().startswith('%'): continue
    if m := re.search(r'\\(?:add)?part\{([^}]+)\}', line): part = m[1]
    if m := re.search(r'\\(?:input|include)\{([^}]+)\}', line):
        file = m[1]
        if file.endswith('titlepage'): continue
        parts.append((file, part))

prefix = r'''
\newcommand{\appname}{e-CALLISTO FITS Analyzer}
\newcommand{\appversion}{3.1.0}
\newcommand{\gui}[1]{\textbf{#1}}
\newcommand{\menu}[1]{\textbf{#1}}
\newcommand{\kbd}[1]{\texttt{#1}}
\newcommand{\file}[1]{\texttt{#1}}
\newcommand{\callout}[1]{\textbf{#1}}
\newcommand{\thead}[1]{\textbf{#1}}
\newcommand{\Rsun}{\ensuremath{R_\odot}}
'''
chunks, metadata, figure_labels, index_entries = [], [], [], {}
for file, part in parts:
    text = (SOURCE / (file + '.tex')).read_text(encoding='utf-8')
    text = re.sub(r'(?m)(?<!\\)%.*$', '', text)
    text = re.sub(r'(?m)^\\newcommand.*$', '', text)
    if file.endswith('copyright'):
        text = r'\chapter{About this edition}' + '\n' + text
    # Screenshots remain in the supplied PDF. Retain captions and figure references online.
    def screenshot(image, caption, label, capture):
        figure_labels.append(label)
        return '\n\\begin{figure}\n\\caption{' + caption + '}\\label{' + label + '}\n\\end{figure}\n'
    text = macro(text, 'screenshot', 4, screenshot)
    text = re.sub(r'\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}', '', text)
    text = re.sub(r'\\begin\{minipage\}(?:\[[^]]*\])?\{[^}]+\}[\s\S]*?\\end\{minipage\}', lambda m: '' if '\\includegraphics' in m[0] else m[0], text)
    text = text.replace('\\begin{steps}', '\\begin{enumerate}').replace('\\end{steps}', '\\end{enumerate}')
    text = macro(text, 'procedure', 1, lambda x: '\\paragraph{' + x + '}')
    text = macro(text, 'problem', 1, lambda x: '\\subsection{' + x + '}')
    def equation_anchor(m):
        label=re.search(r'\\label\{([^}]+)\}',m[0])
        return ('\\hypertarget{'+label[1]+'}{}\n' if label else '') + m[0]
    text=re.sub(r'\\begin\{equation\}[\s\S]*?\\end\{equation\}',equation_anchor,text)
    # Preserve optional titles that Pandoc otherwise drops on custom environments.
    text = re.sub(r'\\begin\{(note|tip|caution|background)\}(?:\[([^]]*)\])?', lambda m: '\\begin{' + m[1] + '}\n\\textbf{' + (m[2] or m[1].capitalize()) + '}\n\n', text)
    # Normalize custom column definitions, preserving every row and repeated-table caption.
    def table_start(m):
        env = m[1]; start = m.end()
        _, end = group(text, start)
        spec, end = group(text, end)
        simple = re.sub(r'@\{\}', '', spec)
        simple = re.sub(r'P\{[^}]*\}', 'l', simple)
        simple = simple.replace('L','l').replace('R','r').replace('C','c').replace('X','l')
        return m.start(), end, '\\begin{' + ('longtable' if env == 'xltabular' else 'tabular') + '}{' + simple + '}'
    starts = [table_start(m) for m in re.finditer(r'\\begin\{(tabularx|xltabular)\}', text)]
    for start,end,value in reversed(starts): text = text[:start] + value + text[end:]
    text = text.replace('\\end{tabularx}', '\\end{tabular}').replace('\\end{xltabular}', '\\end{longtable}')
    # The print edition repeats long-table headings on each page; HTML needs one heading.
    text = re.sub(r'\\endfirsthead[\s\S]*?\\endhead', '', text)
    slug = Path(file).stem
    if file.startswith('chapters/'):
        number = str(int(slug.split('-')[0])); slug = slug[3:]
    elif file.startswith('backmatter/') and re.match(r'^[a-e]-',slug):
        number = slug[0].upper(); slug = slug[2:]
    else: number = ''
    for term in re.findall(r'\\index\{([^}]+)\}', text):
        term = term.split('@')[-1].replace('!', ' · ')
        index_entries.setdefault(term, set()).add(slug)
    title_match = re.search(r'\\chapter\*?\{', text)
    title,_ = group(text,title_match.end()-1)
    metadata.append(dict(slug=slug,part=part,number=number,title=title.replace('\\appname{}','e-CALLISTO FITS Analyzer')))
    chunks.append(text)

combined = prefix + '\n'.join(chunks) + '\n\\chapter{Bibliography}\n'
work = ROOT / '.sites-runtime/handbook'; work.mkdir(parents=True,exist_ok=True)
(work/'combined.tex').write_text(combined,encoding='utf-8')
cmd = [args.pandoc,str(work/'combined.tex'),'-f','latex','-t','html5','--math-method=mathml','--citeproc','--bibliography',str(SOURCE/'references.bib'),'-M','link-citations=true','-M','nocite=@*']
result = subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',check=True)
(work/'warnings.txt').write_text(result.stderr,encoding='utf-8')
output=result.stdout
metadata.append(dict(slug='bibliography',part='Reference',number='',title='Bibliography'))
pieces=re.split(r'<h1\b[^>]*>.*?</h1>',output,flags=re.S)[1:]
heads=re.findall(r'<h1\b([^>]*)>(.*?)</h1>',output,flags=re.S)
if len(pieces)!=len(metadata): raise ValueError(f'Chapter mismatch: {len(pieces)} / {len(metadata)}')
id_to_slug={}
for item, body, head in zip(metadata,pieces,heads):
    full='<h1'+head[0]+'>'+head[1]+'</h1>'+body
    for ident in re.findall(r'\bid="([^"]+)"',full): id_to_slug[html.unescape(ident)]=item['slug']
    item['title']=html.unescape(re.sub('<[^>]+>','',head[1]))
    item['html']=full

number_by_slug={x['slug']:x['number'] for x in metadata}
for item in metadata:
    body=item.pop('html')
    body=re.sub(r'href="#([^"]+)"',lambda m:'href="/guide/'+id_to_slug.get(html.unescape(m[1]),item['slug'])+'#'+m[1]+'"',body)
    # Pandoc counts front matter as chapters; use the author's printed chapter numbers.
    def reference_number(m):
        start,label,value=m.groups()
        slug=id_to_slug.get(html.unescape(label),item['slug'])
        number=number_by_slug[slug] or '0'
        value=re.sub(r'^\d+',number,value)
        return start+value+'</a>'
    body=re.sub(r'(<a\b[^>]*data-reference="([^"]+)"[^>]*>)([^<]*)</a>',reference_number,body)
    body=re.sub(r'<table\b', '<div class="guide-table-scroll" tabindex="0" role="region" aria-label="Scrollable reference table"><table',body).replace('</table>','</table></div>')
    figure_count=[0]
    def figure_caption(m):
        figure_count[0]+=1
        return '<figcaption><strong>Figure '+(item['number'] or '0')+'.'+str(figure_count[0])+'.</strong> '+m[1]+' <a class="pdf-figure-note" href="/guide/pdf">View illustration in the PDF edition.</a></figcaption>'
    body=re.sub(r'<figcaption>(.*?)</figcaption>',figure_caption,body,flags=re.S)
    item['headings']=[dict(id=html.unescape(i),title=html.unescape(re.sub('<[^>]+>','',t))) for i,t in re.findall(r'<h2\b[^>]*id="([^"]+)"[^>]*>(.*?)</h2>',body,re.S)]
    item['html']=body
    searchable=re.sub(r'<annotation\b[^>]*>[\s\S]*?</annotation>','',body)
    item['text']=html.unescape(re.sub('<[^>]+>',' ',searchable))
    item['text']=re.sub(r'\s+',' ',item['text']).strip()

index_html='<h1 id="index">Index</h1><dl>'
for term,slugs in sorted(index_entries.items(),key=lambda pair:pair[0].casefold()):
    index_html+='<dt>'+html.escape(term)+'</dt><dd>'+', '.join('<a href="/guide/'+slug+'">'+html.escape(next(x['title'] for x in metadata if x['slug']==slug))+'</a>' for slug in sorted(slugs))+'</dd>'
index_html+='</dl>'
metadata.append(dict(slug='index',part='Reference',number='',title='Index',headings=[],html=index_html,text=' '.join(sorted(index_entries))))

target=ROOT/'content/handbook.json'
target.write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(chapters=len(metadata),tables=output.count('<table'),math=output.count('<math'),screenshots=output.count('<img'),warnings=result.stderr[:3000])))
