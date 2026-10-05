import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
export const metadata = {title:'User guide PDF · v3.1.0'};
export default function PdfEdition(){return <><PageIntro label="USER GUIDE · v3.1.0" title="The complete PDF edition.">The original illustrated handbook by Sahan S Liyanage, with all 174 pages, figures, tables, equations and references.</PageIntro><section className="wrap content-section"><GuidePdf reader/><p style={{marginTop:24}}><a className="text-link" href="/guide">Browse the searchable web guide</a></p></section></>;}
