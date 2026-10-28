import { asset, guidePdf } from '@/lib/site';

/** The printed guide's cover, shown as a floating book. */
export default function HandbookCover({ badge = true }: { badge?: boolean }) {
  return <div className="book">
    <div className="book-inner">
      <img src={asset('/guide/cover.webp')} alt={`Cover of the e-CALLISTO FITS Analyzer User Guide, version ${guidePdf.version}`} width={637} height={900} loading="lazy" />
    </div>
    <div className="book-shadow" aria-hidden="true" />
    {badge && <div className="book-badge">{guidePdf.pages} pages<small>{guidePdf.chapters} chapters · {guidePdf.figures} figures</small></div>}
  </div>;
}
