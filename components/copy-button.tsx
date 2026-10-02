'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
export default function CopyButton({ text, label = 'Copy' }: {
    text: string;
    label?: string;
}) { const [state, setState] = useState(''); return <><button className="button secondary" onClick={async () => { try {
    await navigator.clipboard.writeText(text);
    setState('Copied to clipboard');
}
catch {
    setState('Copy unavailable. Select the text below and copy it manually.');
} }}>{state === 'Copied to clipboard' ? <Check size={16}/> : <Copy size={16}/>} {label}</button><p className="status" role="status">{state}</p></>; }
