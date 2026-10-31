import assert from 'node:assert/strict';
import sharp from 'sharp';

const origin = process.env.BLOG_TEST_ORIGIN || 'http://localhost:8097';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname), 'Local test server required');
const cookies = new Map();
async function call(path, options = {}, authenticated = true) {
  const response = await fetch(origin + path, {
    redirect: 'manual', ...options,
    headers: { ...(authenticated ? { cookie: [...cookies].map(([k,v]) => `${k}=${v}`).join('; ') } : {}), ...options.headers },
  });
  if (authenticated) for (const value of response.headers.getSetCookie()) {
    const pair = value.split(';')[0], split = pair.indexOf('=');
    cookies.set(pair.slice(0, split), pair.slice(split + 1));
  }
  return response;
}
let response = await call('/api/auth/csrf');
const { csrfToken } = await response.json();
await call('/api/auth/callback/credentials', {
  method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ csrfToken, email: process.env.BLOG_TEST_EMAIL || 'blog-test@local.test', password: process.env.BLOG_TEST_PASSWORD || 'local-blog-verify-2026', callbackUrl: origin + '/admin/blog' }),
});
response = await call('/api/admin/blog');
assert.equal(response.status, 200, 'Local administrator must authenticate');
const { posts } = await response.json();
assert.ok(posts.length >= 2, 'Use a local fixture with two posts to verify stable order');
const original = posts.at(-1), endpoint = `/api/admin/blog/${original.id}/cover`;
const firstImage = original.html.match(/<img[^>]*src="([^"]+)"/)?.[1] || '';
assert.equal(original.coverUrl, firstImage, 'Use a disposable local fixture with its default cover');

const image = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: '#d3b69c' } }).png().toBuffer();
function form(buffer = image, type = 'image/png', name = 'preview.png') {
  const data = new FormData(); data.append('file', new Blob([buffer], { type }), name); return data;
}
assert.equal((await call(endpoint, { method: 'POST', body: form() }, false)).status, 401);
assert.equal((await call(endpoint, { method: 'DELETE' }, false)).status, 401);
assert.equal((await call(endpoint, { method: 'POST', body: form(), headers: { origin: 'https://external.invalid' } })).status, 403);
assert.equal((await call(endpoint, { method: 'DELETE', headers: { origin: 'https://external.invalid' } })).status, 403);
assert.equal((await call('/api/admin/blog/missing-cover-fixture/cover', { method: 'POST', body: form() })).status, 404);
assert.equal((await call(endpoint, { method: 'POST', body: new FormData() })).status, 400);
assert.equal((await call(endpoint, { method: 'POST', body: form(Buffer.from('<svg/>'), 'image/svg+xml', 'image.svg') })).status, 400);
assert.equal((await call(endpoint, { method: 'POST', body: form(Buffer.from('not an image')) })).status, 400);
assert.equal((await call(endpoint, { method: 'POST', body: form(Buffer.alloc(5 * 1024 * 1024 + 1)) })).status, 413);

try {
  response = await call(endpoint, { method: 'POST', body: form(), headers: { origin } });
  assert.equal(response.status, 200, await response.clone().text());
  const { post } = await response.json();
  assert.match(post.coverUrl, /^data:image\/webp;base64,/);
  const decoded = await sharp(Buffer.from(post.coverUrl.split(',')[1], 'base64')).metadata();
  assert.ok(decoded.width <= 1200 && decoded.height <= 1200);
  assert.equal(post.html, original.html, 'Cover upload must preserve article body');
  assert.equal(post.title, original.title);
  assert.equal(post.category, original.category);
  assert.equal(post.published, original.published);
  const refreshed = (await (await call('/api/admin/blog')).json()).posts;
  assert.deepEqual(refreshed.map(p => p.id), posts.map(p => p.id), 'Cover editing must preserve list order');
  assert.equal(refreshed.find(p => p.id === post.id).coverUrl, post.coverUrl, 'Cover must persist');
  const publicPage = await call('/journal', {}, false);
  assert.ok((await publicPage.text()).includes(post.coverUrl), 'Public list must display the uploaded cover');
  await call(`/api/admin/blog/${post.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ published: false }) });
  const draftUpload = await call(endpoint, { method: 'POST', body: form(), headers: { origin } });
  assert.equal(draftUpload.status, 200);
  assert.equal((await draftUpload.json()).post.published, false, 'Uploading a cover must not publish a draft');
  assert.equal((await call(`/journal/${post.id}`, {}, false)).status, 404);
} finally {
  await call(`/api/admin/blog/${original.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ published: original.published }) });
  response = await call(endpoint, { method: 'DELETE', headers: { origin } });
  assert.equal(response.status, 200);
  const reset = (await response.json()).post;
  assert.equal(reset.coverUrl, firstImage);
  assert.equal(reset.html, original.html);
  assert.equal(reset.published, original.published);
}
console.log('Blog cover: authorization, origin, file validation, upload, persistence, body/status/order preservation, public display, and reset passed');
