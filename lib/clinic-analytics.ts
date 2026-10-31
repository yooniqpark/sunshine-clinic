import 'server-only';
import { prisma } from '@yooniqpark/clinic-core/lib/prisma';
import { getStats as getCoreStats } from '@yooniqpark/clinic-core/lib/analytics';
import { clinicConfig } from '@/clinic.config';
import { aggregateTraffic } from './traffic-sources';
import { getAiAccessStats } from './ai-access';

export async function getStats() {
  const now = new Date();
  // A 32-day window covers the calendar month as well as the last 30 days.
  const [core, rows, aiAccess] = await Promise.all([
    getCoreStats(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000), lte: now } },
      select: { referrer: true, utmSource: true, path: true, createdAt: true },
    }),
    getAiAccessStats(now),
  ]);
  return { ...core, ...aggregateTraffic(rows, clinicConfig.siteUrl, now), aiAccess };
}
