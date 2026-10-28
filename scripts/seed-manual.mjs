/**
 * 서버 배포 시 prisma/manual-sections.json 에 있지만 DB에 없는 챗봇 매뉴얼
 * 섹션만 추가한다 (제목 기준). 이미 있는 섹션은 관리자가 고쳤을 수 있으므로
 * 건드리지 않는다. 재실행해도 안전.
 *
 * Run with: node scripts/seed-manual.mjs  (앱 루트에서, @prisma/client 필요)
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@sunshine.local";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sections = JSON.parse(
  readFileSync(join(__dirname, "..", "prisma", "manual-sections.json"), "utf8"),
);

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const existing = await prisma.manualSection.findFirst({ where: { title: s.title } });
    if (existing) continue;
    await prisma.manualSection.create({
      data: {
        title: s.title,
        body: s.body,
        sortIndex: i + 1,
        published: true,
        authorId: admin?.id ?? null,
      },
    });
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
