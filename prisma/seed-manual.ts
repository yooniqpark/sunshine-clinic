/**
 * Migrate the hardcoded clinic manual into ManualSection rows so it can be edited
 * from the admin UI. Idempotent — re-running upserts by exact title.
 *
 * Run with: npx tsx prisma/seed-manual.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? clinicConfig.adminEmail;

import sectionsJson from "./manual-sections.json";
import { clinicConfig } from "../clinic.config";

const sections: { title: string; body: string }[] = sectionsJson;

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
