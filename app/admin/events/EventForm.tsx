"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { DateField } from "@/components/admin/DateField";
import { formatPeriod } from "@/lib/period";

type Translation = { locale: "en" | "ja" | "zh"; title: string; desc: string; body: string };

type EventInput = {
  id?: string;
  slug?: string;
  tag?: string;
  title?: string;
  period?: string;
  startsAt?: string | null; // yyyy-mm-dd
  endsAt?: string | null;
  desc?: string;
  body?: string;
  bgColor?: string;
  photoUrl?: string;
  bannerUrl?: string | null;
  bannerFocus?: "top" | "center" | "bottom";
  imageUrl?: string | null;
  published?: boolean;
  sortIndex?: number;
  translations?: Translation[];
};

const LOCALE_TABS = [
  { code: "ko" as const, label: "한국어 (기본)" },
  { code: "en" as const, label: "English" },
  { code: "ja" as const, label: "日本語" },
  { code: "zh" as const, label: "中文" },
];

export function EventForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults: EventInput;
  submitLabel: string;
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(defaults.photoUrl ?? null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(defaults.bannerUrl ?? null);
  const [clearBanner, setClearBanner] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaults.startsAt ? new Date(defaults.startsAt) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaults.endsAt ? new Date(defaults.endsAt) : undefined
  );
  const autoPeriod = formatPeriod(startDate, endDate);
  const [periodOverride, setPeriodOverride] = useState<string>(
    // if defaults.period differs from what auto would produce, treat as override
    defaults.period && defaults.period !== formatPeriod(
      defaults.startsAt ? new Date(defaults.startsAt) : undefined,
      defaults.endsAt ? new Date(defaults.endsAt) : undefined,
    )
      ? defaults.period
      : ""
  );
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<"ko" | "en" | "ja" | "zh">("ko");

  // ko fields are controlled so the AI translate button can read their latest values
  const [koTitle, setKoTitle] = useState(defaults.title ?? "");
  const [koDesc, setKoDesc] = useState(defaults.desc ?? "");
  const [koBody, setKoBody] = useState(defaults.body ?? "");

  type TFields = { title: string; desc: string; body: string };
  const initial = (loc: "en" | "ja" | "zh"): TFields => {
    const tr = defaults.translations?.find((t) => t.locale === loc);
    return { title: tr?.title ?? "", desc: tr?.desc ?? "", body: tr?.body ?? "" };
  };
  const [tEn, setTEn] = useState<TFields>(initial("en"));
  const [tJa, setTJa] = useState<TFields>(initial("ja"));
  const [tZh, setTZh] = useState<TFields>(initial("zh"));
  const [translating, setTranslating] = useState(false);
  const [trErr, setTrErr] = useState<string | null>(null);

  async function runTranslate() {
    setTrErr(null);
    if (!koTitle.trim() && !koDesc.trim() && !koBody.trim()) {
      setTrErr("한국어 내용을 먼저 입력해 주세요.");
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: { title: koTitle, desc: koDesc, body: koBody },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setTrErr(data?.error ?? "번역에 실패했습니다.");
        return;
      }
      const out = data.translations as Record<"en" | "ja" | "zh", TFields>;
      setTEn({ title: out.en?.title ?? "", desc: out.en?.desc ?? "", body: out.en?.body ?? "" });
      setTJa({ title: out.ja?.title ?? "", desc: out.ja?.desc ?? "", body: out.ja?.body ?? "" });
      setTZh({ title: out.zh?.title ?? "", desc: out.zh?.desc ?? "", body: out.zh?.body ?? "" });
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

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoPreview(url);
  }
  function onBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setClearBanner(false);
    setBannerPreview(URL.createObjectURL(f));
  }

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

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* language tabs for translatable content */}
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

          {/* KO */}
          <div className={`mt-3 space-y-4 ${tab === "ko" ? "" : "hidden"}`}>
            <Field label="제목" required>
              <input
                name="title"
                value={koTitle}
                onChange={(e) => setKoTitle(e.target.value)}
                required
                className={inputCls}
              />
            </Field>
            <Field label="짧은 설명 (카드용)">
              <input
                name="desc"
                value={koDesc}
                onChange={(e) => setKoDesc(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="본문" hint="줄바꿈으로 문단을 구분하세요.">
              <textarea
                name="body"
                value={koBody}
                onChange={(e) => setKoBody(e.target.value)}
                rows={6}
                className={`${inputCls} min-h-[10rem] resize-y`}
              />
            </Field>
          </div>

          {/* EN/JA/ZH */}
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
              <Field label={`Description (${code.toUpperCase()})`}>
                <input
                  name={`desc_${code}`}
                  value={trState[code].desc}
                  onChange={(e) => setTr(code, { desc: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label={`Body (${code.toUpperCase()})`} hint="Separate paragraphs with blank lines.">
                <textarea
                  name={`body_${code}`}
                  value={trState[code].body}
                  onChange={(e) => setTr(code, { body: e.target.value })}
                  rows={6}
                  className={`${inputCls} min-h-[10rem] resize-y`}
                />
              </Field>
            </div>
          ))}
        </div>
        <Field label="태그" hint="예: SIGNATURE PACKAGE">
          <input name="tag" defaultValue={defaults.tag ?? ""} className={inputCls} />
        </Field>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-ink">이벤트 기간</p>
            <p className="text-[10px] text-ink-soft">시작/종료일 비우면 “상시 진행”으로 표시</p>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <DateField
              name="startsAt"
              label="시작일"
              defaultValue={defaults.startsAt ?? null}
              onChange={setStartDate}
            />
            <DateField
              name="endsAt"
              label="종료일"
              defaultValue={defaults.endsAt ?? null}
              onChange={setEndDate}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-sand/60 px-3.5 py-2.5">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-brand">
              사이트 표시
            </span>
            <span className="text-sm font-semibold text-ink">
              {periodOverride.trim() ? periodOverride : autoPeriod}
            </span>
          </div>
          <div className="mt-3">
            <label className="block text-[11px] text-ink-soft">
              기간 텍스트 직접 지정 (선택) — 입력하면 위 자동 표시 대신 이 값이 사용됩니다.
            </label>
            <input
              name="periodOverride"
              value={periodOverride}
              onChange={(e) => setPeriodOverride(e.target.value)}
              placeholder="예: 5월 한정 / 상시 진행"
              className={`mt-1 ${inputCls}`}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="슬러그" hint="비워두면 제목에서 자동 생성">
            <input name="slug" defaultValue={defaults.slug ?? ""} className={inputCls} />
          </Field>
          <Field label="배경색" hint="#hex">
            <input
              name="bgColor"
              defaultValue={defaults.bgColor ?? "#ede7e2"}
              className={inputCls}
            />
          </Field>
          <Field label="정렬 순서" hint="작을수록 앞">
            <input
              name="sortIndex"
              type="number"
              defaultValue={defaults.sortIndex ?? 0}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="보조 이미지 URL (선택, /events/event-X.svg 등)">
          <input
            name="imageUrl"
            defaultValue={defaults.imageUrl ?? ""}
            className={inputCls}
            placeholder="/events/event-1.svg"
          />
        </Field>
      </div>

      <aside className="space-y-5">
        <Field label="대표 사진 (세로)" hint="이벤트 카드용. 권장: 4:5 세로형, 8MB 이하">
          {photoPreview && (
            <div
              className="mb-2 relative aspect-[3/4] overflow-hidden rounded-xl border border-line"
              style={{ backgroundColor: defaults.bgColor ?? "#ede7e2" }}
            >
              <Image
                src={photoPreview}
                alt=""
                fill
                sizes="320px"
                className="object-cover object-top"
                unoptimized={photoPreview.startsWith("blob:")}
              />
            </div>
          )}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={onPhotoChange}
            className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-cream file:transition hover:file:bg-brand-dark"
          />
        </Field>

        <Field
          label="슬라이더 배너 (가로, 선택)"
          hint="히어로용. 권장: 16:9 가로형. 비우면 위 세로 사진으로 자동 split 레이아웃."
        >
          {bannerPreview && !clearBanner && (
            <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-sand">
              <Image
                src={bannerPreview}
                alt=""
                fill
                sizes="320px"
                className="object-cover object-center"
                unoptimized={bannerPreview.startsWith("blob:")}
              />
            </div>
          )}
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={onBannerChange}
            className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-cream file:transition hover:file:bg-brand-dark"
          />
          {defaults.bannerUrl && (
            <label className="mt-2 inline-flex items-center gap-2 text-[11px] text-ink-soft">
              <input
                type="checkbox"
                name="clearBanner"
                checked={clearBanner}
                onChange={(e) => {
                  setClearBanner(e.target.checked);
                  if (e.target.checked) setBannerPreview(null);
                  else setBannerPreview(defaults.bannerUrl ?? null);
                }}
                className="h-3.5 w-3.5 accent-brand"
              />
              <span>기존 배너 제거</span>
            </label>
          )}

          {/* vertical focal point */}
          <div className="mt-3">
            <p className="text-[11px] font-medium text-ink-soft">
              배너 표시 위치 (세로 기준)
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl bg-sand/60 p-1">
              {(["top", "center", "bottom"] as const).map((f) => (
                <label
                  key={f}
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-center text-[11px] font-medium text-ink-soft transition has-[:checked]:bg-white has-[:checked]:text-brand-dark has-[:checked]:shadow-sm"
                >
                  <input
                    type="radio"
                    name="bannerFocus"
                    value={f}
                    defaultChecked={(defaults.bannerFocus ?? "center") === f}
                    className="sr-only"
                  />
                  {f === "top" ? "상단" : f === "center" ? "중앙" : "하단"}
                </label>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-ink-soft/80">
              피사체가 어디에 있는지에 따라 선택. 슬라이더에서 잘리지 않을 위치가 됩니다.
            </p>
          </div>
        </Field>

        <Field label="게시 여부">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={defaults.published ?? false}
              className="h-4 w-4 accent-brand"
            />
            <span>사이트에 게시</span>
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
