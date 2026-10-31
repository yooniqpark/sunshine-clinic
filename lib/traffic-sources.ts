export const AI_SERVICES = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'claude', label: 'Claude' },
] as const;

export type AiService = typeof AI_SERVICES[number]['id'];
type Source = { label: string; ai: AiService | null };
const aiHosts: Record<AiService, string[]> = {
  chatgpt: ['chatgpt.com', 'chat.openai.com'],
  gemini: ['gemini.google.com', 'bard.google.com'],
  claude: ['claude.ai', 'claude.com'],
};
const aiTags: Record<AiService, string[]> = {
  chatgpt: ['chatgpt', 'gpt', 'openai', 'chatgpt_search', 'chatgpt-search'],
  gemini: ['gemini', 'bard', 'google_gemini', 'google-gemini'],
  claude: ['claude', 'anthropic'],
};

function hostname(value: string): string | null {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    return ['http:', 'https:'].includes(url.protocol) ? url.hostname.toLowerCase() : null;
  } catch { return null; }
}
const matches = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

function aiSource(value: string, tag: boolean): Source | null {
  const normalized = value.trim().toLowerCase();
  const host = hostname(normalized);
  for (const service of AI_SERVICES) {
    if ((tag && aiTags[service.id].includes(normalized)) || (host && aiHosts[service.id].some(domain => matches(host, domain)))) {
      return { label: service.label, ai: service.id };
    }
  }
  return null;
}

function otherSource(value: string): string {
  const normalized = value.trim().toLowerCase();
  const host = hostname(normalized) || '';
  const groups: Array<[string, string[], string[]]> = [
    ['네이버', ['naver'], ['naver.com', 'naver.me']],
    ['구글', ['google'], ['google.com', 'google.co.kr', 'google.co.jp', 'google.co.uk']],
    ['다음·카카오', ['daum', 'kakao', 'kakaotalk'], ['daum.net', 'kakao.com']],
    ['인스타그램', ['instagram'], ['instagram.com']],
    ['유튜브', ['youtube'], ['youtube.com', 'youtu.be']],
    ['페이스북', ['facebook', 'fb'], ['facebook.com', 'fb.com']],
    ['빙', ['bing'], ['bing.com']],
  ];
  return groups.find(([, tags, hosts]) => tags.includes(normalized) || hosts.some(domain => matches(host, domain)))?.[0] || '기타';
}

/** Attribute from explicit campaign tags first, then the referring origin.
 * Hostname checks deliberately reject lookalike domains and URL query text.
 * Missing evidence stays unknown; neither user agents nor page content imply AI referrals.
 */
export function classifyTrafficSource(referrer: string | null, utmSource: string | null, siteUrl: string): Source | null {
  if (utmSource?.trim()) return aiSource(utmSource, true) || { label: otherSource(utmSource), ai: null };
  if (!referrer?.trim()) return { label: '직접 방문·출처 미확인', ai: null };
  const host = hostname(referrer);
  const ownHost = hostname(siteUrl);
  if (host && ownHost && matches(host, ownHost)) return null;
  return aiSource(referrer, false) || { label: otherSource(referrer), ai: null };
}

export type TrafficRow = { referrer: string | null; utmSource: string | null; path: string; createdAt: Date };

export function aggregateTraffic(rows: TrafficRow[], siteUrl: string, now = new Date()) {
  // This clinic reports by Korean calendar days, independent of server time.
  const koreanNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = Date.UTC(koreanNow.getUTCFullYear(), koreanNow.getUTCMonth(), koreanNow.getUTCDate()) - 9 * 60 * 60 * 1000;
  const monthStart = Date.UTC(koreanNow.getUTCFullYear(), koreanNow.getUTCMonth(), 1) - 9 * 60 * 60 * 1000;
  const weekStart = today - 6 * 24 * 60 * 60 * 1000;
  const thirtyStart = today - 29 * 24 * 60 * 60 * 1000;
  const services = AI_SERVICES.map(service => ({ ...service, today: 0, week: 0, month: 0 }));
  const paths = new Map<string, { service: string; path: string; count: number }>();
  const sources = new Map<string, number>();

  for (const row of rows) {
    const timestamp = row.createdAt.getTime();
    if (!Number.isFinite(timestamp) || timestamp > now.getTime()) continue;
    const source = classifyTrafficSource(row.referrer, row.utmSource, siteUrl);
    if (!source) continue;
    if (timestamp >= monthStart) sources.set(source.label, (sources.get(source.label) || 0) + 1);
    if (!source.ai || timestamp < thirtyStart) continue;
    const service = services.find(item => item.id === source.ai)!;
    service.month++;
    if (timestamp >= weekStart) service.week++;
    if (timestamp >= today) service.today++;
    const key = `${service.id}:${row.path}`;
    const entry = paths.get(key) || { service: service.label, path: row.path, count: 0 };
    entry.count++;
    paths.set(key, entry);
  }

  return {
    sources: [...sources].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count),
    aiReferrals: { services, paths: [...paths.values()].sort((a, b) => b.count - a.count).slice(0, 10) },
  };
}
