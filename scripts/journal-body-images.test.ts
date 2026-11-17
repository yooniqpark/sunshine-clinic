import assert from "node:assert/strict";
import { test } from "node:test";
import { readJournalBodyImage, separateJournalBodyImages } from "../lib/journal-body-images";

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgQIAhl6qRwAAAABJRU5ErkJggg==", "base64");
const src = "data:image/png;base64," + png.toString("base64");
const html = '<table><tr><td><img alt="비교 &amp; 안내" src="' + src + '" /></td></tr></table><h3>참고문헌</h3>';
const keyFrom = (output: string) => output.match(/\/media\/([0-9]+-[a-f0-9]{24})/)?.[1];

test("keeps author formatting and serves the exact original raster bytes", () => {
  const output = separateJournalBodyImages(html, "example-id");
  const key = keyFrom(output);
  assert.ok(key);
  assert.equal(output, '<table><tr><td><img alt="비교 &amp; 안내" src="/journal/example-id/media/' + key + '" loading="lazy" decoding="async" /></td></tr></table><h3>참고문헌</h3>');
  assert.deepEqual(readJournalBodyImage(html, key), { bytes: png, mime: "image/png" });
});

test("binds links to an image position and content; remote URLs stay unchanged", () => {
  const remote = '<img src="https://example.test/cover.png" alt="외부 이미지">';
  const output = separateJournalBodyImages(remote + html, "example-id");
  const key = keyFrom(output);
  assert.ok(key?.startsWith("1-"));
  assert.ok(output.startsWith(remote));
  assert.equal(readJournalBodyImage(html, key!), null);
  assert.equal(readJournalBodyImage(remote + html, "01-" + key!.split("-")[1]), null);
  assert.equal(readJournalBodyImage(remote + html, key!.slice(0, -1) + (key!.endsWith("0") ? "1" : "0")), null);
});

test("never serves SVG, non-raster bytes, oversized values, or invalid IDs", () => {
  const svg = html.replace(src, "data:image/svg+xml;base64,AAAA");
  assert.equal(separateJournalBodyImages(svg, "example-id"), svg);
  const disguised = html.replace(src, "data:image/png;base64,PHN2Zz4=");
  const key = keyFrom(separateJournalBodyImages(disguised, "example-id"));
  assert.ok(key);
  assert.equal(readJournalBodyImage(disguised, key), null);
  assert.equal(separateJournalBodyImages(html, "../escape"), html);
  const oversized = '<img src="data:image/png;base64,' + "A".repeat(18_000_004) + '">';
  assert.equal(separateJournalBodyImages(oversized, "example-id"), oversized);
});
