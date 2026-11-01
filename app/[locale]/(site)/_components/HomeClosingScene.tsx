"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  HOME_CLOSING_COLORS,
  HOME_CLOSING_EVENT,
  homeClosingPhase,
  homeClosingRailShift,
  type HomeClosingPhase,
} from "@/lib/home-closing";
import styles from "./HomeClosing.module.css";

export function HomeClosingScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const contact = root?.querySelector<HTMLElement>("#book");
    const contactFrame = root?.querySelector<HTMLElement>("[data-home-contact-frame]");
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!root || !contact || !contactFrame) return;
    let frame = 0;
    let previous: HomeClosingPhase | undefined;
    let previousShift: number | undefined;

    const update = () => {
      frame = 0;
      const phase = homeClosingPhase({
        sectionTop: root.getBoundingClientRect().top,
        contactTop: contact.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
      });
      const shift = homeClosingRailShift({
        phase,
        contactFrameTop: contactFrame.getBoundingClientRect().top,
        headerHeight: header?.getBoundingClientRect().height ?? 112,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      if (shift !== previousShift) {
        previousShift = shift;
        root.style.setProperty("--closing-rail-shift", `${shift}px`);
      }
      if (phase === previous) return;
      previous = phase;
      root.dataset.phase = phase;
      window.dispatchEvent(new CustomEvent(HOME_CLOSING_EVENT, { detail: phase }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(contactFrame);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      window.dispatchEvent(new CustomEvent(HOME_CLOSING_EVENT, { detail: "paper" }));
    };
  }, []);

  return (
    <div
      ref={ref}
      className={styles.scene}
      data-home-closing
      style={{
        "--closing-paper": HOME_CLOSING_COLORS.paper,
        "--closing-care": HOME_CLOSING_COLORS.care,
        "--closing-dark": HOME_CLOSING_COLORS.contact,
        "--closing-light": HOME_CLOSING_COLORS.light,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
