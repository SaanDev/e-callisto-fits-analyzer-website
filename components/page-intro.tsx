import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from '@/components/json-ld';
import { breadcrumbData } from '@/lib/seo';

type Crumb = [label: string, href?: string];

/** `label` is the small line above the title. By default it is also the first
 *  line of the h1, so search engines read a descriptive heading rather than
 *  the slogan alone; pass `labelInHeading={false}` when it is only metadata. */
export default function PageIntro({ label, title, children, crumbs, actions, labelInHeading = true }: {
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  labelInHeading?: boolean;
}) {
  return <div className="page-hero wrap">
    {crumbs && <JsonLd data={breadcrumbData(crumbs)} />}
    {crumbs && <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {crumbs.map(([text, href]) => <span key={text} style={{ display: 'contents' }}>
        <ChevronRight size={14} />
        {href ? <Link href={href}>{text}</Link> : <span aria-current="page">{text}</span>}
      </span>)}
    </nav>}
    {labelInHeading
      ? <h1><span className="eyebrow">{label}</span> {title}</h1>
      : <><span className="eyebrow">{label}</span><h1>{title}</h1></>}
    {children && <p className="lede">{children}</p>}
    {actions && <div className="actions">{actions}</div>}
  </div>;
}
