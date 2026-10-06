import Link from 'next/link';
import { Heart, ArrowDown, ArrowRight, ArrowUpRight, Sparkles, Monitor, BookOpen, Star, Quote, MessagesSquare, Building2 } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import { links } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Sponsor', description: 'Support the development of e-CALLISTO FITS Analyzer, free and open-source software for solar radio and solar imaging research, through GitHub Sponsors.', path: '/sponsor/' });

const funds = [
  { icon: Sparkles, title: 'New analysis tools', body: 'Time to develop and validate new methods for radio bursts, solar imaging and CME modelling, guided by what observers ask for.' },
  { icon: Monitor, title: 'Reliable releases', body: 'Building, testing and packaging every release for Windows, Linux and macOS, and keeping up with new operating-system versions.' },
  { icon: BookOpen, title: 'Documentation and support', body: 'Keeping the user guide and tutorials current, and answering questions from students and researchers in the community.' },
];

const otherWays = [
  { icon: Star, title: 'Star the repository', body: 'Stars help other observers and students find the analyzer on GitHub.', href: links.repo, cta: 'Star on GitHub', external: true },
  { icon: Quote, title: 'Cite the software', body: 'Citations show institutions and funders that the analyzer supports published research.', href: '/citation/', cta: 'How to cite' },
  { icon: MessagesSquare, title: 'Join the community', body: 'Answer a question, share a figure or report a bug. Every contribution makes the analyzer better for everyone.', href: '/community/', cta: 'Visit the community' },
];

export default function Sponsor() {
  return <>
    <PageIntro
      label="Support the project"
      title={<>Keep the analyzer<br />free and open.</>}
      crumbs={[['Sponsor']]}
      actions={<>
        <a className="button primary lg sponsor-button" href={links.sponsor} target="_blank" rel="noreferrer"><Heart size={18} />Sponsor on GitHub</a>
        <a className="button lg" href="#other-ways"><ArrowDown size={18} />Other ways to help</a>
      </>}
    >
      e-CALLISTO FITS Analyzer is free, open-source software, built and maintained by Sahan S Liyanage at the University of Colombo. Sponsorship pays for the time it takes to keep it growing.
    </PageIntro>

    <section className="wrap content-section">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Where your support goes</span><h2>What sponsorship<br />makes possible.</h2></div>
        <p>The analyzer is free to download and use. Sponsorship helps it keep pace with the science.</p>
      </div>
      <div className="feature-grid">
        {funds.map((f, i) => <article className="feature spotlight" key={f.title} data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
          <span className="card-icon"><f.icon size={22} /></span>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </article>)}
      </div>
    </section>

    <section className="section band">
      <div className="wrap sponsor-how">
        <div data-reveal>
          <span className="eyebrow">How it works</span>
          <h2>Sponsor in a minute.</h2>
          <div className="steps" style={{ marginTop: 36 }}>
            <div className="step">
              <h3>Open the GitHub Sponsors page</h3>
              <p>Sponsorships are handled by GitHub Sponsors. You need a free GitHub account.</p>
            </div>
            <div className="step">
              <h3>Choose an amount</h3>
              <p>Sponsor monthly or make a one-time contribution, in any amount you choose.</p>
            </div>
            <div className="step">
              <h3>Change or cancel at any time</h3>
              <p>Manage a monthly sponsorship from your GitHub settings. GitHub does not take a fee from sponsorships made from personal accounts.</p>
            </div>
          </div>
        </div>
        <aside className="sponsor-card" data-reveal="scale" style={{ '--delay': '120ms' } as React.CSSProperties}>
          <span className="sponsor-mark" aria-hidden="true"><Heart size={26} /></span>
          <span className="eyebrow plain">GitHub Sponsors</span>
          <h3>Sponsor SaanDev</h3>
          <p>Support the developer of e-CALLISTO FITS Analyzer with a monthly or one-time sponsorship.</p>
          <a className="button primary lg sponsor-button" href={links.sponsor} target="_blank" rel="noreferrer"><Heart size={18} />Sponsor on GitHub</a>
          <span className="small">Opens github.com/sponsors/SaanDev</span>
        </aside>
      </div>
    </section>

    <section className="section wrap" id="other-ways">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Other ways to help</span><h2>Not able to sponsor?<br />You can still help.</h2></div>
        <p>Many of the most valuable contributions cost nothing at all.</p>
      </div>
      <div className="cards">
        {otherWays.map((w, i) => {
          const body = <>
            <span className="card-icon"><w.icon size={21} /></span>
            <h3>{w.title}</h3>
            <p>{w.body}</p>
            <span className="more">{w.cta}{w.external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}</span>
          </>;
          const style = { '--delay': `${i * 80}ms` } as React.CSSProperties;
          return w.external
            ? <a key={w.title} className="card spotlight" href={w.href} target="_blank" rel="noreferrer" data-reveal style={style}>{body}</a>
            : <Link key={w.title} className="card spotlight" href={w.href} data-reveal style={style}>{body}</Link>;
        })}
      </div>
      <div className="notice" data-reveal style={{ display: 'flex', gap: 14, marginTop: 24 }}>
        <Building2 size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
        <div>
          <strong>Institutions and observatories</strong>
          <p>If your group relies on the analyzer and would like to support it through a grant, a collaboration or institutional funding, email <a className="text-link" href={`mailto:${links.email}`}>{links.email}</a>.</p>
        </div>
      </div>
    </section>
  </>;
}
