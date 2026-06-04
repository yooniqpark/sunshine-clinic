"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

export function ScrollSpyTabs({
  items,
  offsetTop = 80,
}: {
  items: Item[];
  offsetTop?: number;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const ignoreSpyUntil = useRef<number>(0);
  const railRef = useRef<HTMLDivElement>(null);

  // sync to URL hash on mount AND on hashchange (header dropdown clicks)
  useEffect(() => {
    function scrollToHash() {
      const fromHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!fromHash) return;
      if (!items.some((i) => i.id === fromHash)) return;
      setActive(fromHash);
      const el = document.getElementById(fromHash);
      if (!el) return;
      ignoreSpyUntil.current = Date.now() + 900;
      // wait a frame so browser's native hash scroll settles first, then we correct
      requestAnimationFrame(() => {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - offsetTop,
          behavior: "smooth",
        });
      });
    }
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, offsetTop]);

  // observe sections — pick the one most prominently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios = new Map<string, number>();
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            ratios.set(item.id, e.intersectionRatio);
          }
          if (Date.now() < ignoreSpyUntil.current) return;
          // pick max-ratio
          let bestId = items[0].id;
          let best = -1;
          ratios.forEach((r, id) => {
            if (r > best) {
              best = r;
              bestId = id;
            }
          });
          if (best > 0) setActive(bestId);
        },
        { rootMargin: `-${offsetTop}px 0px -55% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items, offsetTop]);

  // keep active chip visible in the horizontal rail
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const btn = rail.querySelector<HTMLButtonElement>(`[data-id="${active}"]`);
    if (btn) {
      const railBox = rail.getBoundingClientRect();
      const btnBox = btn.getBoundingClientRect();
      if (btnBox.left < railBox.left + 16 || btnBox.right > railBox.right - 16) {
        // scroll only the rail horizontally — never propagate to <body>
        const targetLeft = btn.offsetLeft - rail.clientWidth / 2 + btn.offsetWidth / 2;
        rail.scrollTo({ left: targetLeft, behavior: "smooth" });
      }
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
    <div className="sticky top-16 z-30 -mx-5 mt-0 border-b border-line bg-cream/95 px-5 backdrop-blur-md lg:top-20 lg:-mx-8 lg:px-8">
      <div
        ref={railRef}
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 py-3 lg:px-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              data-id={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-sand hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
