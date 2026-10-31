import datetime as dt
import gzip
import importlib.util
import ipaddress
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('collector', Path(__file__).with_name('collect-ai-access.py'))
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class CollectorTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        self.now = dt.datetime(2026, 10, 31, 2, tzinfo=dt.timezone.utc)
        self.ranges = {bot: [ipaddress.ip_network('192.0.2.0/24')] for bot in collector.IP_URLS}
        self.lines = [
            self.line('192.0.2.1', 'OAI-SearchBot/1.0', '/robots.txt'),
            self.line('192.0.2.1', 'OAI-SearchBot/1.0', '/journal/test?secret=removed'),
            self.line('198.51.100.1', 'OAI-SearchBot/1.0', '/home'),
            self.line('198.51.100.2', 'ClaudeBot/1.0', '/en/about'),
            self.line('198.51.100.3', 'Claude-SearchBot/1.0', '/cms/.env', 404),
        ]
        (self.root / 'access.log').write_text(''.join(self.lines))
        with gzip.open(self.root / 'access.log.1.gz', 'wt') as stream:
            stream.write(self.line('192.0.2.2', 'GPTBot/1.4', '/en/home', date='30/Oct/2026:01:01:00 +0000'))

    def tearDown(self):
        self.directory.cleanup()

    @staticmethod
    def line(ip, agent, path, status=200, date='31/Oct/2026:01:01:00 +0000'):
        return f'{ip} - - [{date}] "GET {path} HTTP/1.1" {status} 12 "-" "{agent}"\n'

    def collect(self, previous=None):
        return collector.build_snapshot(self.root, previous or {}, self.ranges, self.now, '2026-10-31T00:00:00Z')

    def test_identity_counts_privacy_and_successful_pages(self):
        result = self.collect()
        bucket = result['hours']['2026-10-31T01:00:00Z']
        count = bucket['bots']['openai-search']
        self.assertEqual((count['requests'], count['verified'], count['ok']), (3, 2, 2))
        self.assertEqual(bucket['bots']['claude-search']['ok'], 0)
        self.assertEqual({p['path'] for p in bucket['pages']}, {'/journal/test', '/home', '/en/about'})
        self.assertTrue(any(not p['verified'] for p in bucket['pages']))
        rendered = json.dumps(result)
        for private in ['192.0.2.1', '198.51.100.1', 'secret=removed', 'OAI-SearchBot/1.0']:
            self.assertNotIn(private, rendered)

    def test_rerun_rotation_and_duplicate_archives(self):
        first = self.collect()
        self.assertEqual(first['hours'], self.collect(first)['hours'])
        # logrotate can briefly leave the uncompressed and gzip versions together.
        (self.root / 'access.log.1').write_text(self.line('192.0.2.2', 'GPTBot/1.4', '/en/home', date='30/Oct/2026:01:01:00 +0000'))
        second = self.collect(first)
        self.assertEqual(second['hours']['2026-10-30T01:00:00Z']['bots']['openai-training']['requests'], 1)
        (self.root / 'access.log.1').unlink()
        (self.root / 'access.log.1.gz').unlink()
        third = self.collect(second)
        self.assertEqual(third['hours']['2026-10-30T01:00:00Z']['bots']['openai-training']['requests'], 1)

    def test_atomic_snapshot_and_retention(self):
        previous = {'hours': {'2026-01-01T00:00:00Z': {'bots': {}, 'pages': []}}}
        result = self.collect(previous)
        self.assertNotIn('2026-01-01T00:00:00Z', result['hours'])
        target = self.root / 'result.json'
        collector.write_json(target, result)
        self.assertEqual(collector.read_json(target, {}), result)
        self.assertEqual(target.stat().st_mode & 0o777, 0o640)


if __name__ == '__main__':
    unittest.main()
