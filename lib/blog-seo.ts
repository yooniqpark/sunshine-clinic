import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import type { BlogPost } from "./blog";

export const JOURNAL_PATH = "/journal";
export const JOURNAL_TITLE = "닥터스 블로그";
export const JOURNAL_DESCRIPTION = "선샤인의원 김병현 대표원장이 전하는 진료 이야기";
export const JOURNAL_AUTHOR = { name: "김병현", jobTitle: "대표원장", path: "/about#doctors" };

// Keep both uploaded documents editable. Only consolidate the verified pair,
// and only while both are public and their titles and text still match.
export const JOURNAL_ALIAS = {
  from: "687479db-33fe-425e-828c-838ed488131e",
  to: "ec278216-3b56-4a59-839b-79a04738a0c6",
};

function normalizedText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, "").normalize("NFC");
}

export function isJournalAlias(post?: BlogPost | null, canonical?: BlogPost | null) {
  if (!post?.published || !canonical?.published || post.id !== JOURNAL_ALIAS.from || canonical.id !== JOURNAL_ALIAS.to) return false;
  const text = normalizedText(post.html);
  return text.length > 0 && post.title.trim().normalize("NFC") === canonical.title.trim().normalize("NFC") && text === normalizedText(canonical.html);
}

export function publicJournalPosts(posts: BlogPost[]) {
  const published = posts.filter(post => post.published);
  const alias = published.find(post => post.id === JOURNAL_ALIAS.from);
  const canonical = published.find(post => post.id === JOURNAL_ALIAS.to);
  return isJournalAlias(alias, canonical) ? published.filter(post => post.id !== JOURNAL_ALIAS.from) : published;
}

export const journalPostPath = (id: string) => `${JOURNAL_PATH}/${id}`;
const COVER_DATA = /^data:image\/(?:jpeg|png|webp|avif|gif);base64,/i;
export function hasJournalCover(cover?: string) {
  return Boolean(cover && COVER_DATA.test(cover) && cover.length <= 17_000_000);
}

export function journalCoverPath(post: Pick<BlogPost, "id" | "coverUrl" | "updatedAt">) {
  return hasJournalCover(post.coverUrl) ? `${journalPostPath(post.id)}/cover?v=${encodeURIComponent(post.updatedAt)}` : null;
}

const absolute = (site: string, path: string) => new URL(path, site).href;

export function journalMetadata(site: string, brand: string, post?: BlogPost): Metadata {
  const title = post?.title ?? JOURNAL_TITLE;
  const description = post?.excerpt || JOURNAL_DESCRIPTION;
  const url = absolute(site, post ? journalPostPath(post.id) : JOURNAL_PATH);
  const cover = post?.published ? journalCoverPath(post) : null;
  const images = [{ url: absolute(site, cover ?? "/og.jpg"), alt: title }];
  const common = { title, description, url, images, siteName: brand, locale: "ko_KR" };
  return {
    title, description,
    alternates: { canonical: url },
    robots: { index: !post || post.published, follow: !post || post.published },
    openGraph: post ? {
      ...common, type: "article", publishedTime: post.createdAt,
      modifiedTime: post.updatedAt, authors: [absolute(site, JOURNAL_AUTHOR.path)],
    } : { ...common, type: "website" },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function journalArticleData(site: string, publisher: string, post: BlogPost) {
  const url = absolute(site, journalPostPath(post.id));
  const cover = journalCoverPath(post);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting", "@id": `${url}#article`, url,
        mainEntityOfPage: url, headline: post.title, description: post.excerpt || undefined,
        inLanguage: "ko-KR", articleSection: post.category,
        datePublished: post.createdAt, dateModified: post.updatedAt,
        image: cover ? absolute(site, cover) : undefined,
        author: { "@type": "Person", name: JOURNAL_AUTHOR.name, jobTitle: JOURNAL_AUTHOR.jobTitle, url: absolute(site, JOURNAL_AUTHOR.path) },
        publisher: { "@type": "MedicalClinic", "@id": absolute(site, "/#clinic"), name: publisher, url: absolute(site, "/home") },
        isPartOf: { "@type": "Blog", name: JOURNAL_TITLE, url: absolute(site, JOURNAL_PATH) },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: publisher, item: absolute(site, "/") },
          { "@type": "ListItem", position: 2, name: JOURNAL_TITLE, item: absolute(site, JOURNAL_PATH) },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

export const journalJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
