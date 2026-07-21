import { prisma } from "@/lib/prisma";

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysAgo(n: number) {
  const d = startOfDay();
  d.setDate(d.getDate() - n);
  return d;
}
function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export type AnalyticsStats = {
  pv: { today: number; week: number; month: number; total: number };
  uv: { today: number; week: number; month: number; total: number };
  daily14: { day: string; count: number }[];
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  byLocale: { locale: string; count: number }[];
  byDevice: { device: string; count: number }[];
};

async function countPV(fromDate?: Date) {
  return prisma.pageView.count({
    where: fromDate ? { createdAt: { gte: fromDate } } : {},
  });
}
async function countUV(fromDate?: Date) {
  const rows = await prisma.pageView.findMany({
    where: {
      ...(fromDate ? { createdAt: { gte: fromDate } } : {}),
      visitorId: { not: null },
    },
    select: { visitorId: true },
    distinct: ["visitorId"],
  });
  return rows.length;
}

export async function getStats(): Promise<AnalyticsStats> {
  const dayStart = startOfDay();
  const weekStart = daysAgo(6); // include today = 7 days
  const monthStart = startOfMonth();

  const [pvToday, pvWeek, pvMonth, pvTotal, uvToday, uvWeek, uvMonth, uvTotal] =
    await Promise.all([
      countPV(dayStart),
      countPV(weekStart),
      countPV(monthStart),
      countPV(),
      countUV(dayStart),
      countUV(weekStart),
      countUV(monthStart),
      countUV(),
    ]);

  // Daily buckets for the last 14 days
  const start14 = daysAgo(13);
  const dailyRows = await prisma.pageView.findMany({
    where: { createdAt: { gte: start14 } },
    select: { createdAt: true },
  });
  const dailyMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = daysAgo(13 - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }
  for (const r of dailyRows) {
    const key = r.createdAt.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const daily14 = [...dailyMap.entries()].map(([day, count]) => ({ day, count }));

  // Top paths this month
  const topPathsRaw = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: monthStart } },
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: 8,
  });
  const topPaths = topPathsRaw.map((r) => ({ path: r.path, count: r._count._all }));

  // Top referrers this month
  const topRefRaw = await prisma.pageView.groupBy({
    by: ["referrer"],
    where: { createdAt: { gte: monthStart }, referrer: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { referrer: "desc" } },
    take: 8,
  });
  const topReferrers = topRefRaw
    .filter((r) => r.referrer)
    .map((r) => ({ referrer: r.referrer as string, count: r._count._all }));

  // By locale
  const byLocaleRaw = await prisma.pageView.groupBy({
    by: ["locale"],
    where: { createdAt: { gte: monthStart }, locale: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { locale: "desc" } },
  });
  const byLocale = byLocaleRaw
    .filter((r) => r.locale)
    .map((r) => ({ locale: r.locale as string, count: r._count._all }));

  // By device type
  const byDeviceRaw = await prisma.pageView.groupBy({
    by: ["deviceType"],
    where: { createdAt: { gte: monthStart }, deviceType: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { deviceType: "desc" } },
  });
  const byDevice = byDeviceRaw
    .filter((r) => r.deviceType)
    .map((r) => ({ device: r.deviceType as string, count: r._count._all }));

  return {
    pv: { today: pvToday, week: pvWeek, month: pvMonth, total: pvTotal },
    uv: { today: uvToday, week: uvWeek, month: uvMonth, total: uvTotal },
    daily14,
    topPaths,
    topReferrers,
    byLocale,
    byDevice,
  };
}
