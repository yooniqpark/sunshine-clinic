import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@yooniqpark/clinic-core/auth";
import { setRequestLocale } from "next-intl/server";
import { getBlogPost } from "@/lib/blog";
import { clinicConfig } from "@/clinic.config";
import { SITE_URL } from "@yooniqpark/clinic-core/lib/seo";
import { isJournalAlias, JOURNAL_ALIAS, JOURNAL_AUTHOR, journalArticleData, journalJsonLd, journalMetadata, journalPostPath } from "@/lib/blog-seo";
import { journalTopicForPost } from "@/lib/journal-topics";
import Director from "../Director";
import s from "../journal.module.css";

export const dynamic = "force-dynamic";
type Params = Promise<{ locale: string; id: string }>;
function articleBody(html: string, title: string) {
  const first = html.match(/^\s*<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i);
  if (first) {
    const plain = first[1].replace(/<[^>]*>/g, "").replace(/&#(\d+);|&#x([a-f0-9]+);|&(amp|lt|gt|quot|apos);/gi, (_entity, decimal: string, hex: string, named: string) => {
      if (decimal || hex) {
        const code = Number.parseInt(decimal || hex, decimal ? 10 : 16);
        return code <= 0x10ffff ? String.fromCodePoint(code) : "�";
      }
      return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" } as Record<string, string>)[named.toLowerCase()];
    });
    if (plain.trim().normalize("NFC") === title.trim().normalize("NFC")) html = html.slice(first[0].length);
  }
  return html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");
}
const visiblePost = cache(async (locale: string, id: string) => {
  if (locale !== "ko") notFound();
  const post = await getBlogPost(id);
  if (!post) notFound();
  if (!post.published) {
    const session = await auth();
    if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") notFound();
  }
  if (post.published && id === JOURNAL_ALIAS.from &&
      isJournalAlias(post, await getBlogPost(JOURNAL_ALIAS.to))) {
    permanentRedirect(journalPostPath(JOURNAL_ALIAS.to));
  }
  return post;
});
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  return journalMetadata(SITE_URL, clinicConfig.brand, await visiblePost(locale, id));
}
export default async function JournalPost({ params }: { params: Params }) {
  const { locale, id } = await params;
  const post = await visiblePost(locale, id);
  const topic = post.published ? journalTopicForPost(post.id) : undefined;
  setRequestLocale("ko");
  const colors = Array.from(new Set(Array.from(post.html.matchAll(/docx-color-([a-f0-9]{6})/gi), match => match[1].toLowerCase())));
  return <section className={s.journal}><div className={s.layout}><Director /><main>
    {post.published && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: journalJsonLd(journalArticleData(SITE_URL, "선샤인의원", post)) }} />}
    <Link className={s.back} href="/journal">← 이야기 목록으로</Link>
    {!post.published && <div className={s.draft}>초안 미리보기입니다. 관리자에게만 표시되며 방문자에게 공개되지 않습니다. <Link href={`/admin/blog/${post.id}`}>편집으로 돌아가기 →</Link></div>}
    <header className={s.articleHeader}><span className={s.eyebrow}>DOCTOR’S BLOG · {post.category}</span><h1>{post.title}</h1><p className={s.meta}><Link href={JOURNAL_AUTHOR.path}>선샤인의원 {JOURNAL_AUTHOR.name} {JOURNAL_AUTHOR.jobTitle}</Link> · <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}</time></p></header>
    <article className={s.body} dangerouslySetInnerHTML={{ __html: articleBody(post.html, post.title) }} />
    <style>{colors.map(color => `.${s.body} span.docx-color-${color}{color:#${color}}`).join("")}</style>
    <footer className={s.footer}>
      {topic && <p className="mb-4"><Link href={topic.path}>{topic.label} 시술 안내 →</Link></p>}
      <Link href="/journal">← 닥터스 블로그 전체 보기</Link>
    </footer>
  </main></div></section>;
}
