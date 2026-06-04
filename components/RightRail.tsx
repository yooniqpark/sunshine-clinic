"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type RailSection = { id: string; label: string; parent?: string };

export function RightRail({
  sections,
  title = "ON THIS PAGE",
  offsetTop = 160,
}: {
  sections: RailSection[];
  title?: string;
  offsetTop?: number;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const ignoreSpyUntil = useRef<number>(0);
  const mobileRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function recompute() {
      if (Date.now() < ignoreSpyUntil.current) return;
      const scrollY = window.scrollY + offsetTop;
      let activeId = sections[0]?.id ?? "";
      let bestTop = -Infinity;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollY && top > bestTop) {
          bestTop = top;
          activeId = s.id;
        }
      }
      setActive(activeId);
    }
    recompute();
    window.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [sections, offsetTop]);

  const activeParent = useMemo(() => {
    const cur = sections.find((s) => s.id === active);
    if (cur?.parent) return cur.parent;
    if (cur && !cur.parent) return cur.id;
    return sections[0]?.id ?? "";
  }, [active, sections]);

  // desktop: top-level + sub-items of active parent
  const visibleDesktop = useMemo(
    () => sections.filter((s) => !s.parent || s.parent === activeParent),
    [sections, activeParent]
  );

  // mobile sub-bar: only sub-items of active parent (chips)
  const mobileSubs = useMemo(
    () => sections.filter((s) => s.parent === activeParent),
    [sections, activeParent]
  );

  // auto-scroll mobile rail to keep active chip in view
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!rail) return;
    const el = rail.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const railRect = rail.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.left < railRect.left || elRect.right > railRect.right) {
      const target =
        el.offsetLeft - rail.clientWidth / 2 + el.offsetWidth / 2;
      rail.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [active]);

  function go(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    ignoreSpyUntil.current = Date.now() + 900;
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offsetTop,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* mobile/tablet — contextual sub-tab bar floats over content; chips solid, bar transparent */}
      {mobileSubs.length > 0 && (
        <div className="pointer-events-none sticky top-[7.5rem] z-20 lg:top-[9rem] xl:hidden">
          <div
            ref={mobileRailRef}
            className="pointer-events-auto mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-5 py-2 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {mobileSubs.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  data-id={s.id}
                  onClick={() => go(s.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm shadow-ink/10 backdrop-blur-md transition ${
                    isActive
                      ? "border-ink/50 bg-ink/45 text-cream"
                      : "border-line/50 bg-white/35 text-ink-soft hover:border-ink/40 hover:bg-white/55 hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* desktop — fixed sidebar */}
      <aside
        aria-label={title}
        className="pointer-events-none fixed right-4 top-44 z-20 hidden w-44 xl:block"
      >
        <div className="pointer-events-auto">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-ink-soft/70">
            {title}
          </p>
          <nav className="relative border-l border-line">
            {visibleDesktop.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(s.id)}
                  className={`relative block w-full py-1.5 text-left text-[12px] leading-tight transition ${
                    s.parent ? "pl-7 pr-2" : "pl-4 pr-2 font-semibold"
                  } ${
                    isActive
                      ? "text-brand"
                      : s.parent
                        ? "text-ink-soft/80 hover:text-ink"
                        : "text-ink hover:text-brand"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-[-1px] top-1 h-[calc(100%-0.5rem)] w-[2px] rounded-full bg-brand" />
                  )}
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
