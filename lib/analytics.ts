import { prisma } from "@/lib/prisma";
import { getDevicesByCategory } from "@/lib/devices";

/* ────────────────────────────────────────────────────────────
   방문 통계 집계 — 모든 날짜 경계·시간대는 한국시간(KST) 기준.
   서버가 UTC여도 "오늘/이번 주/이번 달"이 한국 자정에 맞춰진다.
   ──────────────────────────────────────────────────────────── */

const KST = 9 * 3600 * 1000;

function kstParts(now = Date.now()) {
  const k = new Date(now + KST);
  return { y: k.getUTCFullYear(), m: k.getUTCMonth(), d: k.getUTCDate() };
}
/** KST 기준 n일 전 자정(00:00)의 UTC Date */
function startOfDayKST(offsetDays = 0) {
  const { y, m, d } = kstParts();
  return new Date(Date.UTC(y, m, d - offsetDays) - KST);
}
function startOfMonthKST() {
  const { y, m } = kstParts();
  return new Date(Date.UTC(y, m, 1) - KST);
}
/** UTC Date → KST 'YYYY-MM-DD' 키 */
function kstDayKey(dt: Date) {
  return new Date(dt.getTime() + KST).toISOString().slice(0, 10);
}

export type AnalyticsStats = {
  pv: { today: number; week: number; month: number; total: number };
  uv: { today: number; week: number; month: number; total: number };
  yesterday: { pv: number; uv: number };
  pagesPerVisitor: number; // 이번 달 PV/UV
  daily30: { day: string; pv: number; uv: number }[];
  hourly7: number[]; // 24칸, 최근 7일 KST 시간대별 PV
  weekday28: { label: string; count: number }[]; // 최근 28일 요일별 PV
  sources: { label: string; count: number }[]; // 이번 달 유입 분류 (직접 방문 포함)
  topTreatments: { name: string; count: number }[]; // 이번 달 시술 페이지 랭킹
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  byLocale: { locale: string; count: number }[];
  byDevice: { device: string; count: number }[];
  todayReferrers: { referrer: string; count: number }[];
  todayUtm: { source: string; medium: string | null; count: number }[];
};

async function countPV(fromDate?: Date, toDate?: Date) {
  return prisma.pageView.count({
    where: {
      ...(fromDate ? { createdAt: { gte: fromDate, ...(toDate ? { lt: toDate } : {}) } } : {}),
    },
  });
}
async function countUV(fromDate?: Date, toDate?: Date) {
  const rows = await prisma.pageView.findMany({
    where: {
      ...(fromDate ? { createdAt: { gte: fromDate, ...(toDate ? { lt: toDate } : {}) } } : {}),
      visitorId: { not: null },
    },
    select: { visitorId: true },
    distinct: ["visitorId"],
  });
  return rows.length;
}

/** referrer origin → 사람이 읽는 유입 분류 */
function classifySource(origin: string | null): string | null {
  if (!origin) return "직접 방문";
  const h = origin.toLowerCase();
  if (h.includes("mysunshineclinic")) return null; // 내부 이동은 유입에서 제외
  if (h.includes("naver")) return "네이버";
  if (h.includes("google")) return "구글";
  if (h.includes("daum") || h.includes("kakao")) return "다음·카카오";
  if (h.includes("instagram")) return "인스타그램";
  if (h.includes("youtube")) return "유튜브";
  if (h.includes("facebook") || h.includes("fb.com")) return "페이스북";
  if (h.includes("bing")) return "빙";
  return "기타";
}

const CATEGORY_LABEL: Record<string, string> = {
  lifting: "리프팅 (목록)",
  whitening: "화이트닝 (목록)",
  acne: "여드름·모공 (목록)",
  "anti-aging": "안티에이징 (목록)",
};

