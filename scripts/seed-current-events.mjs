import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const sourcePath = path.join(process.cwd(), "prisma", "current-events.json");

async function main() {
  const rows = JSON.parse(await readFile(sourcePath, "utf8"));
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  for (const row of rows) {
    const exists = await prisma.event.findUnique({
      where: { slug: row.slug },
      select: { id: true },
    });
    if (exists) {
      console.log(`↷ current event kept: ${row.slug}`);
      continue;
    }

    const { translations, startsAt, endsAt, ...event } = row;
    await prisma.event.create({
      data: {
        ...event,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        authorId: admin?.id,
        translations: {
          create: translations,
        },
      },
    });
    console.log(`✓ current event imported: ${row.slug}`);
  }
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
