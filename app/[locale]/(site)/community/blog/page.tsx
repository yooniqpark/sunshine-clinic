import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "./BlogList";
import { BLOG_POSTS } from "@/lib/blog";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.blog" });
  return pageSeo({ locale, path: "/community/blog", title: t("title"), description: t("desc") });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2.blog");

  return (
    <>
      <section className="bg-ink py-24 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[10px] font-bold tracking-[0.35em] text-brand-soft">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-title text-4xl leading-tight lg:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/60 lg:text-base">
            {t("desc")}
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <BlogList posts={BLOG_POSTS} allLabel={t("all")} readLabel={t.raw("readMin") as string} />
        </div>
      </section>
    </>
  );
}
