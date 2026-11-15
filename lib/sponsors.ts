// Verified public GitHub Sponsors. scripts/fetch-sponsors.py refreshes the
// committed snapshot at deploy time when SPONSORS_TOKEN is configured.
import data from '@/content/sponsors.json';

export type Sponsor = {
  login: string;
  name: string;
  url: string;
  avatar: string;
  /** Sponsoring now, rather than in the past. */
  active: boolean;
  /** Date of the first sponsorship, YYYY-MM-DD, when available from GitHub. */
  since: string | null;
};

export const sponsors = data.sponsors as Sponsor[];
export const sponsorsUpdated = data.updated as string | null;
