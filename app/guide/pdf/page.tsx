import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'User guide PDF · v3.1.0', description: 'Download or read the complete 174-page e-CALLISTO FITS Analyzer User Guide v3.1.0 as a PDF.', path: '/guide/pdf/' });

export default function PdfEdition() {
  return <>
    <PageIntro label="e-CALLISTO FITS Analyzer user guide PDF · v3.1.0" title="The complete PDF edition." crumbs={[['User guide', '/guide/'], ['PDF edition']]}>
      Download the e-CALLISTO FITS Analyzer user guide for offline reading: 174 illustrated pages on solar radio FITS processing, burst analysis, solar imaging and CME reconstruction, with figures, equations and references by Sahan S Liyanage.
    </PageIntro>
    <section className="wrap content-section">
      <GuidePdf reader />
      <p style={{ marginTop: 28 }}><Link className="text-link" href="/guide/">Browse the searchable web edition <ArrowRight size={15} /></Link></p>
    </section>
  </>;
}
