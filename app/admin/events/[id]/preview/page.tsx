import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { togglePublished } from "../../actions";
import { ArrowIcon } from "@/components/icons";

export default async function EventPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await prisma.event.findUnique({ where: { id } });
  if (!e) notFound();

  const body = e.body.split(/\n{2,}/).filter(Boolean);
  const hasBanner = !!e.bannerUrl;

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href="/admin/events" className="hover:text-brand">
              이벤트
            </Link>
            <span>/</span>
            <Link href={`/admin/events/${e.id}`} className="hover:text-brand">
              {e.title}
            </Link>
            <span>/</span>
            <span className="text-ink">프리뷰</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">프리뷰</h1>
          <p className="mt-2 text-xs text-ink-soft">
            현재 상태:{" "}
            <span className={e.published ? "text-emerald-700" : "text-ink-soft"}>
              {e.published ? "게시 중" : "초안"}
            </span>{" "}
            · 슬라이더 레이아웃: <span className="font-semibold">{hasBanner ? "풀블리드" : "split (세로 사진)"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/events/${e.id}`}
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
          >
            수정으로
          </Link>
          <form
            action={async () => {
              "use server";
              await togglePublished(e.id, !e.published);
            }}
          >
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                e.published
                  ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}
            >
              {e.published ? "비공개로 전환" : "지금 배포"}
            </button>
          </form>
        </div>
      </header>

      {/* hero slider mock */}
      <section className="mt-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-brand">HERO SLIDER</p>
        <div
          className="relative h-[420px] overflow-hidden rounded-2xl"
          style={hasBanner ? undefined : { backgroundColor: e.bgColor }}
        >
          {hasBanner ? (
            <>
              <Image
                src={e.bannerUrl!}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/10" />
              <div className="absolute inset-0 flex items-center px-10">
                <div className="max-w-xl text-cream">
                  <span className="text-xs font-semibold tracking-[0.25em] text-brand-soft">
                    EVENT · {e.tag}
                  </span>
                  <p className="mt-3 text-sm text-cream/80">{e.period}</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {e.title}
                  </h2>
                  <p className="mt-3 text-sm text-cream/85">{e.desc}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="relative grid h-full grid-cols-2 items-center gap-6 px-10">
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] text-brand-dark">
                  EVENT · {e.tag}
                </span>
                <p className="mt-3 text-sm text-ink/65">{e.period}</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {e.title}
                </h2>
                <p className="mt-3 text-sm text-ink/75">{e.desc}</p>
              </div>
              <div
                className="relative h-[85%] overflow-hidden rounded-2xl"
                style={{ backgroundColor: e.bgColor }}
              >
                {e.photoUrl && (
                  <Image
                    src={e.photoUrl}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover object-top"
                    style={{ objectPosition: "center 18%" }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* home event card mock */}
      <section className="mt-12">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-brand">HOME EVENT CARD</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`relative aspect-[3/4] overflow-hidden rounded-3xl ${
                n === 1 ? "" : "opacity-30"
              }`}
              style={{ backgroundColor: e.bgColor }}
            >
              {e.photoUrl && (
                <Image
                  src={e.photoUrl}
                  alt=""
                  fill
                  sizes="33vw"
                  className="object-cover object-top"
                />
              )}
              <div
                className="absolute inset-x-0 bottom-0 h-3/5"
                style={{
                  background: `linear-gradient(to top, ${e.bgColor} 22%, ${e.bgColor}d9 46%, transparent)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-dark">
                  {e.tag}
                </span>
                <p className="mt-2 text-xs font-medium text-ink/70">{e.period}</p>
                <h3 className="mt-1 text-lg font-bold text-ink">{e.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/75">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-soft">※ 가운데 카드만 이 이벤트, 양옆은 위치 감을 보여주기 위한 더미입니다.</p>
      </section>

      {/* event detail body mock */}
      <section className="mt-12">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-brand">DETAIL BODY</p>
        <article className="overflow-hidden rounded-3xl border border-line bg-white p-7 lg:p-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-dark">
            {e.tag}
          </p>
          <h2 className="mt-2 text-2xl font-bold lg:text-3xl">{e.title}</h2>
          <p className="mt-1 text-xs text-ink-soft">{e.period}</p>
          <div className="mt-6 space-y-2.5 text-sm leading-relaxed text-ink-soft">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
        <Link
          href={`/admin/events/${e.id}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline"
        >
          내용 수정하기 <ArrowIcon className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}
