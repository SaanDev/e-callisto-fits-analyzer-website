'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { googleAnalyticsId } from '@/lib/site';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Choice = 'granted' | 'denied';

const STORAGE_KEY = 'callisto-analytics-consent';
const CHANGE_EVENT = 'callisto:analytics-consent';
const REOPEN_EVENT = 'callisto:cookie-settings';

// The visitor's answer: localStorage, or memory when storage is unavailable
// so the banner still closes for the rest of the visit.
let memoryChoice: Choice | null = null;

function readChoice(): Choice | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'granted' || saved === 'denied') return saved;
  } catch { /* storage unavailable */ }
  return memoryChoice;
}

function saveChoice(choice: Choice) {
  memoryChoice = choice;
  try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* private mode */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribeChoice(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function setDisabled(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${googleAnalyticsId}`] = disabled;
}

/** Loads gtag.js once consent is given. Production builds only, so local
 *  development doesn't count as visits. */
function startAnalytics() {
  if (process.env.NODE_ENV !== 'production') return;
  setDisabled(false);
  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  const dataLayer = (window.dataLayer ??= []);
  // gtag.js expects the arguments object itself, not an array of its items.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', googleAnalyticsId, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
  document.head.appendChild(script);
}

/** Stops a running gtag.js and removes its _ga cookies. */
function stopAnalytics() {
  setDisabled(true);
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  // Google Analytics sets its cookies on the widest domain it can, so try each one.
  const hosts = location.hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'));
  for (const cookie of document.cookie.split('; ')) {
    const name = cookie.split('=')[0];
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    document.cookie = `${name}=; max-age=0; path=/`;
    for (const host of hosts) document.cookie = `${name}=; max-age=0; path=/; domain=${host}`;
  }
}

/** Asks before Google Analytics runs. Hidden once answered; "Cookie settings"
 *  (CookieSettingsButton) asks again. */
export default function AnalyticsConsent() {
  // undefined until hydrated, so the static HTML never contains the banner.
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => undefined);
  const [reopened, setReopened] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (choice === 'granted') startAnalytics();
    else if (choice === 'denied') stopAnalytics();
  }, [choice]);

  useEffect(() => {
    const reopen = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setReopened(true);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  // Opened from a button: move focus into the banner.
  useEffect(() => {
    if (reopened) panel.current?.querySelector('button')?.focus();
  }, [reopened]);

  function close() {
    setReopened(false);
    opener.current?.focus();
    opener.current = null;
  }

  function decide(next: Choice) {
    saveChoice(next);
    close();
  }

  if (choice === undefined || (choice !== null && !reopened)) return null;
  return <section
    ref={panel}
    className="consent"
    role="dialog"
    aria-modal="false"
    aria-labelledby="consent-title"
    aria-describedby="consent-text"
    onKeyDown={event => { if (event.key === 'Escape' && choice !== null) close(); }}
  >
    <h2 id="consent-title">Allow analytics cookies?</h2>
    <p id="consent-text">With your permission, Google Analytics sets cookies that show which pages, guide chapters and downloads people use, which helps improve them. Nothing is set unless you accept. <Link href="/privacy/">Privacy details</Link></p>
    {choice && <p className="consent-current">Your current choice: <strong>{choice === 'granted' ? 'accepted' : 'declined'}</strong></p>}
    <div className="consent-actions">
      <button type="button" className="button sm" onClick={() => decide('denied')}>Decline</button>
      <button type="button" className="button sm" onClick={() => decide('granted')}>Accept</button>
    </div>
  </section>;
}

/** Reopens the consent banner. Renders nothing when analytics is turned off. */
export function CookieSettingsButton({ className, children = 'Cookie settings' }: { className?: string; children?: React.ReactNode }) {
  if (!googleAnalyticsId) return null;
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(REOPEN_EVENT))}>{children}</button>;
}
