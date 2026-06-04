"use client";

import { useState, useTransition } from "react";

const LOCALES = ["ko", "en", "ja", "zh"] as const;
type Locale = (typeof LOCALES)[number];

const LOCALE_LABEL: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

type FieldShape =
  | "string" // simple input
  | "longString" // textarea
  | "stringArray" // array of strings
  | "objectArray-titleBody" // [{title, body}]
  | "objectArray-qa" // [{q, a}]
  | "object-valueLabel" // {value, label}
  | "json"; // unrecognized JSON (raw textarea)

function detectShape(field: string, sample: string): FieldShape {
  const trimmed = sample.trim();
  const looksJson =
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"));
  if (!looksJson) {
    if (
      ["intro", "approach", "howItWorks", "description", "tagline", "headlineL1", "headlineL2"].includes(
        field
      ) ||
      sample.length > 60
    ) {
      return "longString";
    }
    return "string";
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        // empty arrays — guess by field name
        if (field === "features") return "objectArray-titleBody";
        if (field === "faq") return "objectArray-qa";
        if (["recommendedFor", "tech", "deviceSlugs"].includes(field)) return "stringArray";
        return "stringArray";
      }
      const first = parsed[0];
      if (typeof first === "string") return "stringArray";
      if (first && typeof first === "object") {
        const keys = Object.keys(first).sort().join(",");
        if (keys === "body,title") return "objectArray-titleBody";
        if (keys === "a,q") return "objectArray-qa";
      }
      return "json";
    }
    if (parsed && typeof parsed === "object") {
      const keys = Object.keys(parsed).sort().join(",");
      if (keys === "label,value") return "object-valueLabel";
      return "json";
    }
    return "json";
  } catch {
    return field === "intro" || sample.length > 60 ? "longString" : "string";
  }
}

type FieldData = Map<Locale, string>;

type Props = {
  group: string;
  slug: string;
  fieldsData: { field: string; perLocale: Record<Locale, string> }[];
  saveAction: (formData: FormData) => Promise<void>;
};

