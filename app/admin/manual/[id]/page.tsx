import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ManualForm } from "../ManualForm";
import { updateSection, deleteSection, togglePublished } from "../actions";

export default async function EditManualSection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await prisma.manualSection.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!s) notFound();

  const update = updateSection.bind(null, id);
  const remove = deleteSection.bind(null, id);

  return (
    <>
      <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs text-ink-soft">
            <Link href="/admin/manual" className="hover:text-brand">
              매뉴얼
            </Link>
            <span>/</span>
            <span className="text-ink">{s.title}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{s.title}</h1>
          <p className="mt-2 text-xs text-ink-soft">
            마지막 수정: {s.updatedAt.toLocaleString("ko-KR")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form
            action={async () => {
              "use server";
              await togglePublished(s.id, !s.published);
            }}
          >
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                s.published
                  ? "border border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}
            >
              {s.published ? "사용 중지" : "사용 시작"}
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
        <ManualForm
          action={update}
          defaults={{
            title: s.title,
            body: s.body,
            sortIndex: s.sortIndex,
            published: s.published,
            translations: s.translations
              .filter((t) => t.locale === "en" || t.locale === "ja" || t.locale === "zh")
              .map((t) => ({
                locale: t.locale as "en" | "ja" | "zh",
                title: t.title,
                body: t.body,
              })),
          }}
          submitLabel="저장"
        />
      </div>
    </>
  );
}
