import { notFound } from 'next/navigation';
import { tutorials } from '@/lib/tutorials';
import PageIntro from '@/components/page-intro';
export async function generateMetadata({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { const { slug } = await params; return { title: tutorials.find(t => t.slug === slug)?.title ?? 'Tutorial' }; }
export default async function Tutorial({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { const { slug } = await params; const t = tutorials.find(t => t.slug === slug); if (!t)
    notFound(); return <><PageIntro label={t.level + ' · ABOUT ' + t.time} title={t.title}>{t.description}</PageIntro><section className="wrap content-section"><article className="prose"><a href="/tutorials">All tutorials</a><div className="notice"><strong>Before you begin:</strong> install the analyzer and have a FITS observation ready, or fetch one using the built-in downloader. Beta-only instructions are labeled.</div>{t.steps.map(([title, body], i) => <section key={title}><h2>{i + 1}. {title}</h2><p>{body}</p>{i === 1 && <img src={'/screenshots/' + t.image} alt={t.title + ' — application example'} loading="lazy"/>}</section>)}<h2>Continue exploring</h2><p>Consult the <a href="/guide">user guide</a> for controls, or ask about your workflow in the <a href="/forum">community forum</a>.</p></article></section></>; }
