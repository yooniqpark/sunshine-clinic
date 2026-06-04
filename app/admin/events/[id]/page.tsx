import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../EventForm";
import { updateEvent, deleteEvent, togglePublished } from "../actions";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!event) notFound();

  const update = updateEvent.bind(null, id);
  const remove = deleteEvent.bind(null, id);

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href="/admin/events" className="hover:text-brand">
              이벤트
            </Link>
            <span>/</span>
            <span className="text-ink">{event.title}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{event.title}</h1>
          <p className="mt-2 text-xs text-ink-soft">
            마지막 수정: {event.updatedAt.toLocaleString("ko-KR")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/events/${event.id}/preview`}
            target="_blank"
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
          >
            프리뷰 (새 탭)
          </Link>
          <form
            action={async () => {
              "use server";
              await togglePublished(event.id, !event.published);
            }}
          >
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                event.published
                  ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}
            >
              {event.published ? "비공개로 전환" : "지금 배포"}
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await remove();
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              삭제
            </button>
          </form>
        </div>
      </header>

      <div className="mt-8">
        <EventForm
          action={update}
          defaults={{
            id: event.id,
            slug: event.slug,
            tag: event.tag,
            title: event.title,
            period: event.period,
            startsAt: event.startsAt ? event.startsAt.toISOString().slice(0, 10) : null,
            endsAt: event.endsAt ? event.endsAt.toISOString().slice(0, 10) : null,
            desc: event.desc,
            body: event.body,
            bgColor: event.bgColor,
            photoUrl: event.photoUrl,
            bannerUrl: event.bannerUrl,
            bannerFocus:
              event.bannerFocus === "top" || event.bannerFocus === "bottom"
                ? event.bannerFocus
                : "center",
            imageUrl: event.imageUrl,
            published: event.published,
            sortIndex: event.sortIndex,
            translations: event.translations
              .filter((t) => t.locale === "en" || t.locale === "ja" || t.locale === "zh")
              .map((t) => ({
                locale: t.locale as "en" | "ja" | "zh",
                title: t.title,
                desc: t.desc,
                body: t.body,
              })),
          }}
          submitLabel="저장"
        />
      </div>
    </>
  );
}
