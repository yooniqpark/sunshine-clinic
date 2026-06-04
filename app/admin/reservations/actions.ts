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

const ALLOWED_STATUS = new Set([
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "CANCELED",
  "COMPLETED",
]);

export async function setStatus(id: string, status: string) {
  const user = await requireUser();
  if (!ALLOWED_STATUS.has(status)) throw new Error("잘못된 상태입니다.");
  await prisma.reservation.update({
    where: { id },
    data: { status, handlerId: user.id ?? null },
  });
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin");
}

export async function saveNote(id: string, formData: FormData) {
  await requireUser();
  await prisma.reservation.update({
    where: { id },
    data: { internalNote: str(formData.get("note")) || null },
  });
  revalidatePath(`/admin/reservations/${id}`);
}

export async function deleteReservation(id: string) {
  await requireUser();
  await prisma.reservation.delete({ where: { id } });
  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  redirect("/admin/reservations");
}
