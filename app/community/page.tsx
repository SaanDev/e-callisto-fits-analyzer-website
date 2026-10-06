import Link from 'next/link';
import { MessagesSquare, Lightbulb, Bug, Megaphone, Mail, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import { GitHubIcon } from '@/components/icons';
import { links } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Community', description: 'Ask questions, share workflows and report bugs for e-CALLISTO FITS Analyzer on GitHub Discussions and Issues.', path: '/community/' });

const channels = [
  { icon: MessagesSquare, title: 'Questions & answers', body: 'Stuck on a workflow, a FITS file or an interpretation? Ask the community and help others with what you have learned.', href: links.discussions + '/categories/q-a', cta: 'Ask a question' },
  { icon: Lightbulb, title: 'Ideas & feature requests', body: 'Suggest improvements and new analysis tools. Requests from working solar-radio observers are especially welcome.', href: links.discussions + '/categories/ideas', cta: 'Share an idea' },
  { icon: Megaphone, title: 'Show and tell', body: 'Share figures, events you analysed and publications that used the analyzer. Your examples help newcomers.', href: links.discussions + '/categories/show-and-tell', cta: 'Share your work' },
  { icon: Bug, title: 'Bug reports', body: 'Use About → Report a Bug… in the analyzer to create a diagnostics bundle and a prefilled issue, or open one on GitHub.', href: links.newIssue, cta: 'Open an issue' },
];

export default function Community() {
  return <>
    <PageIntro
      label="The e-CALLISTO community"
      title={<>A shared sky.<br />An open conversation.</>}
      crumbs={[['Community']]}
      actions={<>
        <a className="button primary lg" href={links.discussions} target="_blank" rel="noreferrer"><GitHubIcon size={18} />Open GitHub Discussions</a>
        <a className="button lg" href={`mailto:${links.email}`}><Mail size={18} />Email the maintainer</a>
      </>}
    >
      Ask questions, exchange methods and help each other make sense of solar radio and imaging observations. Discussions take place on GitHub, next to the source code.
    </PageIntro>
    <section className="wrap content-section">
      <div className="channel-grid">
        {channels.map((c, i) => <a key={c.title} className="card channel spotlight" href={c.href} target="_blank" rel="noreferrer" data-reveal style={{ '--delay': `${(i % 2) * 90}ms` } as React.CSSProperties}>
          <span className="card-icon"><c.icon size={21} /></span>
          <div>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            <span className="more">{c.cta}<ArrowUpRight size={15} /></span>
          </div>
        </a>)}
      </div>
      <div className="notice setup-note" data-reveal style={{ display: 'flex', gap: 14 }}>
        <ShieldCheck size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
        <div>
          <strong>Before you post</strong>
          <p>Include the analyzer version, your operating system and the steps to reproduce what you saw. Review diagnostics bundles before sharing them, and remove anything you do not want to make public. A GitHub account is needed to post.</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 20 }} data-reveal>
        <h2 style={{ marginTop: 0 }}>Author and maintainer</h2>
        <p><strong style={{ color: 'var(--ink)' }}>Sahan S Liyanage</strong> · Astronomical and Space Science Unit, University of Colombo, Sri Lanka</p>
        <p style={{ marginTop: 8 }}>For collaborations and questions that are not suited to a public forum, email <a className="text-link" href={`mailto:${links.email}`}>{links.email}</a>.</p>
        <p style={{ marginTop: 8 }}>The analyzer is free and open source. If it helps your work, consider <Link className="text-link" href="/sponsor/"><Heart size={15} style={{ color: 'var(--sponsor)' }} />sponsoring its development</Link>.</p>
      </div>
    </section>
  </>;
}
