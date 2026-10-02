import { env } from 'cloudflare:workers';
export function database() { if (!env.DB)
    throw new Error('Community database unavailable'); return env.DB; }
