import { createHash } from "node:crypto";

// Stored DOCX HTML is sanitized before saving and uses quoted attributes.
// Keep the rest of that HTML byte-for-byte unchanged.
const tags = /<img\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
const attributes = /\s+([^\s="'<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
const raster = /^data:(image\/(?:jpeg|png|gif|webp|avif));base64,([A-Za-z0-9+/]+={0,2})$/i;
const maxEncodedSize = 18_000_000;

function source(tag: string) {
  for (const attr of tag.matchAll(attributes)) {
    if (attr[1].toLowerCase() === "src") {
      const value = attr[2] ?? attr[3] ?? "";
      if (value.length > maxEncodedSize) return null;
      const match = raster.exec(value);
      if (!match || match[2].length % 4 !== 0) return null;
      return { attr, value, mime: match[1].toLowerCase(), encoded: match[2] };
    }
  }
  return null;
}

function version(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function separateJournalBodyImages(html: string, postId: string) {
  let position = 0;
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(postId)) return html;
  return html.replace(tags, tag => {
    const index = position++;
    const image = source(tag);
    if (!image) return tag;
    const path = "/journal/" + postId + "/media/" + index + "-" + version(image.value);
    const start = image.attr.index;
    const end = start + image.attr[0].length;
    return tag.slice(0, start) + ' src="' + path + '" loading="lazy" decoding="async"' + tag.slice(end);
  });
}

export const journalMediaKey = /^(0|[1-9]\d{0,5})-([a-f0-9]{24})$/;

export function readJournalBodyImage(html: string, key: string) {
  const match = journalMediaKey.exec(key);
  if (!match) return null;
  const index = Number(match[1]);
  let position = 0;
  for (const [tag] of html.matchAll(tags)) {
    if (position++ !== index) continue;
    const image = source(tag);
    if (!image || version(image.value) !== match[2]) return null;
    const bytes = Buffer.from(image.encoded, "base64");
    if (!hasRasterSignature(bytes, image.mime)) return null;
    return { bytes, mime: image.mime };
  }
  return null;
}

function hasRasterSignature(bytes: Buffer, mime: string) {
  if (mime === "image/jpeg") return bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (mime === "image/png") return bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (mime === "image/gif") return /^GIF8[79]a$/.test(bytes.toString("ascii", 0, 6));
  if (mime === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (mime === "image/avif") return /^ftypavi[fs]$/.test(bytes.toString("ascii", 4, 12));
  return false;
}
