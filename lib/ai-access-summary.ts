const BOTS = [
  ['openai-search', 'OAI-SearchBot', 'ChatGPT 검색 수집'],
  ['openai-training', 'GPTBot', 'OpenAI 학습용 수집'],
  ['chatgpt-user', 'ChatGPT-User', '사용자 요청에 따른 웹 열람'],
  ['claude-bot', 'ClaudeBot', 'Claude 수집기 표기'],
  ['claude-user', 'Claude-User', 'Claude 웹 열람 표기'],
  ['claude-search', 'Claude-SearchBot', 'Claude 검색 수집기 표기'],
  ['google-other', 'GoogleOther', 'Google 범용 수집기 · Gemini 여부 미확인'],
  ['googlebot', 'Googlebot', 'Google 검색 수집기 · Gemini 여부 미확인'],
] as const;
type Access = { botId: string; at: string; path: string; status: number; verified: boolean };
type Snapshot = {
  schemaVersion: number; updatedAt: string; coverageFrom: string | null; coverageTo: string | null;
  openaiIpUpdatedAt: string | null; verifiableBots: string[];
  hours: Record<string, { bots: Record<string, { requests: number; verified: number; ok: number; last?: Access }>; pages: Access[] }>;
};
export type AiAccessStats = {
  available: boolean; updatedAt: string | null; coverageFrom: string | null; coverageTo: string | null; openaiIpUpdatedAt: string | null;
  services: Array<{ id: string; label: string; description: string; canVerify: boolean; today: number; week: number; month: number; verifiedMonth: number | null; successMonth: number; lastAccess: Access | null }>;
  recent: Array<Access & { label: string }>;
};

export function summarizeAiAccess(value: unknown, now = new Date()): AiAccessStats {
  const empty: AiAccessStats = { available: false, updatedAt: null, coverageFrom: null, coverageTo: null, openaiIpUpdatedAt: null, services: [], recent: [] };
  try {
    const snapshot = value as Snapshot;
    if (snapshot.schemaVersion !== 1 || !snapshot.hours || !Array.isArray(snapshot.verifiableBots)) return empty;
    const kst = new Date(now.getTime() + 9 * 3600000);
    const today = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()) - 9 * 3600000;
    const week = today - 6 * 86400000, month = today - 29 * 86400000;
    const services: AiAccessStats['services'] = BOTS.map(([id, label, description]) => ({
      id, label, description, canVerify: snapshot.verifiableBots.includes(id), today: 0, week: 0, month: 0,
      verifiedMonth: snapshot.verifiableBots.includes(id) ? 0 : null, successMonth: 0, lastAccess: null,
    }));
    const recent: AiAccessStats['recent'] = [];
    for (const [hour, bucket] of Object.entries(snapshot.hours)) {
      const timestamp = Date.parse(hour);
      if (!Number.isFinite(timestamp) || timestamp < month || timestamp > now.getTime()) continue;
      for (const service of services) {
        const count = bucket.bots[service.id];
        if (!count) continue;
        service.month += count.requests;
        service.successMonth += count.ok;
        if (service.verifiedMonth !== null) service.verifiedMonth += count.verified;
        if (timestamp >= week) service.week += count.requests;
        if (timestamp >= today) service.today += count.requests;
        if (count.last && (!service.lastAccess || count.last.at > service.lastAccess.at)) service.lastAccess = count.last;
      }
      for (const access of bucket.pages) {
        const service = services.find(item => item.id === access.botId);
        if (service) recent.push({ ...access, label: service.label });
      }
    }
    return { available: true, updatedAt: snapshot.updatedAt, coverageFrom: snapshot.coverageFrom, coverageTo: snapshot.coverageTo, openaiIpUpdatedAt: snapshot.openaiIpUpdatedAt, services, recent: recent.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 20) };
  } catch { return empty; }
}