/** slug → 한글 시술명 매핑 */
function buildTreatmentNameMap() {
  const map = new Map<string, string>();
  for (const cat of Object.keys(CATEGORY_LABEL)) {
    for (const d of getDevicesByCategory("ko", cat)) {
      map.set(d.slug, d.name);
    }
  }
  return map;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export async function getStats(): Promise<AnalyticsStats> {
  const dayStart = startOfDayKST();
  const yesterdayStart = startOfDayKST(1);
  const weekStart = startOfDayKST(6); // 오늘 포함 7일
  const monthStart = startOfMonthKST();
  const start30 = startOfDayKST(29);
  const start7 = startOfDayKST(6);
  const start28 = startOfDayKST(27);

  const [
    pvToday,
    pvWeek,
    pvMonth,
    pvTotal,
    uvToday,
    uvWeek,
    uvMonth,
    uvTotal,
    pvYesterday,
    uvYesterday,
  ] = await Promise.all([
    countPV(dayStart),
    countPV(weekStart),
    countPV(monthStart),
    countPV(),
    countUV(dayStart),
    countUV(weekStart),
    countUV(monthStart),
    countUV(),
    countPV(yesterdayStart, dayStart),
    countUV(yesterdayStart, dayStart),
  ]);

  // ── 최근 30일 원시 로그 (일별 PV/UV, 시간대, 요일 집계용) ──
  const rows30 = await prisma.pageView.findMany({
    where: { createdAt: { gte: start30 } },
    select: { createdAt: true, visitorId: true },
  });

  const dailyPv = new Map<string, number>();
  const dailyUv = new Map<string, Set<string>>();
  for (let i = 0; i < 30; i++) {
    dailyPv.set(kstDayKey(startOfDayKST(29 - i)), 0);
  }
  const hourly7 = new Array(24).fill(0) as number[];
  const weekdayCounts = new Array(7).fill(0) as number[];

  for (const r of rows30) {
    const key = kstDayKey(r.createdAt);
    if (dailyPv.has(key)) dailyPv.set(key, (dailyPv.get(key) ?? 0) + 1);
    if (r.visitorId) {
      if (!dailyUv.has(key)) dailyUv.set(key, new Set());
      dailyUv.get(key)!.add(r.visitorId);
    }
    const k = new Date(r.createdAt.getTime() + KST);
    if (r.createdAt >= start7) hourly7[k.getUTCHours()] += 1;
    if (r.createdAt >= start28) weekdayCounts[k.getUTCDay()] += 1;
  }
  const daily30 = [...dailyPv.entries()].map(([day, pv]) => ({
    day,
    pv,
    uv: dailyUv.get(day)?.size ?? 0,
  }));
  const weekday28 = WEEKDAYS.map((label, i) => ({ label, count: weekdayCounts[i] }));

  // ── 이번 달 유입 분류 (referrer origin → 네이버/구글/직접…) ──
  const monthRefRaw = await prisma.pageView.groupBy({
    by: ["referrer"],
    where: { createdAt: { gte: monthStart } },
    _count: { _all: true },
  });
  const sourceMap = new Map<string, number>();
  for (const r of monthRefRaw) {
    const label = classifySource(r.referrer);
    if (!label) continue;
    sourceMap.set(label, (sourceMap.get(label) ?? 0) + r._count._all);
  }
  const sources = [...sourceMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  // ── 이번 달 시술 페이지 랭킹 ──
  const pathRaw = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: monthStart } },
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: 60,
  });
  const nameMap = buildTreatmentNameMap();
  const treatMap = new Map<string, number>();
  for (const r of pathRaw) {
    const m = r.path.match(/\/treatments\/([^/]+)(?:\/([^/]+))?\/?$/);
    if (!m) continue;
    const name = m[2]
      ? nameMap.get(m[2]) ?? m[2]
      : CATEGORY_LABEL[m[1]] ?? m[1];
    treatMap.set(name, (treatMap.get(name) ?? 0) + r._count._all);
  }
  const topTreatments = [...treatMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topPaths = pathRaw
    .slice(0, 8)
    .map((r) => ({ path: r.path, count: r._count._all }));

  // ── 기존 상세 목록들 ──
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

  const byLocaleRaw = await prisma.pageView.groupBy({
    by: ["locale"],
    where: { createdAt: { gte: monthStart }, locale: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { locale: "desc" } },
  });
  const byLocale = byLocaleRaw
    .filter((r) => r.locale)
    .map((r) => ({ locale: r.locale as string, count: r._count._all }));

  const byDeviceRaw = await prisma.pageView.groupBy({
    by: ["deviceType"],
    where: { createdAt: { gte: monthStart }, deviceType: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { deviceType: "desc" } },
  });
  const byDevice = byDeviceRaw
    .filter((r) => r.deviceType)
    .map((r) => ({ device: r.deviceType as string, count: r._count._all }));

  const todayRefRaw = await prisma.pageView.groupBy({
    by: ["referrer"],
    where: { createdAt: { gte: dayStart }, referrer: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { referrer: "desc" } },
    take: 8,
  });
  const todayReferrers = todayRefRaw
    .filter((r) => r.referrer)
    .map((r) => ({ referrer: r.referrer as string, count: r._count._all }));

  const todayUtmRaw = await prisma.pageView.findMany({
    where: { createdAt: { gte: dayStart }, utmSource: { not: null } },
    select: { utmSource: true, utmMedium: true },
  });
  const utmMap = new Map<string, { source: string; medium: string | null; count: number }>();
  for (const r of todayUtmRaw) {
    if (!r.utmSource) continue;
    const key = `${r.utmSource}|${r.utmMedium ?? ""}`;
    const cur = utmMap.get(key);
    if (cur) cur.count += 1;
    else utmMap.set(key, { source: r.utmSource, medium: r.utmMedium ?? null, count: 1 });
  }
  const todayUtm = [...utmMap.values()].sort((a, b) => b.count - a.count).slice(0, 8);

  return {
    pv: { today: pvToday, week: pvWeek, month: pvMonth, total: pvTotal },
    uv: { today: uvToday, week: uvWeek, month: uvMonth, total: uvTotal },
    yesterday: { pv: pvYesterday, uv: uvYesterday },
    pagesPerVisitor: uvMonth > 0 ? Math.round((pvMonth / uvMonth) * 10) / 10 : 0,
    daily30,
    hourly7,
    weekday28,
    sources,
    topTreatments,
    topPaths,
    topReferrers,
    byLocale,
    byDevice,
    todayReferrers,
    todayUtm,
  };
}
