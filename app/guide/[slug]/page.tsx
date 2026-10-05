import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import GuideReader from '@/components/guide-reader';
import GuideToc from '@/components/guide-toc';
import handbook from '@/content/handbook.json';
import { asset, basePath, guidePdf } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return handbook.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = handbook.find(c => c.slug === slug);
  if (!chapter) return { title: 'Chapter not found' };
  return { title: `${chapter.title} · User guide`, description: chapter.text.slice(0, 155).replace(/\s\S*$/, '') + '…' };
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

  const chapterList = parts.map(part => <div className="part" key={part}>
    <p>{part}</p>
    <nav aria-label={part}>
      {handbook.filter(c => c.part === part).map(c => <Link key={c.slug} href={`/guide/${c.slug}/`} aria-current={c.slug === slug ? 'page' : undefined}><span>{c.number}</span>{c.title}</Link>)}
    </nav>
  </div>);

  return <section className="wrap content-section handbook-reader">
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
