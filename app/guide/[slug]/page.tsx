import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import GuideReader from '@/components/guide-reader';
import GuideToc from '@/components/guide-toc';
import JsonLd from '@/components/json-ld';
import handbook from '@/content/handbook.json';
import { asset, basePath, guidePdf } from '@/lib/site';
import { pageMetadata, chapterData, breadcrumbData } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return handbook.map(c => ({ slug: c.slug }));
}

type Chapter = (typeof handbook)[number];

// Reference pages whose opening text is a table or list rather than prose.
const descriptions: Record<string, string> = {
  copyright: 'Edition, copyright and licence details of the e-CALLISTO FITS Analyzer User Guide for software version 3.1.0.',
  shortcuts: 'Keyboard shortcuts of the e-CALLISTO FITS Analyzer main window and analysis tools, including their macOS equivalents.',
  'file-formats': 'File types read and written by e-CALLISTO FITS Analyzer: FITS spectra, projects and sessions, exported FITS files and every other output.',
  'data-sources': 'The online archives e-CALLISTO FITS Analyzer retrieves data from, their access requirements and how to acknowledge the data providers.',
  glossary: 'Definitions of the solar physics, radio astronomy and software terms used in the e-CALLISTO FITS Analyzer User Guide.',
  bibliography: 'References cited in the e-CALLISTO FITS Analyzer User Guide, from coronal density models to CME reconstruction methods.',
  index: 'Alphabetical index of the tools, windows, methods and terms described in the e-CALLISTO FITS Analyzer User Guide.',
};

// Collapse whitespace, including the spaces Pandoc leaves inside citations: "( Author 2020 ) ,".
const squash = (text: string) => text.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+([),.;:])/g, '$1').trim();

/** About 155 characters of the chapter's own prose, without its repeated headings. */
function describe(chapter: Chapter): string {
  if (descriptions[chapter.slug]) return descriptions[chapter.slug];
  let text = squash(chapter.text);
  for (const heading of [chapter.title, chapter.headings[0]?.title]) {
    if (heading && text.startsWith(squash(heading))) text = text.slice(squash(heading).length).trim();
  }
  return text.length > 158 ? text.slice(0, 155).replace(/\s\S*$/, '').replace(/[,;:(]$/, '') + '…' : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = handbook.find(c => c.slug === slug);
  if (!chapter) return { title: 'Chapter not found' };
  return pageMetadata({ title: `${chapter.title} · User guide`, description: describe(chapter), path: `/guide/${slug}/` });
}

const label = (number: string) => number ? (/^\d+$/.test(number) ? `Chapter ${number}` : `Appendix ${number}`) : '';

export default async function GuideChapter({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = handbook.findIndex(c => c.slug === slug);
  if (index < 0) notFound();
  const chapter = handbook[index], previous = handbook[index - 1], next = handbook[index + 1];
  const parts = [...new Set(handbook.map(c => c.part))];
  // Root-relative links and images in the converted book need the site's base path.
  const html = basePath ? chapter.html.replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}/`) : chapter.html;
  const path = `/guide/${slug}/`;
  const structuredData = [
    chapterData({ title: chapter.title, description: describe(chapter), path, image: chapter.html.match(/<img src="([^"]+)"/)?.[1] }),
    breadcrumbData([['User guide', '/guide/'], [chapter.title, path]]),
  ];

  const chapterList = parts.map(part => <div className="part" key={part}>
    <p>{part}</p>
    <nav aria-label={part}>
      {handbook.filter(c => c.part === part).map(c => <Link key={c.slug} href={`/guide/${c.slug}/`} aria-current={c.slug === slug ? 'page' : undefined}><span>{c.number}</span>{c.title}</Link>)}
    </nav>
  </div>);

  return <section className="wrap content-section handbook-reader">
    <JsonLd data={structuredData} />
    <aside className="handbook-sidebar" aria-label="User guide chapters">
      <Link className="back" href="/guide/"><ArrowLeft size={15} />All chapters &amp; search</Link>
      <div className="parts">{chapterList}</div>
      <details><summary>Browse the book <ChevronDown size={16} /></summary>{chapterList}</details>
    </aside>

    <div className="handbook-body">
      <div className="chapter-kicker">
        <Link href="/guide/">User guide</Link><ChevronRight size={13} /><span>{chapter.part}</span>
        {chapter.number && <><ChevronRight size={13} /><span>{label(chapter.number)}</span></>}
      </div>
      <GuideReader html={html} />
      <nav className="chapter-pagination" aria-label="Chapter navigation">
        {previous && <Link href={`/guide/${previous.slug}/`}><span><ArrowLeft size={14} />Previous{previous.number && ` · ${label(previous.number)}`}</span><strong>{previous.title}</strong></Link>}
        {next && <Link className="next" href={`/guide/${next.slug}/`}><span>Next{next.number && ` · ${label(next.number)}`}<ArrowRight size={14} /></span><strong>{next.title}</strong></Link>}
      </nav>
    </div>

    <aside className="handbook-toc">
      <GuideToc headings={chapter.headings} />
      <div className="toc-actions">
        <a href={asset(guidePdf.href)} download={guidePdf.filename}><Download size={14} />Download PDF</a>
        <Link href="/guide/pdf/"><FileText size={14} />PDF edition</Link>
      </div>
    </aside>
  </section>;
}
