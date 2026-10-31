import assert from 'node:assert/strict';

const origin = process.env.ANALYTICS_TEST_ORIGIN || 'http://localhost:8097';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname), 'Local test server required');
const campaign = 'ai-analytics-local-check';
const events = [
  { path: '/journal?secret=removed', referrer: 'https://chatgpt.com/c/private-chat', search: `?utm_campaign=${campaign}` },
  { path: '/treatments/anti-aging/rejuran', referrer: 'https://gemini.google.com/app/private-chat', search: `?utm_campaign=${campaign}` },
  { path: '/home', referrer: '', search: `?utm_source=claude&utm_campaign=${campaign}` },
  { path: '/journal', referrer: '', search: `?utm_source=chatgpt.com&utm_campaign=${campaign}` },
  { path: '/home', referrer: 'https://chatgpt.com.evil.example', search: `?utm_campaign=${campaign}` },
];
for (const event of events) {
  const response = await fetch(origin + '/api/pv', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...event, locale: 'ko' }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
}
const excluded = await fetch(origin + '/api/pv', { method: 'POST', headers: { 'content-type': 'application/json', cookie: 'sunshine-noanalytics=1' }, body: JSON.stringify(events[0]) });
assert.equal((await excluded.json()).skipped, 'excluded');
assert.equal((await fetch(origin + '/admin/analytics', { redirect: 'manual' })).status, 307);

const cookies = new Map();
async function call(path, options = {}) {
  const response = await fetch(origin + path, { redirect: 'manual', ...options, headers: { cookie: [...cookies].map(([k,v]) => `${k}=${v}`).join('; '), ...options.headers } });
  for (const value of response.headers.getSetCookie()) {
    const pair = value.split(';')[0], split = pair.indexOf('=');
    cookies.set(pair.slice(0, split), pair.slice(split + 1));
  }
  return response;
}
const { csrfToken } = await (await call('/api/auth/csrf')).json();
await call('/api/auth/callback/credentials', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrfToken, email: process.env.ANALYTICS_TEST_EMAIL || 'blog-test@local.test', password: process.env.ANALYTICS_TEST_PASSWORD || 'local-blog-verify-2026', callbackUrl: origin + '/admin/analytics' }) });
const page = await call('/admin/analytics');
assert.equal(page.status, 200);
const html = await page.text();
for (const text of ['AI 서비스 유입', 'ChatGPT', 'Gemini', 'Claude', '최근 7일', '최근 30일', '/treatments/anti-aging/rejuran']) assert.ok(html.includes(text), text);
assert.ok(!html.includes('private-chat'), 'Conversation paths must not be retained');
assert.ok(!html.includes('secret=removed'), 'Visited URL queries must not be retained');
console.log('AI analytics HTTP: referrer/UTM ingestion, visitor exclusion, admin access, private-path stripping, and rendered service/path breakdown passed');
console.log(`Disposable local fixture campaign: ${campaign}`);
