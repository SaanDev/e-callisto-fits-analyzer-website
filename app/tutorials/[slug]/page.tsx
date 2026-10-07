import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import { tutorials } from '@/lib/tutorials';
import { asset } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return tutorials.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = tutorials.find(t => t.slug === slug);
  if (!t) return { title: 'Tutorial' };
  return pageMetadata({ title: `${t.title} · Tutorial`, description: `${t.description} A step-by-step walkthrough for e-CALLISTO FITS Analyzer v3.1.0.`, path: `/tutorials/${slug}/` });
}

export default async function Tutorial({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = tutorials.findIndex(t => t.slug === slug);
  if (index < 0) notFound();
  const t = tutorials[index], next = tutorials[index + 1];
  return <>
    <PageIntro label={`${t.level} · About ${t.time}`} labelInHeading={false} title={t.title} crumbs={[['Tutorials', '/tutorials/'], [t.title]]}>{t.description}</PageIntro>
    <section className="wrap content-section">
      <article className="prose">
        <div className="notice" style={{ display: 'flex', gap: 12 }}><Info size={19} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }} /><p style={{ margin: 0 }}><strong>Before you begin:</strong> install the analyzer and have a FITS observation ready, or fetch one with the built-in e-CALLISTO downloader.</p></div>
        <div className="steps">
          {t.steps.map(([title, body], i) => <section className="step" key={title} data-reveal>
            <h2>{title}</h2>
            <p>{body}</p>
            {i === 1 && <img src={asset('/screenshots/' + t.image)} alt={`${t.title}: application example`} loading="lazy" width={1800} height={1125} />}
          </section>)}
        </div>
        <h2>Continue exploring</h2>
        <p>Consult the <Link href="/guide/">user guide</Link> for every control and method, or ask about your workflow in <Link href="/community/">GitHub Discussions</Link>.</p>
        <div className="actions" style={{ marginTop: 28 }}>
          <Link className="button" href="/tutorials/"><ArrowLeft size={16} />All tutorials</Link>
          {next && <Link className="button primary" href={`/tutorials/${next.slug}/`}>Next: {next.title}<ArrowRight className="arrow" size={16} /></Link>}
        </div>
      </article>
    </section>
  </>;
}
