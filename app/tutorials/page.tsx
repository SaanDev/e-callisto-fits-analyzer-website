import Link from 'next/link';
import { Video, ArrowRight, Clock } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import { tutorials } from '@/lib/tutorials';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'e-CALLISTO data analysis tutorials', description: 'Practical, step-by-step walkthroughs for e-CALLISTO FITS Analyzer v3.1.0: your first spectrum, burst drift measurement and reproducible exports.', path: '/tutorials/' });

export default function Tutorials() {
  return <>
    <PageIntro label="e-CALLISTO data analysis tutorials" title="One observation. New possibilities." crumbs={[['Tutorials']]}>
      Practical walkthroughs for students and researchers. Work at your own pace with your own FITS observation.
    </PageIntro>
    <section className="wrap content-section">
      <div className="article-list">
        {tutorials.map((t, i) => <Link href={`/tutorials/${t.slug}/`} className="article-link spotlight" key={t.slug} data-reveal style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
          <span className="num">0{i + 1}</span>
          <div>
            <span className="eyebrow plain">{t.level} · <Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {t.time}</span>
            <h2>{t.title}</h2>
            <p>{t.description}</p>
          </div>
          <ArrowRight size={22} />
        </Link>)}
      </div>
      <div className="tutorial-coming-soon" style={{ marginTop: 36 }} data-reveal>
        <Video size={30} />
        <div>
          <span className="eyebrow">Stay tuned</span>
          <h2>Video tutorials are coming soon.</h2>
          <p>Step-by-step videos for v3.1.0 are on the way. In the meantime, the complete user guide covers every window and method in detail.</p>
          <Link className="text-link" href="/guide/">Read the complete user guide <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  </>;
}
