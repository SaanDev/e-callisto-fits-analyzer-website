import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import HandbookSearch from '@/components/handbook-search';
import handbook from '@/content/handbook.json';
export const metadata = { title: 'Complete user guide · v3.1.0', description: 'The complete v3.1.0 handbook: 21 chapters, five appendices, glossary, bibliography and index.' };
export default function Guide() {
  const parts = [...new Set(handbook.map(c => c.part))];
  return <><PageIntro label="THE COMPLETE HANDBOOK · v3.1.0" title="Your guide to the analyzer.">From your first FITS observation to solar imaging and three-dimensional CME reconstruction. The complete guide by Sahan S Liyanage.</PageIntro>
    <section className="wrap content-section handbook-home"><div className="handbook-intro"><div><span className="eyebrow">ONE BOOK. TWO WAYS TO READ.</span><h2>Keep a copy. Or explore a chapter.</h2><p>Read the original illustrated PDF, or browse its searchable web edition. The web edition keeps the book’s instructions, tables, equations and references, with illustrations available in the PDF.</p></div><GuidePdf/></div>
      <HandbookSearch chapters={handbook.map(({slug,title,part,number,text}) => ({slug,title,part,number,text}))}/>
      <div className="handbook-contents">{parts.map(part => <section key={part}><h2>{part}</h2><div className="handbook-chapters">{handbook.filter(c => c.part === part).map(c => <a key={c.slug} href={'/guide/' + c.slug}><span>{c.number || '•'}</span><strong>{c.title}</strong></a>)}</div></section>)}</div>
    </section></>;
}
