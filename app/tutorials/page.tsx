import PageIntro from '@/components/page-intro';
import { tutorials } from '@/lib/tutorials';
export const metadata = { title: 'Tutorials' };
export default function Tutorials() { return <><PageIntro label="LEARN BY DOING" title="One observation. New possibilities.">Practical walkthroughs for students and researchers. Work at your own pace with your own FITS observation.</PageIntro><section className="wrap content-section article-list">{tutorials.map((t, i) => <a href={'/tutorials/' + t.slug} className="article-link" key={t.slug}><span className="eyebrow">0{i + 1} · {t.level} · ABOUT {t.time}</span><h2>{t.title}</h2><p>{t.description}</p></a>)}<p className="small">These are written tutorials based on the project documentation. Screenshots may show an earlier interface.</p></section></>; }
