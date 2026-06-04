import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getSettings,
  updateSettings,
  SETTINGS_DEFAULTS,
  SETTINGS_LABELS,
  SETTINGS_GROUPS,
  type SiteSettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

async function saveAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const patch: Record<string, string | number> = {};
  for (const key of Object.keys(SETTINGS_DEFAULTS) as (keyof SiteSettings)[]) {
    const raw = formData.get(key);
    if (typeof raw !== "string") continue;
    if (key === "monthlyTokenBudgetUsd") {
      const n = Number(raw);
      patch[key] = Number.isFinite(n) ? n : 0;
    } else {
      patch[key] = raw;
    }
  }
  await updateSettings(patch as Partial<SiteSettings>, session.user.id);
  revalidateTag("site-settings", "max");
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const s = await getSettings();

  return (
    <>
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">SETTINGS</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">사이트 설정</h1>
        <p className="mt-2 text-sm text-ink-soft">
          외부 링크 · 진료 정보 등 운영 시 자주 바뀌는 값들. 저장 즉시 사이트에 반영됩니다.
        </p>
      </header>

      <form action={saveAction} className="mt-10 space-y-10">
        {SETTINGS_GROUPS.map((group) => (
          <section
            key={group.label}
            className="rounded-3xl border border-line bg-white p-6 lg:p-8"
          >
            <h2 className="text-base font-bold text-ink">{group.label}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {group.keys.map((key) => {
                const value = s[key] as string | number;
                const isTextarea = key === "hoursJson";
                const isNumber = key === "monthlyTokenBudgetUsd";
                return (
                  <label
                    key={key}
                    className={`block ${isTextarea ? "sm:col-span-2" : ""}`}
                  >
                    <span className="text-xs font-semibold text-ink-soft">
                      {SETTINGS_LABELS[key]}
                    </span>
                    {isTextarea ? (
                      <textarea
                        name={key}
                        defaultValue={String(value)}
                        rows={5}
                        className="mt-1.5 block w-full rounded-xl border border-line bg-cream/40 px-3 py-2 font-mono text-xs text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                      />
                    ) : (
                      <input
                        type={isNumber ? "number" : "text"}
                        step={isNumber ? "any" : undefined}
                        name={key}
                        defaultValue={String(value)}
                        className="mt-1.5 block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        <div className="sticky bottom-0 -mx-5 flex items-center justify-end gap-3 border-t border-line bg-cream/85 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
          <p className="mr-auto text-[11px] text-ink-soft">
            저장 시 모든 페이지의 캐시가 갱신됩니다.
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </>
  );
}
