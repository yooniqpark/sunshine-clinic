import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { listBlogPosts } from "@/lib/blog";
import Director from "./Director";
import s from "./journal.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "닥터스 노트", description: "선샤인의원 김병현 대표원장이 전하는 진료 이야기", alternates: { canonical: "https://mysunshineclinic.com/journal" } };
const date = (value: string) => new Date(value).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });

export default async function Journal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const posts = await listBlogPosts();
  const featured = posts[0];
  return <section className={s.journal}><div className={s.layout}><Director /><main>
    <span className={s.eyebrow}>SUNSHINE CLINIC JOURNAL</span><h1 className={s.title}>Doctor’s Notes</h1>
    <p className={s.subtitle}>진료실 밖에서도 이어지는, 진심 어린 대화.</p>
    {featured ? <>
      <Link href={`/journal/${featured.id}`} className={s.featured}><span className={s.eyebrow}>{featured.category || "진료 이야기"}</span><h2>{featured.title}</h2><p className={s.excerpt}>{featured.excerpt}</p><p className={s.meta}>{date(featured.createdAt)}</p><span className={s.read}>원장 노트 읽기 →</span></Link>
      <div className={s.sectionLabel}><span>FROM THE NOTEBOOK</span><span>{posts.length}개의 이야기</span></div>
      {posts.map((post, i) => <Link key={post.id} className={s.row} href={`/journal/${post.id}`}><span className={s.number}>{String(posts.length - i).padStart(2, "0")}</span><div><h2>{post.title}</h2><p className={s.meta}>{post.category} · {date(post.createdAt)}</p></div><span aria-hidden="true">↗</span></Link>)}
    </> : <div className={s.empty}>선샤인의 이야기를 준비하고 있습니다.<br />새로운 노트로 곧 찾아뵙겠습니다.</div>}
  </main></div></section>;
}
