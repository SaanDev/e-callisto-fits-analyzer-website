import PageIntro from '@/components/page-intro';
import { CookieSettingsButton } from '@/components/analytics-consent';
import { googleAnalyticsId, links } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Privacy and cookies', description: 'What the e-CALLISTO FITS Analyzer website records about visits: cookie-free visit counts, and Google Analytics only with your consent.', path: '/privacy/' });

export default function Privacy() {
  return <>
    <PageIntro label="Privacy and cookies" title="What this site records, and why." crumbs={[['Privacy']]}>
      The site has no accounts, forms or comments. It counts visits to learn which pages are useful, and uses Google Analytics only if you allow it.
    </PageIntro>
    <section className="wrap content-section">
      <article className="prose" data-reveal>
        <h2>Visit counts, without cookies</h2>
        <p>Every page loads <a href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noreferrer">Cloudflare Web Analytics</a>, which counts page views without cookies and stores nothing in your browser. It reports totals only: the pages viewed, the referring sites, and the countries, browsers and device types of visitors. It does not follow individual visitors. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare’s privacy policy</a>.</p>

        {googleAnalyticsId && <>
          <h2>Google Analytics, only with your consent</h2>
          <p>If you accept analytics cookies, the site also loads Google Analytics. It records the pages you view, how you arrived, how far you scroll, the links and downloads you click, and your approximate location, device and browser. It sets two cookies, <code>_ga</code> and <code>_ga_{googleAnalyticsId.replace(/^G-/, '')}</code>, which recognise your browser on later visits and expire two years after your last visit.</p>
          <p>Google Analytics does not store IP addresses. Google signals and advertising features are turned off, so the data is not used for ads or linked to a Google account. Google keeps the detailed records for at most 14 months. See <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">how Google uses information from sites that use its services</a>.</p>
          <p>If you decline, Google Analytics is never loaded and nothing is sent to Google.</p>

          <h2>Changing your choice</h2>
          <p>Your answer is saved in your browser. Change it at any time with <strong>Cookie settings</strong> at the bottom of every page. Declining after accepting removes the Google Analytics cookies.</p>
          <div className="actions" style={{ marginTop: 20 }}><CookieSettingsButton className="button">Change cookie settings</CookieSettingsButton></div>
        </>}

        <h2>Stored in your browser</h2>
        <p>The site keeps a few settings in your browser’s local storage. They are never sent anywhere:</p>
        <ul>
          <li><code>callisto-theme</code>: the light or dark theme, if you switch it.</li>
          {googleAnalyticsId && <li><code>callisto-analytics-consent</code>: your answer to the analytics question.</li>}
          <li><code>callisto-download-total</code>: the download count shown on the home page, kept for 30 minutes.</li>
        </ul>

        <h2>Hosting and downloads</h2>
        <p>The site is hosted on GitHub Pages, and GitHub may log visitors’ IP addresses for security. The home page reads its download count from GitHub’s public API. The installers, source code and Discussions are on GitHub. The <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">GitHub Privacy Statement</a> applies to all of these.</p>

        <h2>Questions</h2>
        <p>Email <a href={`mailto:${links.email}`}>{links.email}</a>.</p>
        <p className="small" style={{ marginTop: 32 }}>Last updated 8 October 2026.</p>
      </article>
    </section>
  </>;
}
