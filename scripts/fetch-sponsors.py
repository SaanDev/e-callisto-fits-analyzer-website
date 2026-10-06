"""Fetch the maintainer's public GitHub Sponsors into content/sponsors.json.

The deploy workflow runs this before every build, and once a day on a schedule,
with a personal access token (classic, scopes read:user and read:org) in the
SPONSORS_TOKEN secret. Without a token the existing file is left unchanged, so
local builds keep working.

Only public sponsorships are requested; private sponsors are never listed.
Amounts are not fetched.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

LOGIN = 'SaanDev'
OUT = Path(__file__).resolve().parent.parent / 'content' / 'sponsors.json'

QUERY = '''
query($login: String!, $after: String) {
  user(login: $login) {
    sponsorshipsAsMaintainer(first: 100, after: $after, activeOnly: false, includePrivate: false,
                             orderBy: {field: CREATED_AT, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        createdAt
        isActive
        privacyLevel
        sponsorEntity {
          ... on User { login name url avatarUrl(size: 160) }
          ... on Organization { login name url avatarUrl(size: 160) }
        }
      }
    }
  }
}
'''


def fetch(token):
    sponsors, after = {}, None
    while True:
        request = urllib.request.Request(
            'https://api.github.com/graphql',
            data=json.dumps({'query': QUERY, 'variables': {'login': LOGIN, 'after': after}}).encode(),
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json', 'User-Agent': 'e-callisto-website'},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.load(response)
        if data.get('errors'):
            raise RuntimeError('; '.join(e.get('message', 'unknown error') for e in data['errors']))
        page = data['data']['user']['sponsorshipsAsMaintainer']
        for sponsorship in page['nodes']:
            entity = sponsorship.get('sponsorEntity')
            if sponsorship['privacyLevel'] != 'PUBLIC' or not entity:
                continue
            login = entity['login']
            # Oldest first, so a returning sponsor keeps their first date and
            # counts as current if any of their sponsorships is active.
            if login in sponsors:
                sponsors[login]['active'] = sponsors[login]['active'] or sponsorship['isActive']
                continue
            sponsors[login] = {
                'login': login,
                'name': entity.get('name') or login,
                'url': entity['url'],
                'avatar': entity['avatarUrl'],
                'active': sponsorship['isActive'],
                'since': sponsorship['createdAt'][:10],
            }
        if not page['pageInfo']['hasNextPage']:
            return list(sponsors.values())
        after = page['pageInfo']['endCursor']


def main():
    token = os.environ.get('SPONSORS_TOKEN', '').strip()
    if not token:
        print(f'SPONSORS_TOKEN is not set; keeping {OUT.name} as it is.')
        return
    try:
        sponsors = fetch(token)
    except Exception as error:  # network, authentication or API errors
        message = f'Could not fetch sponsors from GitHub: {error}. Check that the SPONSORS_TOKEN secret is valid and has not expired.'
        # A failed daily refresh leaves the last deployment, and its list, online.
        # A push still deploys, without the list, so content updates are never blocked.
        if os.environ.get('GITHUB_EVENT_NAME') == 'schedule':
            print(f'::error title=Sponsors::{message}')
            sys.exit(1)
        print(f'::warning title=Sponsors::{message}')
        return
    updated = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    OUT.write_text(json.dumps({'updated': updated, 'sponsors': sponsors}, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    current = sum(s['active'] for s in sponsors)
    print(f'Wrote {len(sponsors)} public sponsors ({current} current) to {OUT.name}.')


if __name__ == '__main__':
    main()
