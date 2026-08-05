"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clinic as clinicFallback } from "@/lib/data";
import {
  CalendarIcon,
  ChevronDownIcon,
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
  SendIcon,
  SparkleIcon,
} from "./icons";
import { LocalizedDatePicker } from "./LocalizedDatePicker";

/* ────────────────────────────────────────────────────────────
   Quick-action launcher (booking · KakaoTalk · phone · Naver).
   AI chatbot is intentionally hidden — will return in a later release.
   ──────────────────────────────────────────────────────────── */

type ClinicLinks = {
  kakaoHref?: string;
  naverBookingHref?: string;
  phoneHref?: string;
  phone?: string;
};

type View = "actions" | "booking";

const selectCls =
  "appearance-none w-full rounded-xl border border-line bg-white py-2 pl-3 pr-8 text-[16px] text-ink outline-none transition cursor-pointer hover:border-ink-soft/40 focus:border-brand focus:ring-2 focus:ring-brand/15";
const selectChevronCls =
  "pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft";

export function ChatWidget(props: ClinicLinks = {}) {
  const clinic = {
    kakaoHref: props.kakaoHref ?? clinicFallback.kakaoHref,
    naverBookingHref: props.naverBookingHref ?? clinicFallback.naverBookingHref,
    phoneHref: props.phoneHref ?? clinicFallback.phoneHref,
    phone: props.phone ?? clinicFallback.phone,
  };
  const t = useTranslations("chatbot");
  const tBook = useTranslations("chatbot.booking");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [view, setView] = useState<View>("actions");
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [bookingMenuOpen, setBookingMenuOpen] = useState(false);

  // AI chat state (desktop)
  type Msg = { role: "bot" | "user"; text: string; booking?: boolean };
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 대화방(세션) ID — 상담 내용이 서버에 대화 단위로 저장되도록 식별
  const sessionIdRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, chatOpen, loading]);

  // 모바일 채팅 패널 등장/퇴장 애니메이션 상태
  // panelIn: 마운트 직후 false → true 로 바뀌며 좌우로 넓어짐
  // closing: 닫는 중 — 대화창이 먼저 내려가고 이어서 좌우로 줄어든 뒤 언마운트
  const [panelIn, setPanelIn] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (chatOpen) {
      setClosing(false);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPanelIn(true))
      );
      return () => cancelAnimationFrame(id);
    }
    setPanelIn(false);
  }, [chatOpen]);

  // 채팅이 열려 있는 동안 body에 플래그 — 스크롤 상단 버튼 숨김용
  useEffect(() => {
    if (chatOpen) {
      document.body.dataset.chatOpen = "1";
    } else {
      delete document.body.dataset.chatOpen;
    }
    return () => {
      delete document.body.dataset.chatOpen;
    };
  }, [chatOpen]);

  function closeChat() {
    // 위쪽(대화창·입력박스) 먼저 하강 → 좌우 축소(550ms 지연) → 언마운트
    setClosing(true);
    setTimeout(() => {
      setChatOpen(false);
      setClosing(false);
    }, 1050);
  }

  // iOS/모바일 키보드가 올라오면 fixed 하단 패널이 키보드에 가려진다.
  // visualViewport로 가려진 높이를 재서 패널을 키보드 위로 올린다.
  const [kbOffset, setKbOffset] = useState(0);
  useEffect(() => {
    if (!chatOpen) {
      setKbOffset(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      setKbOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [chatOpen]);

  useEffect(() => {
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || loading) return;
    // AI 실장이 상담 맥락을 이어가도록 이전 대화를 함께 전송 (예약 카드 제외)
    const history = messages
      .filter((m) => !m.booking && m.text)
      .slice(-10)
      .map(({ role, text: t2 }) => ({ role, text: t2 }));
    if (!sessionIdRef.current) {
      sessionIdRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Math.random().toString(36).slice(2)}${Date.now()}`;
    }
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          locale,
          history,
          sessionId: sessionIdRef.current,
        }),
      });
      const data = await res.json();
      const reply: string =
        (typeof data?.answer === "string" && data.answer) ||
        (typeof data?.error === "string" && data.error) ||
        t("fallback");
      setMessages((m) => [
        ...m,
        { role: "bot", text: reply },
        ...(data?.booking === true
          ? [{ role: "bot" as const, text: "", booking: true }]
          : []),
      ]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: t("fallback") }]);
    } finally {
      setLoading(false);
    }
  }

  // 상담 대화록 — 예약 접수 시 서버에 함께 저장된다 (방문자에게는 보이지 않음)
  function chatTranscript() {
    return messages
      .filter((m) => !m.booking && m.text)
      .map((m) => (m.role === "user" ? "고객: " : "실장: ") + m.text)
      .join("\n");
  }

  // 예약 카드 → 상담 내용을 담은 채 예약 팝업(희망 일시 포함) 열기
  function openBookingFromChat() {
    setBMessage((prev) =>
      prev.trim() ? prev : `[AI 실장 상담 내용]\n${chatTranscript()}`
    );
    setBError(null);
    setBSuccess(null);
    setView("booking");
  }

  const faqRaw = t.raw("faq");
  const faqList: string[] = Array.isArray(faqRaw) ? (faqRaw as string[]) : [];

  // Open booking form when URL hash is #booking or #book (from external CTA links)
  useEffect(() => {
    function handleHash() {
      const h = window.location.hash;
      if (h === "#booking" || h === "#book") {
        setView("booking");
        // clean the hash so a re-navigation reopens it
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Booking form state
  const [bName, setBName] = useState("");
  const [bContactType, setBContactType] = useState("PHONE");
  const [bContact, setBContact] = useState("");
  const [bDate, setBDate] = useState("");
  const [bTime, setBTime] = useState("");
  const [bInterest, setBInterest] = useState("");
  const [bMessage, setBMessage] = useState("");
  const [bConsent, setBConsent] = useState(false);
  const [bSending, setBSending] = useState(false);
  const [bError, setBError] = useState<string | null>(null);
  const [bSuccess, setBSuccess] = useState<string | null>(null);

  function resetBookingForm() {
    setBName("");
    setBContactType("PHONE");
    setBContact("");
    setBDate("");
    setBTime("");
    setBInterest("");
    setBMessage("");
    setBConsent(false);
    setBError(null);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBError(null);
    if (!bName.trim()) return setBError(tBook("errorName"));
    if (!bContact.trim()) return setBError(tBook("errorContact"));
    if (!bConsent) return setBError(tBook("errorConsent"));
    const preferredAt = bDate ? `${bDate}T${bTime || "10:00"}` : "";
    setBSending(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bName,
          contact: bContact,
          contactType: bContactType,
          preferredAt,
          interest: bInterest,
          message: bMessage,
          source: "quick-action",
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setBError(data?.error ?? tBook("errorGeneric"));
        return;
      }
      setBSuccess(tBook("success", { contact: bContact.trim() }));
      resetBookingForm();
    } catch {
      setBError(tBook("errorGeneric"));
    } finally {
      setBSending(false);
    }
  }

  /* ───────────── booking form sheet (shared) ───────────── */

  const bookingForm = (
    <>
      <div className="flex items-center gap-3 border-b border-line/40 px-5 py-3">
        <button
          type="button"
          onClick={() => {
            setView("actions");
            setBError(null);
            setBSuccess(null);
          }}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5"
          aria-label={tBook("back")}
        >
          ←
        </button>
        <div>
          <p className="text-sm font-bold">{tBook("title")}</p>
          <p className="text-[11px] text-ink-soft">{tBook("subtitle")}</p>
        </div>
      </div>

      {bSuccess ? (
        <div className="flex-1 overflow-y-auto px-6 py-10 text-center">
          <p className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-2xl text-brand">
            ✓
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">{bSuccess}</p>
          <button
            type="button"
            onClick={() => {
              setBSuccess(null);
              setView("actions");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
          >
            {tBook("back")}
          </button>
        </div>
      ) : (
        <form
          onSubmit={submitBooking}
          className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm"
        >
          <label className="block">
            <span className="text-xs font-semibold text-ink">{tBook("name")} *</span>
            <input
              value={bName}
              onChange={(e) => setBName(e.target.value)}
              required
              maxLength={60}
              className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2 text-[16px] outline-none focus:border-brand lg:text-sm"
            />
          </label>
          <div className="block">
            <span className="text-xs font-semibold text-ink">{tBook("contact")} *</span>
            <div className="mt-1 flex gap-2">
              <div className="relative w-32 shrink-0">
                <select
                  value={bContactType}
                  onChange={(e) => setBContactType(e.target.value)}
                  aria-label={tBook("contactType")}
                  className={selectCls}
                >
                  <option value="PHONE">📞 Phone</option>
                  <option value="EMAIL">✉️ Email</option>
                  <option value="KAKAO">💬 KakaoTalk</option>
                  <option value="LINE">💬 LINE</option>
                  <option value="WECHAT">💬 WeChat</option>
                  <option value="WHATSAPP">💬 WhatsApp</option>
                  <option value="OTHER">📨 Other</option>
                </select>
                <ChevronDownIcon className={selectChevronCls} />
              </div>
              <input
                value={bContact}
                onChange={(e) => setBContact(e.target.value)}
                required
                maxLength={120}
                placeholder={
                  bContactType === "PHONE"
                    ? "010-1234-5678"
                    : bContactType === "EMAIL"
                      ? "you@example.com"
                      : "ID"
                }
                aria-label={tBook("contactValue")}
                className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-[16px] outline-none transition focus:border-brand lg:text-sm focus:ring-2 focus:ring-brand/15"
              />
            </div>
            <span className="mt-1 block text-[10px] text-ink-soft">{tBook("contactHint")}</span>
          </div>
          <div className="block">
            <span className="text-xs font-semibold text-ink">{tBook("preferred")}</span>
            <div className="mt-1 flex gap-2">
              <LocalizedDatePicker
                value={bDate}
                onChange={setBDate}
                locale={locale}
                placeholder={tBook("preferredDate")}
                ariaLabel={tBook("preferredDate")}
                className="flex-1"
              />
              <div className="relative w-28 shrink-0">
                <select
                  value={bTime}
                  onChange={(e) => setBTime(e.target.value)}
                  aria-label={tBook("preferredTime")}
                  className={selectCls}
                >
                  <option value="">{tBook("timeAny")}</option>
                  {[
                    "10:00","10:30","11:00","11:30","12:00","12:30",
                    "14:00","14:30","15:00","15:30","16:00","16:30",
                    "17:00","17:30","18:00","18:30",
                  ].map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className={selectChevronCls} />
              </div>
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-ink">{tBook("interest")}</span>
            <div className="relative mt-1">
              <select
                value={bInterest}
                onChange={(e) => setBInterest(e.target.value)}
                className={selectCls}
              >
                <option value="">{tBook("interestNone")}</option>
                <option>{tNav("lifting")}</option>
                <option>{tNav("whitening")}</option>
                <option>{tNav("acne")}</option>
                <option>{tNav("skinDisease")}</option>
              </select>
              <ChevronDownIcon className={selectChevronCls} />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink">{tBook("message")}</span>
            <textarea
              value={bMessage}
              onChange={(e) => setBMessage(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder={tBook("messagePlaceholder")}
              className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2 text-[16px] outline-none focus:border-brand lg:text-sm"
            />
          </label>
          <label className="flex items-start gap-2 rounded-xl bg-sand/60 px-3 py-2.5">
            <input
              type="checkbox"
              checked={bConsent}
              onChange={(e) => setBConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            />
            <span className="text-[11px] leading-relaxed text-ink-soft">{tBook("consent")} *</span>
          </label>
          {bError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600">{bError}</p>
          )}
          <button
            type="submit"
            disabled={bSending}
            className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50"
          >
            {bSending ? tBook("submitting") : tBook("submit")}
          </button>
        </form>
      )}
    </>
  );

  /* ───────────── action button definitions ───────────── */

  const actions = [
    {
      key: "booking",
      label: t("ctaBookingShort"),
      aria: t("ctaBooking"),
      icon: <CalendarIcon className="block h-3.5 w-3.5 shrink-0" />,
      onClick: () => {
        setView("booking");
        setBError(null);
        setBSuccess(null);
      },
      tone: "brand" as const,
    },
    {
      key: "naver",
      label: t("ctaNaverShort"),
      aria: t("ctaNaver"),
      icon: <NaverIcon className="block h-3 w-3 shrink-0 text-ink" />,
      href: clinic.naverBookingHref,
      external: true,
      tone: "glass" as const,
    },
    {
      key: "kakao",
      label: t("ctaKakaoShort"),
      aria: t("ctaKakao"),
      icon: <KakaoIcon className="block h-3.5 w-3.5 shrink-0" />,
      href: clinic.kakaoHref,
      external: true,
      tone: "glass" as const,
    },
    {
      key: "phone",
      label: t("ctaPhoneShort"),
      aria: clinic.phone,
      icon: <PhoneIcon className="block h-3.5 w-3.5 shrink-0" />,
      href: clinic.phoneHref,
      external: false,
      tone: "glass" as const,
    },
  ];

  function ActionChip({
    action,
    chipClass,
  }: {
    action: (typeof actions)[number];
    chipClass: string;
  }) {
    const baseGlass =
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/40 bg-white/55 px-2 py-2 text-[11px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white";
    const baseBrand =
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand/90 px-2 py-2 text-[11px] font-semibold leading-none text-white transition hover:bg-brand-dark";
    const cls = `${action.tone === "brand" ? baseBrand : baseGlass} ${chipClass}`;
    const inner = (
      <>
        {action.icon}
        <span className="leading-none">{action.label}</span>
      </>
    );
    if (action.onClick) {
      return (
        <button type="button" onClick={action.onClick} aria-label={action.aria} className={cls}>
          {inner}
        </button>
      );
    }
    return (
      <a
        href={action.href}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noopener noreferrer" : undefined}
        aria-label={action.aria}
        className={cls}
      >
        {inner}
      </a>
    );
  }

  return (
    <>
      {/* ════════════ DESKTOP — orb + speed-dial (default) ════════════ */}
      <div className="pointer-events-none fixed bottom-7 right-6 z-50 hidden flex-col items-end gap-2 lg:flex">
        {/* Action chips (visible by default; hidden when chat is activated) */}
        <div
          className={`flex flex-col items-end gap-2 transition-all duration-300 ${
            desktopOpen && !chatOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          {actions.map((a) => (
            <ActionChip
              key={a.key}
              action={a}
              chipClass="shadow-lg shadow-ink/15"
            />
          ))}
        </div>

        {/* Orb toggle — activates chat mode */}
        <button
          type="button"
          aria-label={chatOpen ? t("closeLabel") : t("openLabel")}
          aria-expanded={chatOpen}
          onClick={() => {
            setChatOpen((v) => !v);
            setDesktopOpen(true);
            setChatMinimized(false);
          }}
          className="pointer-events-auto relative h-16 w-16 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            boxShadow:
              "0 16px 36px rgba(130,95,70,0.3), 0 4px 10px rgba(80,40,15,0.18)",
          }}
        >
          <span
            className={`pointer-events-none absolute inset-0 rounded-full ${
              chatOpen ? "" : "animate-orb-spin"
            }`}
            style={{
              background:
                "conic-gradient(from 0deg, #e8cdaf, #c49074, #9a6e54, #fff3df, #e8cdaf, #9a6e54, #e8cdaf)",
              filter:
                "drop-shadow(0 0 6px rgba(196,144,116,0.7)) drop-shadow(0 0 2px rgba(232,205,175,0.5))",
            }}
          />
          <span
            className="absolute inset-[2px] overflow-hidden rounded-full backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.32)",
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(130,95,70,0.2)",
            }}
          >
            <span
              className="absolute right-[10%] top-[18%] h-10 w-10 animate-wisp-1 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #9a6e54 0%, rgba(154,110,84,0) 65%)",
                filter: "blur(7px)",
              }}
            />
            <span
              className="absolute bottom-[12%] right-[20%] h-9 w-9 animate-wisp-2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #c49074 0%, rgba(196,144,116,0) 65%)",
                filter: "blur(7px)",
              }}
            />
            <span
              className="absolute bottom-[20%] left-[12%] h-9 w-9 animate-wisp-3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #e8cdaf 0%, rgba(232,205,175,0) 70%)",
                filter: "blur(7px)",
              }}
            />
            <span className="pointer-events-none absolute left-[18%] top-[14%] h-3.5 w-5 rounded-full bg-white/75 blur-[3px]" />
          </span>
        </button>
      </div>

      {/* ════════════ DESKTOP — Chat mode (glass container, expands on chat) ════════════ */}
      {chatOpen && (() => {
        const hasChat = (messages.length > 0 || loading) && !chatMinimized && !closing;
        // 모바일 폭 단계: 등장 전 270 → 입력박스 상태 330 → 대화 중 전체 폭
        const mobileIdle = panelIn && !closing;
        return (
        <>
        {/* 모바일: 채팅창 바깥을 탭하면 닫힘 (X 버튼 대체) */}
        <div
          className="fixed inset-0 z-[54] lg:hidden"
          onClick={closeChat}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center transition-transform duration-200 ease-out"
          style={kbOffset ? { transform: `translateY(-${kbOffset}px)` } : undefined}
        >
          <div className="chat-in pointer-events-auto relative mb-3 w-[calc(100vw-1.5rem)] max-w-[560px] lg:mb-6 lg:w-auto">
            {/* Soft warm halo (같은 모바일 톤) */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-10 -bottom-6 -top-2"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(255,240,220,0.6) 0%, rgba(245,210,180,0.4) 25%, rgba(255,250,245,0.2) 55%, transparent 80%)",
                filter: "blur(28px)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -left-8 bottom-8 h-32 w-32 rounded-full opacity-55 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,180,138,0.95) 0%, rgba(255,235,210,0.5) 50%, transparent 80%)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-8 bottom-8 h-32 w-32 rounded-full opacity-45 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,192,224,0.85) 0%, rgba(230,240,250,0.45) 50%, transparent 80%)",
              }}
            />

            <div
              className={`relative mx-auto flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/25 backdrop-blur-2xl transition-[max-width] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileIdle
                  ? "max-w-[calc(100vw-1.5rem)] duration-[1100ms] delay-0"
                  : closing
                    ? "max-w-[330px] duration-[400ms] delay-[550ms]"
                    : "max-w-[330px] duration-[1100ms]"
              } ${
                hasChat
                  ? "lg:max-w-[560px] lg:delay-0"
                  : "lg:max-w-[420px] lg:delay-[500ms]"
              }`}
              style={{
                boxShadow: [
                  "-12px -12px 28px rgba(255,255,255,0.4)",
                  "-7px -7px 16px rgba(255,240,225,0.28)",
                  "12px 12px 30px rgba(196,144,116,0.2)",
                  "7px 7px 16px rgba(232,205,175,0.22)",
                  "0 6px 18px rgba(120,80,50,0.08)",
                  "inset 0 1px 0 rgba(255,255,255,0.55)",
                  "inset 0 -1px 0 rgba(150,110,80,0.05)",
                ].join(", "),
              }}
            >
              {/* Expandable messages section — height starts mid-width-transition for smooth handoff */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  hasChat && panelIn
                    ? "max-h-[60vh] opacity-100 duration-[1100ms] delay-[300ms]"
                    : "max-h-0 opacity-0 duration-[500ms] delay-0"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/25 px-2.5 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      // 모바일: 최소화도 종료처럼 전부 접고 폭 축소
                      if (window.matchMedia("(min-width: 1024px)").matches) {
                        setChatMinimized(true);
                      } else {
                        closeChat();
                      }
                    }}
                    aria-label={t("closeLabel")}
                    title={t("closeLabel")}
                    className="grid h-6 w-6 place-items-center rounded-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:bg-white/30"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 6h6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.matchMedia("(min-width: 1024px)").matches) {
                        setMessages([]);
                        setInput("");
                        setChatMinimized(false);
                        sessionIdRef.current = "";
                      } else {
                        // 모바일: X도 전체 접힘 → 폭 축소로 닫고, 닫힌 뒤 대화 초기화
                        closeChat();
                        setTimeout(() => {
                          setMessages([]);
                          setInput("");
                          sessionIdRef.current = "";
                        }, 1150);
                      }
                    }}
                    aria-label={t("clearLabel")}
                    title={t("clearLabel")}
                    className="grid h-6 w-6 place-items-center rounded-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:bg-white/30"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 3l6 6M9 3l-6 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  ref={scrollRef}
                  className="max-h-[55vh] space-y-2 overflow-y-auto px-3.5 pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={
                    kbOffset
                      ? { maxHeight: `max(120px, calc(100vh - ${kbOffset + 230}px))` }
                      : undefined
                  }
                >
                  {messages.map((m, i) =>
                    m.booking ? (
                      /* ── 예약 도우미 카드 — 상담 내용 저장 안내 + 채팅 내 바로 예약 ── */
                      <div key={i} className="flex animate-msg-in justify-start">
                        <div className="w-[88%] rounded-2xl rounded-bl-md border border-brand-soft/70 bg-white/85 p-3.5 shadow-sm shadow-ink/5 backdrop-blur">
                          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand-dark">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {t("bookingCardTitle")}
                          </p>
                          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">
                            {t("bookingCardDesc")}
                          </p>
                          <div className="mt-2.5 flex gap-1.5">
                            <button
                              type="button"
                              onClick={openBookingFromChat}
                              className="flex-1 rounded-full bg-brand/90 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-brand-dark"
                            >
                              {t("bookingCardYes")}
                            </button>
                            <a
                              href={clinic.naverBookingHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 rounded-full border border-line bg-white px-3 py-2 text-center text-[11px] font-semibold text-ink transition hover:border-brand"
                            >
                              {t("ctaNaverShort")}
                            </a>
                          </div>
                          <p className="mt-2 text-[10px] leading-relaxed text-ink-soft/75">
                            {t("bookingCardHint")}
                          </p>
                        </div>
                      </div>
                    ) : (
                    <div
                      key={i}
                      className={`flex animate-msg-in ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "rounded-br-md bg-brand/90 text-white shadow-sm shadow-brand/10"
                            : "rounded-bl-md bg-white/70 text-ink shadow-sm shadow-ink/5"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                    )
                  )}
                  {loading && (
                    <div className="flex animate-msg-in justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/70 px-4 py-3 shadow-sm shadow-ink/5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input box — 모바일에서는 좌우 확장 후 바 위로 펼쳐지며 등장 */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-h-none lg:opacity-100 lg:transition-none ${
                  mobileIdle
                    ? "max-h-24 opacity-100 delay-[450ms]"
                    : "max-h-0 opacity-0 delay-0"
                }`}
              >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2 border-t border-white/40 px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 backdrop-blur">
                  <input
                    ref={inputRef}
                    autoFocus={
                      typeof window !== "undefined" &&
                      window.matchMedia("(min-width: 1024px)").matches
                    }
                    type="text"
                    name="chat-message"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    enterKeyHint="send"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setChatMinimized(false)}
                    placeholder={
                      loading ? t("inputPlaceholderLoading") : t("inputPlaceholder")
                    }
                    disabled={loading}
                    className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-[16px] outline-none placeholder:text-[13px] placeholder:text-ink-soft/60 disabled:opacity-60 lg:text-sm lg:placeholder:text-sm"
                  />
                  <button
                    type="submit"
                    aria-label={t("send")}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
                    disabled={loading || !input.trim()}
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
              </form>
              </div>

              {/* Booking action row (Naver / Kakao / Phone) — 최하단, 데스크톱 전용
                  (모바일은 순수 AI 채팅 버전 — 예약류 버튼은 채팅을 닫으면 하단 바에서) */}
              <div className="hidden border-t border-white/40 px-4 py-2.5 lg:block">
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setView("booking");
                      setBError(null);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand/90 px-2 py-2 text-[11px] font-semibold leading-none text-white transition hover:bg-brand-dark"
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {t("ctaBookingShort")}
                  </button>
                  <a
                    href={clinic.naverBookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/50 bg-white/55 px-2 py-2 text-[11px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white"
                  >
                    <NaverIcon className="h-3 w-3" />
                    {t("ctaNaverShort")}
                  </a>
                  <a
                    href={clinic.kakaoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/50 bg-white/55 px-2 py-2 text-[11px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white"
                  >
                    <KakaoIcon className="h-3.5 w-3.5" />
                    {t("ctaKakaoShort")}
                  </a>
                  <a
                    href={clinic.phoneHref}
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/50 bg-white/55 px-2 py-2 text-[11px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white"
                  >
                    <PhoneIcon className="h-3.5 w-3.5" />
                    {t("ctaPhoneShort")}
                  </a>
                </div>
              </div>

              {/* 모바일 — 하단 바(첫 구성) 그대로 유지: AI 채팅 · 예약 · 카카오톡 · 전화 */}
              {/* pt 11px + border 1px = 하단 바의 pt-3(12px)과 높이 일치 — 전환 시 위치 튐 방지 */}
              <div className="relative border-t border-white/40 px-3.5 pb-3 pt-[11px] lg:hidden">
                {bookingMenuOpen && (
                  <div className="absolute bottom-[calc(100%+10px)] left-[37.5%] z-10 -translate-x-1/2">
                    <div className="flex flex-col gap-1.5 rounded-2xl border border-white/50 bg-white/85 p-2 shadow-xl shadow-ink/20 backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingMenuOpen(false);
                          setView("booking");
                          setBError(null);
                          setBSuccess(null);
                        }}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand/90 px-4 py-2.5 text-[12px] font-semibold leading-none text-white"
                      >
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        {t("bookingVisit")}
                      </button>
                      <a
                        href={clinic.naverBookingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setBookingMenuOpen(false)}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2.5 text-[12px] font-semibold leading-none text-ink"
                      >
                        <NaverIcon className="h-3 w-3 shrink-0" />
                        {t("ctaNaverShort")}
                      </a>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingMenuOpen(false);
                      inputRef.current?.focus();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand/90 px-2 py-1.5 text-[10px] font-semibold leading-none text-white transition hover:bg-brand-dark"
                  >
                    <SparkleIcon className="block h-3.5 w-3.5 shrink-0" />
                    {t("ctaAiShort")}
                  </button>
                  <button
                    type="button"
                    aria-expanded={bookingMenuOpen}
                    onClick={() => setBookingMenuOpen((v) => !v)}
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/40 bg-white/55 px-2 py-1.5 text-[10px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white"
                  >
                    <CalendarIcon className="block h-3.5 w-3.5 shrink-0" />
                    {t("ctaBookingShort")}
                  </button>
                  {actions
                    .filter((a) => a.key === "kakao" || a.key === "phone")
                    .map((a) => (
                      <ActionChip key={a.key} action={a} chipClass="!py-1.5 !text-[10px]" />
                    ))}
                </div>
                <p className="mt-2 text-center text-[8px] uppercase tracking-[0.32em] text-ink-soft/55">
                  A warm light for your skin
                </p>
              </div>
            </div>
          </div>
        </div>
        </>
        );
      })()}

      {/* ════════════ MOBILE — bottom glass bar with 4 chips ════════════ */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden ${
          chatOpen ? "hidden" : ""
        }`}
      >
        <div className="relative mx-auto mb-3 mt-3 w-[calc(100%-3rem)] max-w-[480px]">
          {/* 예약 방식 선택 팝업 — 예약 버튼 위 */}
          {bookingMenuOpen && (
            <div className="pointer-events-auto absolute bottom-[calc(100%+10px)] left-[37.5%] z-10 -translate-x-1/2">
              <div className="flex flex-col gap-1.5 rounded-2xl border border-white/50 bg-white/85 p-2 shadow-xl shadow-ink/20 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setBookingMenuOpen(false);
                    setView("booking");
                    setBError(null);
                    setBSuccess(null);
                  }}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand/90 px-4 py-2.5 text-[12px] font-semibold leading-none text-white"
                >
                  <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                  {t("bookingVisit")}
                </button>
                <a
                  href={clinic.naverBookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setBookingMenuOpen(false)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2.5 text-[12px] font-semibold leading-none text-ink"
                >
                  <NaverIcon className="h-3 w-3 shrink-0" />
                  {t("ctaNaverShort")}
                </a>
              </div>
            </div>
          )}
          {/* Soft warm halo */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-10 -bottom-6 -top-2"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(255,240,220,0.6) 0%, rgba(245,210,180,0.4) 25%, rgba(255,250,245,0.2) 55%, transparent 80%)",
              filter: "blur(28px)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 bottom-8 h-32 w-32 rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(232,180,138,0.95) 0%, rgba(255,235,210,0.5) 50%, transparent 80%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-8 h-32 w-32 rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168,192,224,0.85) 0%, rgba(230,240,250,0.45) 50%, transparent 80%)",
            }}
          />

          <div
            className="pointer-events-auto relative mx-auto flex w-full max-w-[330px] flex-col overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/20 backdrop-blur-2xl"
            style={{
              boxShadow: [
                "-12px -12px 28px rgba(255,255,255,0.4)",
                "-7px -7px 16px rgba(255,240,225,0.28)",
                "-3px -3px 8px rgba(232,205,175,0.18)",
                "12px 12px 30px rgba(196,144,116,0.2)",
                "7px 7px 16px rgba(232,205,175,0.22)",
                "3px 3px 8px rgba(255,235,215,0.2)",
                "0 6px 18px rgba(120,80,50,0.08)",
                "inset 0 1px 0 rgba(255,255,255,0.55)",
                "inset 0 -1px 0 rgba(150,110,80,0.05)",
              ].join(", "),
            }}
          >
            <div className="px-3.5 pb-3 pt-3">
              <div className="grid grid-cols-4 gap-1.5">
                {/* AI 채팅 — 기존 예약 버튼 자리 */}
                <button
                  type="button"
                  onClick={() => {
                    setBookingMenuOpen(false);
                    setChatOpen(true);
                    setChatMinimized(false);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand/90 px-2 py-1.5 text-[10px] font-semibold leading-none text-white transition hover:bg-brand-dark"
                >
                  <SparkleIcon className="block h-3.5 w-3.5 shrink-0" />
                  {t("ctaAiShort")}
                </button>
                {/* 예약 — 내원/네이버 선택 팝업 토글 */}
                <button
                  type="button"
                  aria-expanded={bookingMenuOpen}
                  onClick={() => setBookingMenuOpen((v) => !v)}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/40 bg-white/55 px-2 py-1.5 text-[10px] font-semibold leading-none text-ink backdrop-blur transition hover:bg-white"
                >
                  <CalendarIcon className="block h-3.5 w-3.5 shrink-0" />
                  {t("ctaBookingShort")}
                </button>
                {actions
                  .filter((a) => a.key === "kakao" || a.key === "phone")
                  .map((a) => (
                    <ActionChip key={a.key} action={a} chipClass="!py-1.5 !text-[10px]" />
                  ))}
              </div>
              <p className="mt-2 text-center text-[8px] uppercase tracking-[0.32em] text-ink-soft/55">
                A warm light for your skin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ Booking form sheet (mobile full-screen + desktop modal) ════════════ */}
      {view === "booking" && (
        <>
          {/* mobile */}
          <div className="fixed inset-0 z-[70] flex flex-col bg-cream/95 backdrop-blur-xl lg:hidden">
            {bookingForm}
          </div>
          {/* desktop modal */}
          <div className="fixed inset-0 z-[70] hidden items-center justify-center bg-ink/40 backdrop-blur-sm p-6 lg:flex">
            <div className="relative flex h-[80vh] max-h-[760px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl shadow-ink/30">
              {bookingForm}
            </div>
          </div>
        </>
      )}
    </>
  );
}
