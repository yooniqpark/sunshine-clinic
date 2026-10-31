import assert from 'node:assert/strict';
import { aggregateTraffic, classifyTrafficSource } from '../lib/traffic-sources';

const site = 'https://mysunshineclinic.com';
const cases: Array<[string | null, string | null, string | null]> = [
  ['https://chatgpt.com', null, 'ChatGPT'],
  ['https://chat.openai.com/c/private', null, 'ChatGPT'],
  ['https://gemini.google.com', null, 'Gemini'],
  ['https://bard.google.com', null, 'Gemini'],
  ['https://claude.ai/chat/private', null, 'Claude'],
  ['https://claude.com', null, 'Claude'],
  [null, ' ChatGPT ', 'ChatGPT'],
  [null, 'chatgpt.com', 'ChatGPT'],
  [null, 'google_gemini', 'Gemini'],
  [null, 'anthropic', 'Claude'],
  ['https://chatgpt.com', 'google', '구글'],
  ['https://google.com', 'claude', 'Claude'],
  ['https://chatgpt.com.evil.example', null, '기타'],
  ['https://notclaude.ai', null, '기타'],
  ['https://example.com/?ref=gemini.google.com', null, '기타'],
  ['https://chatgpt.com@evil.example', null, '기타'],
  ['https://mysunshineclinic.com.evil.example', null, '기타'],
  ['https://mysunshineclinic.com/journal', null, null],
  [null, null, '직접 방문·출처 미확인'],
  ['https://google.co.kr', null, '구글'],
  ['https://naver.com', null, '네이버'],
];
for (const [referrer, tag, expected] of cases) {
  assert.equal(classifyTrafficSource(referrer, tag, site)?.label ?? null, expected, `${referrer} / ${tag}`);
}
const row = (referrer: string | null, utmSource: string | null, date: string, path = '/journal') => ({ referrer, utmSource, path, createdAt: new Date(date) });
const result = aggregateTraffic([
  row('https://chatgpt.com', null, '2026-10-31T00:00:00Z'),
  row(null, 'chatgpt', '2026-10-30T14:59:59Z'),
  row('https://gemini.google.com', null, '2026-10-31T00:00:00Z', '/treatments/anti-aging/rejuran'),
  row(null, 'claude', '2026-10-20T00:00:00Z', '/home'),
  row('https://claude.ai', null, '2026-10-01T14:59:59Z', '/home'),
  row('https://google.com', null, '2026-10-31T00:00:00Z'),
  row(site, null, '2026-10-31T00:00:00Z'),
  row(null, null, '2026-10-31T00:00:00Z'),
  row('https://chatgpt.com.evil.example', null, '2026-10-31T00:00:00Z'),
  row('https://chatgpt.com', null, '2026-11-01T00:00:00Z'),
  row('https://chatgpt.com', 'google', '2026-10-31T00:00:00Z'),
], site, new Date('2026-10-31T01:10:00Z'));
assert.deepEqual(result.aiReferrals.services, [
  { id: 'chatgpt', label: 'ChatGPT', today: 1, week: 2, month: 2 },
  { id: 'gemini', label: 'Gemini', today: 1, week: 1, month: 1 },
  { id: 'claude', label: 'Claude', today: 0, week: 0, month: 1 },
]);
assert.equal(result.aiReferrals.paths[0].count, 2);
assert.equal(result.sources.find(source => source.label === 'Claude')?.count, 2, 'Calendar month differs from trailing 30 days');
assert.equal(result.sources.reduce((total, source) => total + source.count, 0), 9);
assert.deepEqual(aggregateTraffic([], site).aiReferrals.services.map(service => service.today), [0, 0, 0]);
console.log(`AI analytics: ${cases.length} classification cases, domain lookalikes, UTM precedence, KST midnight, calendar/trailing periods, and zero data passed`);
