import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRightIcon } from "@/components/icons";
import { BlogCard } from "../BlogList";
import { BLOG_DISCLAIMER, BLOG_POSTS, categoryOf, getPost, type BlogBlock } from "@/lib/blog";
import { pageSeo, truncateDescription } from "@/lib/seo";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageSeo({
    locale,
    path: `/community/blog/${slug}`,
    title: post.title,
    description: truncateDescription(post.excerpt),
    ogImage: post.cover,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const t = await getTranslations("v2.blog");
  const read = (min: number) => t("readMin", { min });

  const headings = post.body.filter((b): b is Extract<BlogBlock, { type: "h2" }> => b.type === "h2");
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const cat = categoryOf(post.category);
  // 본문 블록 순서 → 소제목 번호 (목차 앵커와 맞춘다)
  const h2Number = new Map<number, number>();
  post.body.forEach((b, i) => {
    if (b.type === "h2") h2Number.set(i, h2Number.size + 1);
  });

  return (
    <>
      {/* 헤더 — 투명 헤더 바가 읽히도록 다른 커뮤니티 페이지처럼 어두운 띠로 시작한다 */}
      <section className="bg-ink pb-28 pt-32 text-cream lg:pb-40 lg:pt-44">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Link
            href="/community/blog"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.24em] text-cream/50 transition hover:text-cream"
          >
            <span aria-hidden>←</span> {t("back")}
          </Link>
          <p className="mt-10 flex items-center gap-2 text-[10px] font-medium tracking-[0.3em] text-brand-soft">
            <span aria-hidden className="h-1 w-1 rounded-full bg-brand-soft" />
            {cat.en} · {cat.label}
          </p>
          <h1 className="mt-5 max-w-3xl font-title text-[2rem] leading-[1.3] text-cream lg:text-5xl lg:leading-[1.25]">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-cream/60 lg:text-base">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream/15 pt-6 font-serif text-xs tabular-nums text-cream/50">
            <span>{post.date}</span>
            <span aria-hidden className="h-3 w-px bg-cream/20" />
            <span>{read(post.readMin)}</span>
            <span aria-hidden className="h-3 w-px bg-cream/20" />
            <span>{t("author")}</span>
          </div>
        </div>
      </section>

      {/* 커버 — 어두운 띠와 크림 본문에 걸쳐 놓는다 */}
      <section className="bg-cream">
        <div className="mx-auto -mt-20 max-w-6xl px-5 lg:-mt-28 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-sand lg:aspect-[21/9]">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              priority
              sizes="(min-width: 1280px) 1150px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 본문 — 데스크톱은 왼쪽에 목차를 고정 */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-[180px_1fr] lg:gap-16 lg:px-8">
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <nav aria-label={t("contents")} className="sticky top-36">
                <p className="text-[10px] font-medium tracking-[0.32em] text-ink/35">
                  {t("contents").toUpperCase()}
                </p>
                <ol className="mt-5 space-y-3 border-l border-ink/10">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#s${i + 1}`}
                        className="-ml-px block border-l border-transparent pl-4 text-[13px] leading-snug text-ink/50 transition hover:border-brand-dark hover:text-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <article className="min-w-0 max-w-2xl">
            <div className="space-y-6 text-[16px] leading-[1.95] text-ink/75">
              {post.body.map((b, i) => {
                switch (b.type) {
                  case "p":
                    return <p key={i}>{b.text}</p>;
                  case "h2": {
                    const n = h2Number.get(i)!;
                    return (
                      <h2
                        key={i}
                        id={`s${n}`}
                        className="scroll-mt-32 pt-8 font-serif text-[1.5rem] leading-snug tracking-tight text-ink lg:text-[1.75rem]"
                      >
                        <span className="mr-3 font-serif text-base text-brand-dark tabular-nums">
                          {String(n).padStart(2, "0")}
                        </span>
                        {b.text}
                      </h2>
                    );
                  }
                  case "list":
                    return (
                      <ul key={i} className="space-y-3">
                        {b.items.map((it, j) => (
                          <li key={j} className="relative pl-6">
                            <span
                              aria-hidden
                              className="absolute left-0 top-[0.85em] h-px w-3 bg-brand-dark"
                            />
                            {it}
                          </li>
                        ))}
                      </ul>
                    );
                  case "point":
                    return (
                      <aside key={i} className="rounded-2xl bg-sand/70 px-6 py-6 lg:px-8 lg:py-7">
                        <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-dark">
                          POINT
                        </p>
                        <p className="mt-2 font-semibold text-ink">{b.title}</p>
                        <p className="mt-2 text-[15px] leading-[1.85] text-ink/70">{b.text}</p>
                      </aside>
                    );
                  case "quote":
                    return (
                      <blockquote
                        key={i}
                        className="border-l-2 border-brand-dark py-1 pl-6 font-serif text-xl leading-relaxed text-ink lg:text-[1.4rem]"
                      >
                        {b.text}
                      </blockquote>
                    );
                }
              })}
            </div>

            {/* 의료광고 기준 — 모든 글 끝에 고지 */}
            <p className="mt-14 rounded-2xl border border-ink/10 bg-white px-6 py-5 text-xs leading-relaxed text-ink/45">
              {BLOG_DISCLAIMER}
            </p>

            {post.related && (
              <Link
                href={post.related.href}
                className="group mt-6 flex items-center justify-between rounded-2xl border border-ink/15 px-6 py-5 transition hover:border-ink hover:bg-white"
              >
                <span>
                  <span className="block text-[10px] font-medium tracking-[0.28em] text-ink/40">
                    {t("related")}
                  </span>
                  <span className="mt-1 block font-semibold text-ink">{post.related.label}</span>
                </span>
                <ArrowUpRightIcon className="h-5 w-5 text-ink/40 transition group-hover:text-ink" />
              </Link>
            )}
          </article>
        </div>
      </section>

      {/* 상담 안내 */}
      <section className="bg-ink py-16 text-cream lg:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">CONSULTATION</p>
            <p className="mt-4 font-title text-2xl leading-snug lg:text-4xl">{t("ctaTitle")}</p>
            <p className="mt-3 text-sm text-cream/55">{t("ctaDesc")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:024217588"
              className="inline-flex items-center rounded-full bg-cream px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-ink transition hover:bg-brand-soft"
            >
              02-421-7588
            </a>
            <a
              href="https://pf.kakao.com/_xoVzwX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-cream transition hover:border-cream hover:bg-cream/10"
            >
              KakaoTalk
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 다른 글 */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-end justify-between border-b border-ink/10 pb-6">
            <h2 className="font-serif text-2xl text-ink lg:text-3xl">{t("more")}</h2>
            <Link
              href="/community/blog"
              className="text-[11px] font-medium tracking-[0.24em] text-ink/45 transition hover:text-ink"
            >
              {t("viewAll")} →
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} readText={read(p.readMin)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
