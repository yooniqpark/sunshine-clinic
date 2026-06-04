"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPeriod } from "@/lib/period";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "events");
const PUBLIC_PREFIX = "/uploads/events";

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return session.user as { id?: string; role?: string; email?: string };
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[\s_/]+/g, "-")
      .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `event-${Date.now()}`
  );
}

async function savePhoto(file: File | null | undefined): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
  if (file.size > 8 * 1024 * 1024) throw new Error("이미지 크기는 8MB 이하만 가능합니다.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext || "png"}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buf);
  return `${PUBLIC_PREFIX}/${filename}`;
}

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true" || v === "1";
}

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

function num(v: FormDataEntryValue | null) {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : 0;
}

function date(v: FormDataEntryValue | null): Date | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildPeriod(formData: FormData, startsAt: Date | null, endsAt: Date | null) {
  const override = str(formData.get("periodOverride"));
  if (override) return override;
  // legacy fallback if older clients send "period"
  const legacy = str(formData.get("period"));
  if (legacy) return legacy;
  return formatPeriod(startsAt, endsAt);
}

function focus(v: FormDataEntryValue | null): "top" | "center" | "bottom" {
  const s = str(v);
  if (s === "top" || s === "bottom") return s;
  return "center";
}

const TRANSLATION_LOCALES = ["en", "ja", "zh"] as const;
type TLocale = (typeof TRANSLATION_LOCALES)[number];

/** Read per-locale fields from FormData. Returns rows where at least one of title/desc/body is filled. */
function collectTranslations(formData: FormData) {
  return TRANSLATION_LOCALES.flatMap((locale) => {
    const title = str(formData.get(`title_${locale}`));
    const desc = str(formData.get(`desc_${locale}`));
    const body = str(formData.get(`body_${locale}`));
    if (!title && !desc && !body) return [];
    return [{ locale, title, desc, body }] as Array<{
      locale: TLocale;
      title: string;
      desc: string;
      body: string;
    }>;
  });
}

export async function createEvent(formData: FormData) {
  const user = await requireUser();
  const title = str(formData.get("title"));
  if (!title) throw new Error("제목은 필수입니다.");

  const slugInput = str(formData.get("slug"));
  const slug = slugInput || slugify(title);

  const photoFile = formData.get("photo") as File | null;
  const photoUrl = (await savePhoto(photoFile)) ?? "/models/lifting.png";

  const bannerFile = formData.get("banner") as File | null;
  const bannerUrl = await savePhoto(bannerFile);

  const startsAt = date(formData.get("startsAt"));
  const endsAt = date(formData.get("endsAt"));
  const period = buildPeriod(formData, startsAt, endsAt);

  const translations = collectTranslations(formData);
  const event = await prisma.event.create({
    data: {
      slug,
      title,
      tag: str(formData.get("tag")) || "EVENT",
      period,
      startsAt,
      endsAt,
      desc: str(formData.get("desc")),
      body: str(formData.get("body")),
      bgColor: str(formData.get("bgColor")) || "#ede7e2",
      photoUrl,
      bannerUrl,
      bannerFocus: focus(formData.get("bannerFocus")),
      imageUrl: str(formData.get("imageUrl")) || null,
      published: bool(formData.get("published")),
      sortIndex: num(formData.get("sortIndex")),
      authorId: user.id,
      translations: translations.length
        ? { create: translations.map((t) => ({ locale: t.locale, title: t.title, desc: t.desc, body: t.body })) }
        : undefined,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/community/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  await requireUser();
  const title = str(formData.get("title"));
  if (!title) throw new Error("제목은 필수입니다.");

  const photoFile = formData.get("photo") as File | null;
  const newPhoto = await savePhoto(photoFile);

  const bannerFile = formData.get("banner") as File | null;
  const newBanner = await savePhoto(bannerFile);
  const clearBanner = bool(formData.get("clearBanner"));

  const startsAt = date(formData.get("startsAt"));
  const endsAt = date(formData.get("endsAt"));
  const period = buildPeriod(formData, startsAt, endsAt);

  const translations = collectTranslations(formData);
  await prisma.$transaction(async (tx) => {
    await tx.event.update({
      where: { id },
      data: {
        title,
        slug: str(formData.get("slug")) || slugify(title),
        tag: str(formData.get("tag")) || "EVENT",
        period,
        startsAt,
        endsAt,
        desc: str(formData.get("desc")),
        body: str(formData.get("body")),
        bgColor: str(formData.get("bgColor")) || "#ede7e2",
        bannerFocus: focus(formData.get("bannerFocus")),
        imageUrl: str(formData.get("imageUrl")) || null,
        published: bool(formData.get("published")),
        sortIndex: num(formData.get("sortIndex")),
        ...(newPhoto ? { photoUrl: newPhoto } : {}),
        ...(newBanner ? { bannerUrl: newBanner } : clearBanner ? { bannerUrl: null } : {}),
      },
    });
    // Upsert each provided translation; delete any whose fields were cleared.
    for (const locale of TRANSLATION_LOCALES) {
      const match = translations.find((t) => t.locale === locale);
      if (match) {
        await tx.eventTranslation.upsert({
          where: { eventId_locale: { eventId: id, locale } },
          create: { eventId: id, locale, title: match.title, desc: match.desc, body: match.body },
          update: { title: match.title, desc: match.desc, body: match.body },
        });
      } else {
        await tx.eventTranslation
          .delete({ where: { eventId_locale: { eventId: id, locale } } })
          .catch(() => undefined);
      }
    }
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/");
  revalidatePath("/community/events");
}

export async function deleteEvent(id: string) {
  await requireUser();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/community/events");
  redirect("/admin/events");
}

export async function togglePublished(id: string, published: boolean) {
  await requireUser();
  await prisma.event.update({ where: { id }, data: { published } });
  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/community/events");
}
