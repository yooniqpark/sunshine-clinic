"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/** 방문 통계 전체 초기화 — 모든 PageView 기록 삭제 후 0부터 다시 집계 */
export async function resetStats() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.pageView.deleteMany({});
  revalidatePath("/admin/analytics");
}