export function ContentEditor({ group, slug, fieldsData, saveAction }: Props) {
  // initial structured state per field per locale
  const [data, setData] = useState<Map<string, FieldData>>(() => {
    const m = new Map<string, FieldData>();
    for (const f of fieldsData) {
      const lm = new Map<Locale, string>();
      for (const l of LOCALES) lm.set(l, f.perLocale[l] ?? "");
      m.set(f.field, lm);
    }
    return m;
  });

  const [savingState, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function setFieldLocale(field: string, locale: Locale, value: string) {
    setData((prev) => {
      const m = new Map(prev);
      const existing = m.get(field) ?? new Map<Locale, string>();
      const fm = new Map(existing);
      fm.set(locale, value);
      m.set(field, fm);
      return m;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("__group", group);
    fd.set("__slug", slug);
    data.forEach((perLocale, field) => {
      perLocale.forEach((value, locale) => {
        fd.set(`${locale}__${field}`, value);
      });
    });
    startSaving(async () => {
      await saveAction(fd);
      setSavedAt(new Date());
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {fieldsData.map((f) => {
        const shape = detectShape(f.field, f.perLocale.ko ?? "");
        const perLocale: Record<Locale, string> = {} as Record<Locale, string>;
        for (const l of LOCALES) perLocale[l] = data.get(f.field)?.get(l) ?? "";
        return (
          <FieldBlock
            key={f.field}
            field={f.field}
            shape={shape}
            perLocale={perLocale}
            onChange={(loc, v) => setFieldLocale(f.field, loc, v)}
          />
        );
      })}

      <div className="sticky bottom-0 -mx-5 flex items-center justify-end gap-3 border-t border-line bg-cream/85 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
        {savedAt && (
          <span className="mr-auto text-[11px] text-ink-soft">
            ✓ {savedAt.toLocaleTimeString("ko-KR")} 저장됨
          </span>
        )}
        <button
          type="submit"
          disabled={savingState}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50"
        >
          {savingState ? "저장 중…" : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}

/* ─────────── single field block ─────────── */

function FieldBlock({
  field,
  shape,
  perLocale,
  onChange,
}: {
  field: string;
  shape: FieldShape;
  perLocale: Record<Locale, string>;
  onChange: (locale: Locale, value: string) => void;
}) {
  const friendlyLabel = FIELD_LABELS[field] ?? field;

  return (
    <section className="rounded-3xl border border-line bg-white p-6 lg:p-8">
      <div className="flex items-baseline justify-between border-b border-line/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-ink">{friendlyLabel}</h2>
          <p className="mt-0.5 font-mono text-[11px] text-ink-soft">{field}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            shape === "string" || shape === "longString"
              ? "bg-sand text-ink-soft"
              : "bg-blush text-ink"
          }`}
        >
          {SHAPE_LABELS[shape]}
        </span>
      </div>

      <div className="mt-4">
        {shape === "string" && (
          <ParallelSimple perLocale={perLocale} onChange={onChange} long={false} />
        )}
        {shape === "longString" && (
          <ParallelSimple perLocale={perLocale} onChange={onChange} long={true} />
        )}
        {shape === "stringArray" && (
          <StringArrayEditor perLocale={perLocale} onChange={onChange} />
        )}
        {shape === "objectArray-titleBody" && (
          <ObjectArrayEditor
            keys={["title", "body"]}
            keyLabels={{ title: "제목", body: "설명" }}
            perLocale={perLocale}
            onChange={onChange}
          />
        )}
        {shape === "objectArray-qa" && (
          <ObjectArrayEditor
            keys={["q", "a"]}
            keyLabels={{ q: "질문", a: "답변" }}
            perLocale={perLocale}
            onChange={onChange}
            longKey="a"
          />
        )}
        {shape === "object-valueLabel" && (
          <ObjectEditor
            keys={["value", "label"]}
            keyLabels={{ value: "수치", label: "라벨" }}
            perLocale={perLocale}
            onChange={onChange}
          />
        )}
        {shape === "json" && (
          <ParallelSimple perLocale={perLocale} onChange={onChange} long={true} mono />
        )}
      </div>
    </section>
  );
}

/* ─────────── simple parallel inputs (string/longString/json) ─────────── */

function ParallelSimple({
  perLocale,
  onChange,
  long,
  mono = false,
}: {
  perLocale: Record<Locale, string>;
  onChange: (locale: Locale, value: string) => void;
  long: boolean;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {LOCALES.map((locale) => {
        const v = perLocale[locale];
        return (
          <label key={locale} className="block">
            <LocaleLabel locale={locale} empty={v === ""} />
            {long ? (
              <textarea
                value={v}
                onChange={(e) => onChange(locale, e.target.value)}
                rows={mono ? 6 : 3}
                className={`mt-1.5 block w-full rounded-xl border border-line bg-cream/30 px-3 py-2 text-[13px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 ${
                  mono ? "font-mono text-xs" : ""
                }`}
              />
            ) : (
              <input
                value={v}
                onChange={(e) => onChange(locale, e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            )}
          </label>
        );
      })}
    </div>
  );
}

/* ─────────── string array editor ─────────── */

function parseStringArray(v: string): string[] {
  try {
    const p = JSON.parse(v);
    if (Array.isArray(p)) return p.map((x) => (typeof x === "string" ? x : String(x ?? "")));
  } catch {
    /* ignore */
  }
  return [];
}

function StringArrayEditor({
  perLocale,
  onChange,
}: {
  perLocale: Record<Locale, string>;
  onChange: (locale: Locale, value: string) => void;
}) {
  // determine row count from ko (assumed canonical) — fall back to max across locales
  const koArr = parseStringArray(perLocale.ko);
  const maxRows = Math.max(
    koArr.length,
    ...LOCALES.map((l) => parseStringArray(perLocale[l]).length)
  );
  const rows = Math.max(maxRows, 1);

  function update(locale: Locale, idx: number, value: string) {
    const arr = parseStringArray(perLocale[locale]);
    while (arr.length < rows) arr.push("");
    arr[idx] = value;
    onChange(locale, JSON.stringify(arr));
  }

  function addRow() {
    LOCALES.forEach((l) => {
      const arr = parseStringArray(perLocale[l]);
      arr.push("");
      onChange(l, JSON.stringify(arr));
    });
  }

  function removeRow(idx: number) {
    LOCALES.forEach((l) => {
      const arr = parseStringArray(perLocale[l]);
      arr.splice(idx, 1);
      onChange(l, JSON.stringify(arr));
    });
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-line bg-cream/30 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-ink-soft">#{idx + 1}</p>
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="text-[11px] text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {LOCALES.map((locale) => {
              const arr = parseStringArray(perLocale[locale]);
              const v = arr[idx] ?? "";
              return (
                <label key={locale} className="block">
                  <LocaleLabel locale={locale} empty={v === ""} size="sm" />
                  <input
                    value={v}
                    onChange={(e) => update(locale, idx, e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                  />
                </label>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="block w-full rounded-full border border-dashed border-line py-2 text-sm font-semibold text-ink-soft transition hover:border-brand hover:text-brand"
      >
        + 항목 추가
      </button>
    </div>
  );
}

/* ─────────── object array editor (features / faq) ─────────── */

function parseObjectArray(v: string): Record<string, string>[] {
  try {
    const p = JSON.parse(v);
    if (Array.isArray(p)) {
      return p.map((x) => (x && typeof x === "object" ? x : {}));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function ObjectArrayEditor({
  keys,
  keyLabels,
  perLocale,
  onChange,
  longKey,
}: {
  keys: string[];
  keyLabels: Record<string, string>;
  perLocale: Record<Locale, string>;
  onChange: (locale: Locale, value: string) => void;
  longKey?: string;
}) {
  const koArr = parseObjectArray(perLocale.ko);
  const maxRows = Math.max(
    koArr.length,
    ...LOCALES.map((l) => parseObjectArray(perLocale[l]).length)
  );
  const rows = Math.max(maxRows, 1);

  function update(locale: Locale, idx: number, key: string, value: string) {
    const arr = parseObjectArray(perLocale[locale]);
    while (arr.length < rows) arr.push({});
    arr[idx] = { ...arr[idx], [key]: value };
    onChange(locale, JSON.stringify(arr));
  }

  function addRow() {
    LOCALES.forEach((l) => {
      const arr = parseObjectArray(perLocale[l]);
      arr.push(Object.fromEntries(keys.map((k) => [k, ""])));
      onChange(l, JSON.stringify(arr));
    });
  }

  function removeRow(idx: number) {
    LOCALES.forEach((l) => {
      const arr = parseObjectArray(perLocale[l]);
      arr.splice(idx, 1);
      onChange(l, JSON.stringify(arr));
    });
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-line bg-cream/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              항목 #{idx + 1}
            </p>
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="text-[11px] text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k}>
                <p className="mb-1.5 text-[11px] font-semibold text-ink">{keyLabels[k] ?? k}</p>
                <div className="grid gap-2 lg:grid-cols-2">
                  {LOCALES.map((locale) => {
                    const arr = parseObjectArray(perLocale[locale]);
                    const v = (arr[idx]?.[k] as string) ?? "";
                    const long = k === longKey || v.length > 50;
                    return (
                      <label key={locale} className="block">
                        <LocaleLabel locale={locale} empty={v === ""} size="sm" />
                        {long ? (
                          <textarea
                            value={v}
                            onChange={(e) => update(locale, idx, k, e.target.value)}
                            rows={2}
                            className="mt-1 block w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                          />
                        ) : (
                          <input
                            value={v}
                            onChange={(e) => update(locale, idx, k, e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="block w-full rounded-full border border-dashed border-line py-2 text-sm font-semibold text-ink-soft transition hover:border-brand hover:text-brand"
      >
        + 항목 추가
      </button>
    </div>
  );
}

/* ─────────── flat object editor (highlightStat) ─────────── */

function parseObj(v: string): Record<string, string> {
  try {
    const p = JSON.parse(v);
    if (p && typeof p === "object" && !Array.isArray(p)) return p;
  } catch {
    /* ignore */
  }
  return {};
}

function ObjectEditor({
  keys,
  keyLabels,
  perLocale,
  onChange,
}: {
  keys: string[];
  keyLabels: Record<string, string>;
  perLocale: Record<Locale, string>;
  onChange: (locale: Locale, value: string) => void;
}) {
  function update(locale: Locale, key: string, value: string) {
    const obj = parseObj(perLocale[locale]);
    obj[key] = value;
    onChange(locale, JSON.stringify(obj));
  }

  return (
    <div className="space-y-3">
      {keys.map((k) => (
        <div key={k}>
          <p className="mb-1.5 text-[11px] font-semibold text-ink">{keyLabels[k] ?? k}</p>
          <div className="grid gap-2 lg:grid-cols-2">
            {LOCALES.map((locale) => {
              const v = (parseObj(perLocale[locale])[k] as string) ?? "";
              return (
                <label key={locale} className="block">
                  <LocaleLabel locale={locale} empty={v === ""} size="sm" />
                  <input
                    value={v}
                    onChange={(e) => update(locale, k, e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                  />
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────── shared bits ─────────── */

function LocaleLabel({
  locale,
  empty,
  size = "md",
}: {
  locale: Locale;
  empty: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`flex items-center gap-1.5 font-semibold uppercase tracking-wide text-ink-soft ${
        size === "sm" ? "text-[10px]" : "text-[11px]"
      }`}
    >
      <span>{locale}</span>
      <span className="font-normal normal-case text-ink-soft/70">{LOCALE_LABEL[locale]}</span>
      {empty && (
        <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] text-red-600">EMPTY</span>
      )}
    </span>
  );
}

const SHAPE_LABELS: Record<FieldShape, string> = {
  string: "텍스트",
  longString: "긴 텍스트",
  stringArray: "목록",
  "objectArray-titleBody": "제목/설명 목록",
  "objectArray-qa": "Q&A",
  "object-valueLabel": "수치/라벨",
  json: "JSON",
};

const FIELD_LABELS: Record<string, string> = {
  name: "이름",
  tagline: "태그라인",
  intro: "소개",
  manufacturer: "제조사",
  tech: "기술 태그",
  highlightStat: "강조 수치",
  features: "기능",
  howItWorks: "시술 원리",
  recommendedFor: "추천 대상",
  faq: "자주 묻는 질문",
  approach: "시술 접근법",
  deviceSlugs: "관련 장비",
  label: "표시 이름",
  eyebrow: "상단 라벨",
  headlineL1: "타이틀 1줄",
  headlineL2: "타이틀 2줄",
  description: "설명",
  greeting: "인사말",
  fallback: "대체 응답",
  disclaimer: "안내문",
  headerTitle: "헤더 제목",
  headerSubtitle: "헤더 부제목",
  inputPlaceholder: "입력 placeholder",
};
