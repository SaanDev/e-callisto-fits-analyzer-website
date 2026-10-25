import releases from '@/releases-verified.json';
import { currentLiteReleases, currentReleases } from '@/lib/site';

export type Edition = 'full' | 'lite';
export type OS = keyof typeof currentReleases;

/** Shared release tags can contain both editions and all three platforms. */
export function getDownload(os: OS, edition: Edition) {
  const tag = (edition === 'lite' ? currentLiteReleases : currentReleases)[os];
  const release = releases.find(r => r.tag === tag && !r.prerelease);
  const platformPattern = {
    Windows: /_Setup\.exe$/i,
    Linux: /_amd64\.deb$/i,
    macOS: /_macOS_arm64\.dmg$/i,
  }[os];
  const file = release?.assets.find(a =>
    platformPattern.test(a.name) && /-lite(?:_|\.)/i.test(a.name) === (edition === 'lite')
  );
  return release && file ? { release, file } : null;
}
