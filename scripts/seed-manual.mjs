/**
 * 서버 배포 시 챗봇 매뉴얼(ManualSection)을 prisma/manual-sections.json 내용으로
 * 갱신한다. 제목 기준 upsert — 재실행해도 안전 (idempotent).
 *
 * Run with: node scripts/seed-manual.mjs  (앱 루트에서, @prisma/client 필요)
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "admin@sunshine.local";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sections = JSON.parse(
  readFileSync(join(__dirname, "..", "prisma", "manual-sections.json"), "utf8"),
);

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const existing = await prisma.manualSection.findFirst({ where: { title: s.title } });
    if (existing) {
      await prisma.manualSection.update({
        where: { id: existing.id },
        data: {
          body: s.body,
          sortIndex: i + 1,
          published: true,
          authorId: admin?.id ?? null,
        },
      });
    } else {
      await prisma.manualSection.create({
        data: {
          title: s.title,
          body: s.body,
          sortIndex: i + 1,
          published: true,
          authorId: admin?.id ?? null,
        },
      });
    }
    console.log(`✓ ${s.title}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
