import assert from "node:assert/strict";
import { test } from "node:test";
import type { BlogPost } from "../lib/blog";
import { hasJournalCover, JOURNAL_ALIAS, journalArticleData, journalCoverPath, journalJsonLd, journalMetadata, publicJournalPosts } from "../lib/blog-seo";
import { journalTopicForPost, journalTopicForTreatment } from "../lib/journal-topics";

const site = "https://example.test";
const post = (id: string, override: Partial<BlogPost> = {}): BlogPost => ({
  id, title: "리쥬란 칼럼", category: "닥터스 블로그", excerpt: "글 설명", html: "<p>본문</p>",
  coverUrl: "data:image/webp;base64,AAAA", sourceName: "test.docx", published: true,
  createdAt: "2026-11-01T02:00:00.000Z", updatedAt: "2026-11-02T02:00:00.000Z", ...override,
});

test("consolidates only the verified pair and keeps other posts and order", () => {
  const primary = post(JOURNAL_ALIAS.to);
  const duplicate = post(JOURNAL_ALIAS.from, { html: "<p>본 문</p>" });
  const other = post("another-post");
  assert.deepEqual(publicJournalPosts([other, primary, duplicate, post("draft", { published: false })]), [other, primary]);
  assert.deepEqual(publicJournalPosts([duplicate, { ...primary, published: false }]), [duplicate]);
  const edited = { ...duplicate, html: "<p>새 글</p>" };
  assert.deepEqual(publicJournalPosts([primary, edited]), [primary, edited]);
});

test("uses journal URLs and post-specific social tags without embedding image data", () => {
  const article = post("test");
  const metadata = journalMetadata(site, "Sunshine Clinic", article);
  assert.equal(metadata.alternates?.canonical, site + "/journal/test");
  assert.equal(metadata.openGraph?.title, article.title);
  assert.equal(metadata.openGraph?.url, site + "/journal/test");
  assert.ok(JSON.stringify(metadata).includes(site + journalCoverPath(article)));
  assert.ok(!JSON.stringify(metadata).includes("data:image"));
  assert.equal(journalMetadata(site, "Sunshine Clinic").openGraph?.url, site + "/journal");
  assert.deepEqual(journalMetadata(site, "Sunshine Clinic", { ...article, published: false }).robots, { index: false, follow: false });
  assert.equal(hasJournalCover("data:image/svg+xml;base64,AAAA"), false);
  assert.equal(hasJournalCover("https://example.test/remote.jpg"), false);
});

test("article data supplies author and timestamps and safely serializes editor text", () => {
  const article = post("test", { title: "</script><script>test</script>" });
  const data = journalArticleData(site, "선샤인의원", article);
  const [entry, breadcrumb] = data["@graph"];
  assert.equal(entry["@type"], "BlogPosting");
  assert.equal(entry.author?.url, site + "/about#doctors");
  assert.equal(entry.datePublished, article.createdAt);
  assert.equal(entry.dateModified, article.updatedAt);
  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.ok(!journalJsonLd(data).includes("<"));
  assert.equal(JSON.parse(journalJsonLd(data))["@graph"][0].headline, article.title);
});

test("editorial links agree in both directions and exclude unrelated treatments", () => {
  for (const path of ["/treatments/anti-aging/rejuran", "/treatments/lifting/ulthera-prime", "/treatments/lifting/inmode", "/treatments/anti-aging/radiesse", "/treatments/anti-aging/filler"]) {
    const topic = journalTopicForTreatment(path);
    assert.ok(topic);
    assert.equal(journalTopicForPost(topic.id)?.path, path);
  }
  assert.equal(journalTopicForTreatment("/treatments/anti-aging/rejuran-i")?.id, JOURNAL_ALIAS.to);
  assert.equal(journalTopicForTreatment("/treatments/lifting/thermage-flx"), undefined);
});
