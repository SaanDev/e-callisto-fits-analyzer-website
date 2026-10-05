'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'' | 'copied' | 'failed'>('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
      window.setTimeout(() => setState(''), 2400);
    } catch {
      setState('failed');
    }
  }
  return <div className="copy-row">
    <button type="button" className="button sm" onClick={copy}>{state === 'copied' ? <Check size={15} /> : <Copy size={15} />}{state === 'copied' ? 'Copied' : label}</button>
    <span className="status" role="status">{state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Copy unavailable. Select the text and copy it manually.' : ''}</span>
  </div>;
}
