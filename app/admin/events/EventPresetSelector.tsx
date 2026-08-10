import Image from "next/image";
import { MagazineEventPoster } from "@/components/MagazineEventPoster";
import { getActiveEventPreset } from "@/lib/active-event-preset";
import { EVENT_PRESETS } from "@/lib/event-presets";
import { FIRST_VISIT_MAGAZINE_TEMPLATE } from "@/lib/magazine-event-templates";
import { setActiveEventPreset } from "./preset-actions";

export async function EventPresetSelector() {
  const activePresetId = await getActiveEventPreset();

  return (
    <section className="mt-8 rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-brand">HOME POPUP</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">홈페이지 메인 이벤트 교체</h2>
          <p className="mt-1 text-xs text-ink-soft">
            이벤트 카드를 선택하면 홈페이지 팝업과 상세 가격표가 함께 교체됩니다.
          </p>
        </div>
        <p className="text-[10px] font-medium text-ink-soft">기존 이벤트는 삭제되지 않고 목록에 유지됩니다.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {EVENT_PRESETS.map((preset) => {
          const active = preset.id === activePresetId;
          const magazineTemplate = preset.id === "first-visit-magazine-2026"
            ? FIRST_VISIT_MAGAZINE_TEMPLATE
            : null;
          return (
            <article
              key={preset.id}
              className={`overflow-hidden rounded-2xl border transition ${
                active ? "border-brand ring-2 ring-brand/15" : "border-line hover:border-brand/60"
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#dfe8fb] to-[#eee8f6]">
                {magazineTemplate ? (
                  <MagazineEventPoster template={magazineTemplate} className="h-full w-full" />
                ) : preset.imageUrl ? (
                  <Image
                    src={preset.imageUrl}
                    alt={`${preset.title} 미리보기`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#4e3027] to-[#231713] text-center text-cream">
                    <div>
                      <p className="text-[9px] tracking-[0.28em] text-cream/60">CURRENT TEMPLATE</p>
                      <p className="mt-2 font-serif text-2xl">Grand Open</p>
                    </div>
                  </div>
                )}
                {active && (
                  <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-bold text-white shadow">
                    메인 적용 중
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-[9px] font-bold tracking-[0.2em] text-brand">{preset.eyebrow}</p>
                <h3 className="mt-1 text-base font-bold">{preset.title}</h3>
                <p className="mt-1 text-[11px] text-ink-soft">{preset.period}</p>
                <p className="mt-3 min-h-9 text-xs leading-relaxed text-ink-soft">{preset.description}</p>

                <form action={setActiveEventPreset} className="mt-4">
                  <input type="hidden" name="presetId" value={preset.id} />
                  <button
                    type="submit"
                    disabled={active}
                    className={`w-full rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                      active
                        ? "cursor-default bg-brand/10 text-brand-dark"
                        : "bg-ink text-cream hover:bg-brand-dark"
                    }`}
                  >
                    {active ? "현재 홈페이지 이벤트" : "이 이벤트로 교체"}
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
