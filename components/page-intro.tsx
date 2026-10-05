import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = [label: string, href?: string];

export default function PageIntro({ label, title, children, crumbs, actions }: {
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  return <div className="page-hero wrap">
    {crumbs && <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {crumbs.map(([text, href]) => <span key={text} style={{ display: 'contents' }}>
        <ChevronRight size={14} />
        {href ? <Link href={href}>{text}</Link> : <span aria-current="page">{text}</span>}
      </span>)}
    </nav>}
    <span className="eyebrow">{label}</span>
    <h1>{title}</h1>
    {children && <p className="lede">{children}</p>}
    {actions && <div className="actions">{actions}</div>}
  </div>;
}
