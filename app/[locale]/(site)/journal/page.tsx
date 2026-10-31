import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { listBlogPosts } from "@/lib/blog";
import Director from "./Director";
import s from "./journal.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "닥터스 블로그", description: "선샤인의원 김병현 대표원장이 전하는 진료 이야기", alternates: { canonical: "https://mysunshineclinic.com/journal" } };
const date = (value: string) => new Date(value).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });

function PreviewImage({ src, featured = false }: { src: string; featured?: boolean }) {
  const className = featured ? s.featuredImage : s.thumbnail;
  return src
    ? <Image src={src} alt="" width={480} height={480} className={className} unoptimized />
    : <span className={`${className} ${s.imagePlaceholder}`} aria-hidden="true">S</span>;
}

export default async function Journal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ko") notFound();
  setRequestLocale(locale);
  const posts = await listBlogPosts();
  const featured = posts[0];
  return <section className={s.journal}><div className={s.layout}><Director /><main>
    <span className={s.eyebrow}>SUNSHINE CLINIC BLOG</span><h1 className={s.title}>Doctor’s Blog</h1>
    <p className={s.subtitle}>진료실 밖에서도 이어지는, 진심 어린 대화.</p>
    {featured ? <>
      <Link href={`/journal/${featured.id}`} className={s.featured}>
        <PreviewImage src={featured.coverUrl} featured />
        <div className={s.featuredText}><span className={s.eyebrow}>{featured.category || "진료 이야기"}</span><h2>{featured.title}</h2><p className={s.meta}>{date(featured.createdAt)}</p><span className={s.read}>블로그 읽기 →</span></div>
      </Link>
      <div className={s.sectionLabel}><span>FROM THE NOTEBOOK</span><span>{posts.length}개의 이야기</span></div>
      {posts.map((post, i) => <Link key={post.id} className={s.row} href={`/journal/${post.id}`}><span className={s.number}>{String(posts.length - i).padStart(2, "0")}</span><PreviewImage src={post.coverUrl} /><div className={s.rowText}><h2>{post.title}</h2><p className={s.meta}>{post.category} · {date(post.createdAt)}</p></div><span aria-hidden="true">↗</span></Link>)}
    </> : <div className={s.empty}>선샤인의 이야기를 준비하고 있습니다.<br />새로운 글로 곧 찾아뵙겠습니다.</div>}
  </main></div></section>;
}
