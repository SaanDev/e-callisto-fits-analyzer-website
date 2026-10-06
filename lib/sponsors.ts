// Public GitHub Sponsors, written to content/sponsors.json at deploy time by
// scripts/fetch-sponsors.py. The committed file is an empty list.
import data from '@/content/sponsors.json';

export type Sponsor = {
  login: string;
  name: string;
  url: string;
  avatar: string;
  /** Sponsoring now, rather than in the past. */
  active: boolean;
  /** Date of the first sponsorship, YYYY-MM-DD. */
  since: string;
};

export const sponsors = data.sponsors as Sponsor[];
export const sponsorsUpdated = data.updated as string | null;
