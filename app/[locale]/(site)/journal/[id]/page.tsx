import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@yooniqpark/clinic-core/auth";
import { setRequestLocale } from "next-intl/server";
import { getBlogPost } from "@/lib/blog";
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
async function visiblePost(params: Params) {
  const { locale, id } = await params;
  if (locale !== "ko") notFound();
  const post = await getBlogPost(id);
  if (!post) notFound();
  if (!post.published) {
    const session = await auth();
    if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") notFound();
  }
  return post;
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await visiblePost(params);
  return { title: post.title, description: post.excerpt, robots: post.published ? { index: true, follow: true } : { index: false, follow: false }, alternates: { canonical: `https://mysunshineclinic.com/journal/${post.id}` } };
}
export default async function JournalPost({ params }: { params: Params }) {
  const post = await visiblePost(params);
  setRequestLocale("ko");
  const colors = Array.from(new Set(Array.from(post.html.matchAll(/docx-color-([a-f0-9]{6})/gi), match => match[1].toLowerCase())));
  return <section className={s.journal}><div className={s.layout}><Director /><main>
    <Link className={s.back} href="/journal">← 이야기 목록으로</Link>
    {!post.published && <div className={s.draft}>초안 미리보기입니다. 관리자에게만 표시되며 방문자에게 공개되지 않습니다. <Link href={`/admin/blog/${post.id}`}>편집으로 돌아가기 →</Link></div>}
    <header className={s.articleHeader}><span className={s.eyebrow}>DOCTOR’S BLOG · {post.category}</span><h1>{post.title}</h1><p className={s.meta}>선샤인의원 김병현 대표원장 · {new Date(post.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}</p></header>
    <article className={s.body} dangerouslySetInnerHTML={{ __html: articleBody(post.html, post.title) }} />
    <style>{colors.map(color => `.${s.body} span.docx-color-${color}{color:#${color}}`).join("")}</style>
    <footer className={s.footer}><Link href="/journal">← 닥터스 블로그 전체 보기</Link></footer>
  </main></div></section>;
}
