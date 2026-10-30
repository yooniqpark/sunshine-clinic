import assert from 'node:assert/strict';

// Exercise the real built app without consuming production login attempts.
const origin = process.env.LOGIN_TEST_ORIGIN || 'http://127.0.0.1:8097';
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname), 'Local test server required');
const ip = `login-regression-${Date.now()}`;
const csrfResponse = await fetch(`${origin}/api/auth/csrf`);
assert.equal(csrfResponse.status, 200);
const { csrfToken } = await csrfResponse.json();
const cookie = csrfResponse.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
const attempt = (json = true) => fetch(`${origin}/api/auth/callback/credentials`, {
  method: 'POST',
  redirect: 'manual',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'x-forwarded-for': ip,
    cookie,
    ...(json ? { 'x-auth-return-redirect': '1' } : {}),
  },
  body: new URLSearchParams({
    email: 'nonexistent-regression-user@invalid.test',
    password: 'invalid-regression-password',
    csrfToken,
    callbackUrl: `${origin}/admin/blog`,
  }),
});

for (let i = 0; i < 5; i++) {
  const response = await attempt();
  assert.equal(response.status, 200);
  const { url } = await response.json();
  assert.equal(new URL(url).searchParams.get('error'), 'CredentialsSignin');
}

const blocked = await attempt();
assert.equal(blocked.status, 429);
assert.match(blocked.headers.get('content-type') ?? '', /application\/json/);
assert.ok(Number(blocked.headers.get('retry-after')) > 0);
assert.equal(blocked.headers.get('cache-control'), 'no-store');
const { url } = await blocked.json();
const destination = new URL(url);
assert.equal(destination.searchParams.get('error'), 'too-many-attempts');
assert.equal(destination.searchParams.get('code'), blocked.headers.get('retry-after'));

const form = await attempt(false);
assert.equal(form.status, 307, 'Ordinary form redirects stay compatible');
assert.match(form.headers.get('location') ?? '', /too-many-attempts/);
assert.equal((await fetch(`${origin}/api/auth/csrf`)).status, 200);
console.log('Admin login: invalid credentials, JSON rate limit, retry time, and form fallback passed');
