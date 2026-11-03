/** Pure, bounded lexical retrieval. No browser HTML, remote URLs, or private records. */
export type ChatLocale = "ko" | "en" | "ja" | "zh";
export type KnowledgeDocument = { id: string; kind: "site" | "manual"; title: string; path?: string; text: string; priority: number; sourceLocale?: ChatLocale };
export type ChatHistory = { role: "user" | "bot"; text: string }[];
export type ChatKnowledge = { documents: KnowledgeDocument[]; phone: string; pagePath: string | null };
const categories = "lifting|anti-aging|whitening|acne|skin-disease";
export function normalizePublicPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 180 || /[%?#\\:\s]/.test(value) || value.includes("..") || value.includes("//")) return null;
  const path = value.replace(/^\/(ko|en|ja|zh)(?=\/|$)/, "").replace(/\/$/, "") || "/";
  return /^(\/|\/home|\/about|\/community\/(events|notices|prices))$/.test(path)
    || new RegExp(`^/treatments/(${categories})(/[a-z0-9-]+)?$`).test(path)
    || /^\/journal(?:\/[a-zA-Z0-9-]{1,80})?$/.test(path) ? path : null;
}
export function activePublished(row: { published: boolean; startsAt?: Date | null; endsAt?: Date | null }, now: Date): boolean {
  return row.published && (!row.startsAt || row.startsAt <= now) && (!row.endsAt || row.endsAt >= now);
}
const aliases = ["ulthera 울쎄라 ウルセラ 超声刀", "thermage 써마지 サーマクール 热玛吉", "rejuran 리쥬란 リジュラン 丽珠兰", "price 가격 비용 얼마 費用 料金 价格 费用", "hours 시간 영업 운영 診療時間 营业 时间", "location 위치 주소 어디 アクセス 住所 地址 位置", "booking 예약 予約 预约", "event 이벤트 할인 プロモーション 活动 优惠", "side-effects 부작용 副作用 风险", "consultation 상담 カウンセリング 咨询", "downtime 회복 ダウンタイム 恢复", "acne 여드름 ニキビ 痤疮 痘痘", "scar 흉터 傷跡 疤痕", "lifting 리프팅 リフトアップ 提升", "pigmentation 색소 色素 色斑"];
function terms(text: string): string[] {
  const normalized = text.normalize("NFKC").toLowerCase();
  const result: string[] = normalized.match(/[\p{L}\p{N}-]{2,}/gu) || [];
  for (const group of aliases) if (group.split(" ").some(term => normalized.includes(term))) result.push(...group.split(" "));
  for (const word of [...result]) if (/[가-힣一-龥ぁ-んァ-ヶ]/.test(word)) for (let i = 0; i < word.length - 1; i++) result.push(word.slice(i, i + 2));
  return [...new Set(result)].slice(0, 120);
}
export function retrieveKnowledge(documents: KnowledgeDocument[], query: string, pagePath: string | null): KnowledgeDocument[] {
  const tokens = terms(query);
  const ranked = documents.map(doc => {
    const title = `${doc.title} ${doc.path || ""}`.normalize("NFKC").toLowerCase();
    const text = doc.text.normalize("NFKC").toLowerCase();
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 5 : text.includes(token) ? 1 : 0), 0);
    return { doc, score: score + (doc.path === pagePath ? 12 : 0) + (doc.id === "site:clinic" ? 3 : 0) };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || b.doc.priority - a.doc.priority);
  // Reserve room for both relevant site facts and manual guidance, not just the highest-priority source.
  const clinic = ranked.find(x => x.doc.id === "site:clinic");
  const selected = [...(clinic ? [clinic] : []), ...ranked.filter(x => x.doc.kind === "site" && x.doc.id !== "site:clinic").slice(0, 4), ...ranked.filter(x => x.doc.kind === "manual").slice(0, 3)];
  let budget = 12000;
  return selected.flatMap(({ doc }) => {
    const text = doc.text.slice(0, Math.min(1800, budget));
    if (!text || budget < 250) return [];
    budget -= text.length + doc.title.length + 100;
    return [{ ...doc, text }];
  });
}
export function publicSourcePath(path: string | undefined): string | undefined {
  return path && normalizePublicPath(path) === path ? path : undefined;
}
