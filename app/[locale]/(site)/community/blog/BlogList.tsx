"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRightIcon } from "@/components/icons";
import { BLOG_CATEGORIES, categoryOf, type BlogCategory, type BlogPost } from "@/lib/blog";

export function BlogList({
  posts,
  allLabel,
  readLabel,
}: {
  posts: BlogPost[];
  allLabel: string;
  /** "{min}분 읽기" 형태 — {min}을 숫자로 바꾼다 */
  readLabel: string;
}) {
  const [cat, setCat] = useState<BlogCategory | "all">("all");
  const filtered = cat === "all" ? posts : posts.filter((p) => p.category === cat);
  const [featured, ...rest] = filtered;
  const read = (m: number) => readLabel.replace("{min}", String(m));

  const chips: { key: BlogCategory | "all"; label: string }[] = [
    { key: "all", label: allLabel },
    ...BLOG_CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  return (
    <>
      {/* 카테고리 — 얇은 밑줄 탭 */}
      <nav
        aria-label="블로그 카테고리"
        className="-mx-5 flex gap-7 overflow-x-auto border-b border-ink/10 px-5 lg:mx-0 lg:px-0"
      >
        {chips.map((c) => {
          const on = c.key === cat;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key)}
              aria-pressed={on}
              className={`relative shrink-0 whitespace-nowrap pb-4 text-sm transition ${
                on ? "font-semibold text-ink" : "text-ink/45 hover:text-ink"
              }`}
            >
              {c.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-[2px] bg-brand-dark transition-transform duration-300 ${
                  on ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {!featured ? (
        <p className="py-24 text-center text-sm text-ink-soft">No posts.</p>
      ) : (
        <>
          {/* 대표 글 — 큰 가로 카드 */}
          <Link
            href={`/community/blog/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-3xl border border-ink/10 bg-white transition hover:shadow-xl hover:shadow-ink/5 lg:mt-14 lg:grid-cols-12"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={featured.cover}
                alt={featured.coverAlt}
                fill
                priority
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-between gap-10 p-7 lg:col-span-5 lg:p-12">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.28em] text-brand-dark">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-brand-dark" />
                  {categoryOf(featured.category).en}
                </p>
                <h2 className="mt-5 font-serif text-2xl leading-snug tracking-tight text-ink lg:text-[2rem]">
                  {featured.title}
                </h2>
                <p className="mt-5 text-[15px] leading-[1.85] text-ink/60">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-6 text-xs text-ink/45">
                <span className="font-serif tabular-nums">
                  {featured.date} · {read(featured.readMin)}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink/60 transition group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
                  <ArrowUpRightIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* 나머지 글 — 3열 카드 */}
          {rest.length > 0 && (
            <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} readText={read(p.readMin)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

export function BlogCard({ post, readText }: { post: BlogPost; readText: string }) {
  return (
    <Link href={`/community/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
        <Image
          src={post.cover}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-6 text-[10px] font-medium tracking-[0.28em] text-brand-dark">
        {categoryOf(post.category).en}
      </p>
      <h3 className="mt-3 font-serif text-xl leading-snug tracking-tight text-ink/85 transition group-hover:text-ink lg:text-[1.4rem]">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/50">{post.excerpt}</p>
      <p className="mt-5 font-serif text-xs tabular-nums text-ink/40">
        {post.date} · {readText}
      </p>
    </Link>
  );
}
