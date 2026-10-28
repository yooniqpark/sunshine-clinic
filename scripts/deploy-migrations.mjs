import { PrismaClient } from "@prisma/client";
import { spawnSync } from "node:child_process";
import path from "node:path";

// Sunshine historically used `prisma db push`, so existing production DBs have
// the tables but no _prisma_migrations history. Baseline only that legacy case;
// fresh databases still run every migration normally.
const LEGACY_MIGRATIONS = [
  "20260601052301_init",
  "20260601062223_add_banner_url",
  "20260601070920_add_banner_focus",
  "20260601082130_add_manual_section",
  "20260602050432_add_reservation",
  "20260602061144_add_translations",
];

const prisma = new PrismaClient();

async function tableNames() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    );
    return rows.map((row) => row.name);
  } finally {
    await prisma.$disconnect();
  }
}

function runPrisma(args) {
  const prismaCli = path.resolve("node_modules/prisma/build/index.js");
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const tables = await tableNames();
const hasHistory = tables.includes("_prisma_migrations");
const appTables = tables.filter((name) => name !== "_prisma_migrations");

if (!hasHistory && appTables.length > 0) {
  console.log("Legacy db-push database detected; recording migration baseline.");
  for (const migration of LEGACY_MIGRATIONS) {
    runPrisma(["migrate", "resolve", "--applied", migration, "--schema=./prisma"]);
  }
}

runPrisma(["migrate", "deploy", "--schema=./prisma"]);
