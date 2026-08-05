"use client";

import { useEffect, useRef } from "react";

/**
 * 스크롤 시 유리(글래스) 패널 섹션이 아래에서 부드럽게 올라오는 래퍼.
 * 이전 섹션 위로 살짝 겹치며(-mt) 반투명 블러 패널로 떠오른다.
 */
export function GlassRise({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`glass-rise ${className}`}>
      {children}
    </section>
  );
}
