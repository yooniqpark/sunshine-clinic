"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return session.user as { id?: string };
}

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}
function num(v: FormDataEntryValue | null) {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : 0;
}
function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true" || v === "1";
}

const TRANSLATION_LOCALES = ["en", "ja", "zh"] as const;
type TLocale = (typeof TRANSLATION_LOCALES)[number];

function collectTranslations(formData: FormData) {
  return TRANSLATION_LOCALES.flatMap((locale) => {
    const title = str(formData.get(`title_${locale}`));
    const body = str(formData.get(`body_${locale}`));
    if (!title && !body) return [];
    return [{ locale, title, body }] as Array<{
      locale: TLocale;
      title: string;
      body: string;
    }>;
  });
}

export async function createSection(formData: FormData) {
  const user = await requireUser();
  const title = str(formData.get("title"));
  const body = str(formData.get("body"));
  if (!title || !body) throw new Error("제목과 본문은 필수입니다.");

  const last = await prisma.manualSection.findFirst({
    orderBy: { sortIndex: "desc" },
    select: { sortIndex: true },
  });
  const next = (last?.sortIndex ?? 0) + 1;

  const translations = collectTranslations(formData);
  const created = await prisma.manualSection.create({
    data: {
      title,
      body,
      sortIndex: num(formData.get("sortIndex")) || next,
      published: bool(formData.get("published")),
      authorId: user.id ?? null,
      translations: translations.length
        ? { create: translations.map((t) => ({ locale: t.locale, title: t.title, body: t.body })) }
        : undefined,
    },
  });

  revalidatePath("/admin/manual");
  redirect(`/admin/manual/${created.id}`);
}

export async function updateSection(id: string, formData: FormData) {
  await requireUser();
  const title = str(formData.get("title"));
  const body = str(formData.get("body"));
  if (!title || !body) throw new Error("제목과 본문은 필수입니다.");

  const translations = collectTranslations(formData);
  await prisma.$transaction(async (tx) => {
    await tx.manualSection.update({
      where: { id },
      data: {
        title,
        body,
        sortIndex: num(formData.get("sortIndex")),
        published: bool(formData.get("published")),
      },
    });
    for (const locale of TRANSLATION_LOCALES) {
      const match = translations.find((t) => t.locale === locale);
      if (match) {
        await tx.manualSectionTranslation.upsert({
          where: { sectionId_locale: { sectionId: id, locale } },
          create: { sectionId: id, locale, title: match.title, body: match.body },
          update: { title: match.title, body: match.body },
        });
      } else {
        await tx.manualSectionTranslation
          .delete({ where: { sectionId_locale: { sectionId: id, locale } } })
          .catch(() => undefined);
      }
    }
  });

  revalidatePath("/admin/manual");
  revalidatePath(`/admin/manual/${id}`);
}

export async function deleteSection(id: string) {
  await requireUser();
  await prisma.manualSection.delete({ where: { id } });
  revalidatePath("/admin/manual");
  redirect("/admin/manual");
}

export async function togglePublished(id: string, published: boolean) {
  await requireUser();
  await prisma.manualSection.update({ where: { id }, data: { published } });
  revalidatePath("/admin/manual");
}

export async function moveSection(id: string, direction: "up" | "down") {
  await requireUser();
  const all = await prisma.manualSection.findMany({
    orderBy: [{ sortIndex: "asc" }, { createdAt: "asc" }],
  });
  const idx = all.findIndex((s) => s.id === id);
  if (idx < 0) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= all.length) return;
  const a = all[idx];
  const b = all[swapWith];
  await prisma.$transaction([
    prisma.manualSection.update({ where: { id: a.id }, data: { sortIndex: b.sortIndex } }),
    prisma.manualSection.update({ where: { id: b.id }, data: { sortIndex: a.sortIndex } }),
  ]);
  revalidatePath("/admin/manual");
}
