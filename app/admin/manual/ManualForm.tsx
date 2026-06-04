"use client";

import { useState, useTransition } from "react";

type Translation = { locale: "en" | "ja" | "zh"; title: string; body: string };

type Input = {
  title?: string;
  body?: string;
  sortIndex?: number;
  published?: boolean;
  translations?: Translation[];
};

const LOCALE_TABS = [
  { code: "ko" as const, label: "한국어 (기본)" },
  { code: "en" as const, label: "English" },
  { code: "ja" as const, label: "日本語" },
  { code: "zh" as const, label: "中文" },
];

export function ManualForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults: Input;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(defaults.title ?? "");
  const [body, setBody] = useState(defaults.body ?? "");
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<"ko" | "en" | "ja" | "zh">("ko");

  type TFields = { title: string; body: string };
  const initial = (loc: "en" | "ja" | "zh"): TFields => {
    const tr = defaults.translations?.find((t) => t.locale === loc);
    return { title: tr?.title ?? "", body: tr?.body ?? "" };
  };
  const [tEn, setTEn] = useState<TFields>(initial("en"));
  const [tJa, setTJa] = useState<TFields>(initial("ja"));
  const [tZh, setTZh] = useState<TFields>(initial("zh"));
  const [translating, setTranslating] = useState(false);
  const [trErr, setTrErr] = useState<string | null>(null);

  async function runTranslate() {
    setTrErr(null);
    if (!title.trim() && !body.trim()) {
      setTrErr("한국어 내용을 먼저 입력해 주세요.");
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { title, body } }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setTrErr(data?.error ?? "번역에 실패했습니다.");
        return;
      }
      const out = data.translations as Record<"en" | "ja" | "zh", TFields>;
      setTEn({ title: out.en?.title ?? "", body: out.en?.body ?? "" });
      setTJa({ title: out.ja?.title ?? "", body: out.ja?.body ?? "" });
      setTZh({ title: out.zh?.title ?? "", body: out.zh?.body ?? "" });
    } catch {
      setTrErr("번역 요청 중 오류가 발생했습니다.");
    } finally {
      setTranslating(false);
    }
  }

  const trState = { en: tEn, ja: tJa, zh: tZh };
  const setTr = (loc: "en" | "ja" | "zh", patch: Partial<TFields>) => {
    if (loc === "en") setTEn((s) => ({ ...s, ...patch }));
    if (loc === "ja") setTJa((s) => ({ ...s, ...patch }));
    if (loc === "zh") setTZh((s) => ({ ...s, ...patch }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(fd);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        if (msg !== "NEXT_REDIRECT") setErr(msg);
      }
    });
  }

  const lineCount = body.split("\n").length;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-line bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-1 flex-wrap gap-1 rounded-xl bg-sand/60 p-1">
              {LOCALE_TABS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setTab(l.code)}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === l.code
                      ? "bg-white text-ink shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={runTranslate}
              disabled={translating}
              className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
              title="한국어 내용을 EN/JA/ZH로 자동 번역"
            >
              {translating ? "번역 중…" : "✨ AI 번역"}
            </button>
          </div>
          <p className="mt-2 px-1 text-[10px] text-ink-soft">
            한국어가 기본. AI 번역 버튼을 누르면 EN/JA/ZH 탭이 자동으로 채워집니다 (저장 전 검토 권장).
          </p>
          {trErr && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{trErr}</p>
          )}

          <div className={`mt-3 space-y-4 ${tab === "ko" ? "" : "hidden"}`}>
            <Field label="섹션 제목" required>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="예: 진료 시간"
                className={inputCls}
              />
            </Field>
            <Field
              label="본문"
              required
              hint={`${body.length.toLocaleString()}자 · ${lineCount}줄`}
            >
              <textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={16}
                placeholder={"불릿(-)로 시작하는 짧은 문장 위주로 작성하면 챗봇이 잘 읽습니다."}
                className={`${inputCls} min-h-[24rem] resize-y font-mono text-[13px] leading-relaxed`}
              />
            </Field>
          </div>

          {(["en", "ja", "zh"] as const).map((code) => (
            <div
              key={code}
              className={`mt-3 space-y-4 ${tab === code ? "" : "hidden"}`}
            >
              <Field label={`Title (${code.toUpperCase()})`}>
                <input
                  name={`title_${code}`}
                  value={trState[code].title}
                  onChange={(e) => setTr(code, { title: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label={`Body (${code.toUpperCase()})`}>
                <textarea
                  name={`body_${code}`}
                  value={trState[code].body}
                  onChange={(e) => setTr(code, { body: e.target.value })}
                  rows={16}
                  className={`${inputCls} min-h-[24rem] resize-y font-mono text-[13px] leading-relaxed`}
                />
              </Field>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-5">
        <Field label="정렬 순서" hint="작을수록 위에 표시">
          <input
            name="sortIndex"
            type="number"
            defaultValue={defaults.sortIndex ?? 0}
            className={inputCls}
          />
        </Field>
        <Field label="챗봇에 사용">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={defaults.published ?? true}
              className="h-4 w-4 accent-brand"
            />
            <span>이 섹션을 챗봇 컨텍스트에 포함</span>
          </label>
        </Field>

        {err && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50"
        >
          {pending ? "저장 중…" : submitLabel}
        </button>

        <div className="rounded-xl bg-sand/60 p-4 text-[11px] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink-soft/90">작성 팁</p>
          <ul className="mt-2 space-y-1">
            <li>· 사실 위주로, 한 줄에 한 사실. 의학적 단정·효과 보장 표현 금지.</li>
            <li>· 가격은 적지 마세요 (변동·법적 이슈). 대신 "상담 시 안내"로 답하도록.</li>
            <li>· "피부과 전문의" 표현은 자격 보유자에 한해서만 사용.</li>
            <li>· 너무 긴 본문은 작은 섹션으로 나누면 챗봇이 더 정확히 인용합니다.</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}

const inputCls =
  "block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:bg-cream";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-brand">*</span>}
        </span>
        {hint && <span className="text-[10px] text-ink-soft">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
