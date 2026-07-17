/**
 * Vegas CRM (베가스) reservation forwarding.
 *
 * The clinic uses Vegas 솔루션 as their in-clinic CRM. We POST every new
 * homepage reservation to their WebReservationServer endpoint so the front
 * desk sees it in Vegas without manual entry.
 *
 * Vendor-provided endpoint & payload spec (from 연동 소스 · 2026-07):
 *   URL:  https://h02036.vegas-solution.com/WebReservationServer
 *   type: application/x-www-form-urlencoded
 *   response: JSON { result: ..., error: ... }
 *
 * Fields:
 *   orgno    varchar(8)   요양기관번호 (Sunshine = 13328301)
 *   name     varchar(40)  예약자 이름
 *   phone    varchar(40)  '-' 없이 숫자만 권장
 *   email    varchar(40)  선택
 *   resvdate varchar(8)   YYYYMMDD
 *   resvtime varchar(4)   HHMM
 *   resvmemo text         치료받고자 하는 내용
 *   doctor   varchar(40)  희망 담당의 (선택)
 */

const VEGAS_ENDPOINT = "https://h02036.vegas-solution.com/WebReservationServer";
const VEGAS_ORGNO = "13328301";

export type VegasReservationInput = {
  name: string;
  phone: string;
  email?: string | null;
  preferredAt?: Date | null;
  memo?: string | null;
  interest?: string | null;
  doctor?: string | null;
};

export type VegasResult =
  | { ok: true; raw: unknown }
  | { ok: false; error: string; raw?: unknown };

function pad(n: number, w: number) {
  return String(n).padStart(w, "0");
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}`;
}
function formatTime(d: Date): string {
  return `${pad(d.getHours(), 2)}${pad(d.getMinutes(), 2)}`;
}

function sanitizePhone(v: string): string {
  return v.replace(/[^\d]/g, "").slice(0, 40);
}

function truncate(v: string, len: number): string {
  return v.length > len ? v.slice(0, len) : v;
}

/** Post to Vegas. Never throws — always resolves with `{ok, error?}` so the caller can log without breaking user flow. */
export async function pushReservationToVegas(
  input: VegasReservationInput
): Promise<VegasResult> {
  const memoParts: string[] = [];
  if (input.interest) memoParts.push(`관심 시술: ${input.interest}`);
  if (input.memo) memoParts.push(input.memo);
  const memo = memoParts.join("\n") || "(홈페이지 예약 접수)";

  const now = input.preferredAt ?? new Date();
  const payload: Record<string, string> = {
    orgno: VEGAS_ORGNO,
    name: truncate(input.name, 40),
    phone: sanitizePhone(input.phone),
    email: truncate(input.email ?? "", 40),
    resvdate: formatDate(now),
    resvtime: formatTime(now),
    resvmemo: truncate(memo, 4000),
    doctor: truncate(input.doctor ?? "", 40),
  };

  try {
    const body = new URLSearchParams(payload).toString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(VEGAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* keep raw text */
    }

    if (!res.ok) {
      return { ok: false, error: `Vegas HTTP ${res.status}`, raw: parsed };
    }
    const asObj = parsed as { error?: unknown; result?: unknown };
    if (asObj && typeof asObj === "object" && asObj.error) {
      return { ok: false, error: String(asObj.error), raw: parsed };
    }
    return { ok: true, raw: parsed };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Vegas fetch failed",
    };
  }
}
