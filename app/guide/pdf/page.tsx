import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import { pageMetadata } from '@/lib/seo';
import { guidePdf } from '@/lib/site';

export const metadata = pageMetadata({ title: `User guide PDF · v${guidePdf.version}`, description: `Download or read the complete ${guidePdf.pages}-page e-CALLISTO FITS Analyzer User Guide v${guidePdf.version} as a PDF.`, path: '/guide/pdf/' });

export default function PdfEdition() {
  return <>
    <PageIntro label={`e-CALLISTO FITS Analyzer user guide PDF · v${guidePdf.version}`} title="The complete PDF edition." crumbs={[['User guide', '/guide/'], ['PDF edition']]}>
      Download the e-CALLISTO FITS Analyzer user guide for offline reading: {guidePdf.pages} illustrated pages on solar radio FITS processing, burst analysis, event context, geomagnetic response, solar imaging and CME reconstruction, with figures, equations and references by Sahan S Liyanage.
    </PageIntro>
    <section className="wrap content-section">
      <GuidePdf reader />
      <p style={{ marginTop: 28 }}><Link className="text-link" href="/guide/">Browse the searchable web edition <ArrowRight size={15} /></Link></p>
    </section>
  </>;
}
