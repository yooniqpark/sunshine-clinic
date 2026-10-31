"""Build private, IP-free AI access summaries from rotated nginx logs."""
import argparse
import datetime as dt
import gzip
import ipaddress
import json
import os
from pathlib import Path
import pwd
import re
import tempfile
import urllib.request

UTC = dt.timezone.utc
TOKENS = {
    'oai-searchbot': 'openai-search', 'gptbot': 'openai-training',
    'chatgpt-user': 'chatgpt-user', 'claudebot': 'claude-bot',
    'claude-user': 'claude-user', 'claude-searchbot': 'claude-search',
    'anthropic-ai': 'claude-bot', 'claude-web': 'claude-bot',
    'googleother': 'google-other', 'googlebot': 'googlebot',
}
TOKEN_RE = re.compile('|'.join(re.escape(t) for t in TOKENS), re.I)
LOG_RE = re.compile(r'^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^\"]*) HTTP/[0-9.]+" (\d{3}) \S+ "[^\"]*" "([^\"]*)"')
IP_URLS = {
    'openai-search': 'https://openai.com/searchbot.json',
    'openai-training': 'https://openai.com/gptbot.json',
    'chatgpt-user': 'https://openai.com/chatgpt-user.json',
}


def stamp(value):
    return value.astimezone(UTC).isoformat().replace('+00:00', 'Z')


def parse_stamp(value):
    return dt.datetime.fromisoformat(value.replace('Z', '+00:00'))


def read_json(path, fallback):
    try:
        return json.loads(Path(path).read_text())
    except (OSError, ValueError):
        return fallback


def write_json(path, value, owner=None):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix='.' + path.name, dir=path.parent)
    try:
        with os.fdopen(descriptor, 'w') as stream:
            json.dump(value, stream, ensure_ascii=False, separators=(',', ':'))
        os.chmod(temporary, 0o640)
        if owner:
            account = pwd.getpwnam(owner)
            os.chown(temporary, account.pw_uid, account.pw_gid)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def load_ranges(cache_file, now, owner=None):
    cached = read_json(cache_file, {})
    updated = cached.get('updatedAt')
    fresh = False
    try:
        fresh = updated is not None and dt.timedelta(0) <= now - parse_stamp(updated) < dt.timedelta(hours=24)
    except (ValueError, TypeError):
        pass
    if not fresh:
        fetched = {}
        try:
            for bot, url in IP_URLS.items():
                with urllib.request.urlopen(url, timeout=8) as response:
                    data = json.load(response)
                prefixes = [p.get('ipv4Prefix') or p.get('ipv6Prefix') for p in data['prefixes']]
                fetched[bot] = [str(ipaddress.ip_network(p)) for p in prefixes if p]
                if not fetched[bot]:
                    raise ValueError('Empty official IP list')
            cached = {'updatedAt': stamp(now), 'ranges': fetched}
            write_json(cache_file, cached, owner)
        except (OSError, ValueError, KeyError):
            # Preserve the last successful snapshot and disclose the cache date.
            if not cached.get('ranges'):
                cached = {'updatedAt': None, 'ranges': {}}
    return {bot: [ipaddress.ip_network(p) for p in prefixes] for bot, prefixes in cached.get('ranges', {}).items()}, cached.get('updatedAt')


def content_path(path):
    if path.startswith(('/_next/', '/uploads/', '/api/', '/admin')) or '.' in path:
        return False
    parts = path.strip('/').split('/')
    if parts[0] in ('ko', 'en', 'ja', 'zh'):
        parts = parts[1:]
    return not parts or parts[0] in ('', 'home', 'about', 'journal', 'blog', 'treatments', 'community')


def build_snapshot(log_dir, previous, networks, now, ranges_updated=None):
    fresh = {}
    coverage = []
    unique_files = {}
    for candidate in Path(log_dir).glob('*access.log*'):
        if not re.search(r'access\.log(?:\.\d+)?(?:\.gz)?$', candidate.name):
            continue
        key = str(candidate).removesuffix('.gz')
        if key not in unique_files or candidate.suffix == '.gz':
            unique_files[key] = candidate
    files = sorted(unique_files.values())
    if not files:
        raise ValueError('No nginx access logs found')
    for path in files:
        first = last = None
        opener = gzip.open if path.suffix == '.gz' else open
        with opener(path, 'rt', errors='replace') as stream:
            for line in stream:
                match = LOG_RE.match(line)
                if not match:
                    continue
                address, date, method, target, status, agent = match.groups()
                if first is None:
                    first = date
                last = date
                token = TOKEN_RE.search(agent)
                if not token:
                    continue
                at = dt.datetime.strptime(date, '%d/%b/%Y:%H:%M:%S %z').astimezone(UTC)
                if at > now or at < now - dt.timedelta(days=33):
                    continue
                bot = TOKENS[token.group().lower()]
                hour = stamp(at.replace(minute=0, second=0, microsecond=0))
                bucket = fresh.setdefault(hour, {'bots': {}, 'pages': []})
                count = bucket['bots'].setdefault(bot, {'requests': 0, 'verified': 0, 'ok': 0})
                count['requests'] += 1
                status = int(status)
                verified = False
                try:
                    ip = ipaddress.ip_address(address)
                    verified = any(ip in network for network in networks.get(bot, []))
                except ValueError:
                    pass
                count['verified'] += int(verified)
                # Query strings, IPs and full user-agent values never leave memory.
                clean_path = target.split('?', 1)[0].split('#', 1)[0][:200]
                is_page = method == 'GET' and status == 200 and content_path(clean_path)
                count['ok'] += int(is_page)
                access = {'botId': bot, 'at': stamp(at), 'path': clean_path, 'status': status, 'verified': verified}
                if 'last' not in count or access['at'] > count['last']['at']:
                    count['last'] = access
                if is_page:
                    bucket['pages'].append(access)
                    bucket['pages'] = sorted(bucket['pages'], key=lambda item: item['at'], reverse=True)[:20]
        for value in (first, last):
            if value:
                coverage.append(dt.datetime.strptime(value, '%d/%b/%Y:%H:%M:%S %z').astimezone(UTC))

    cutoff = now.replace(hour=0, minute=0, second=0, microsecond=0) - dt.timedelta(days=32)
    hours = {hour: bucket for hour, bucket in previous.get('hours', {}).items() if parse_stamp(hour) >= cutoff}
    # Replace overlapping hours instead of summing: reruns and rotated archives
    # cannot count the same requests twice. Keep hours whose logs rotated away.
    hours.update(fresh)
    old_from = previous.get('coverageFrom')
    if old_from:
        coverage.append(max(cutoff, parse_stamp(old_from)))
    return {
        'schemaVersion': 1, 'updatedAt': stamp(now),
        'coverageFrom': stamp(max(cutoff, min(coverage))) if coverage else None,
        'coverageTo': stamp(min(now, max(coverage))) if coverage else None,
        'openaiIpUpdatedAt': ranges_updated,
        'verifiableBots': list(networks), 'hours': hours,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--log-dir', default='/var/log/nginx')
    parser.add_argument('--output', required=True)
    parser.add_argument('--owner')
    args = parser.parse_args()
    now = dt.datetime.now(UTC)
    output = Path(args.output)
    networks, updated = load_ranges(output.with_name('openai-ip-ranges.json'), now, args.owner)
    result = build_snapshot(args.log_dir, read_json(output, {}), networks, now, updated)
    write_json(output, result, args.owner)
    print('AI access snapshot updated:', result['updatedAt'], 'hours:', len(result['hours']))


if __name__ == '__main__':
    main()
