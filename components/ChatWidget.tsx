"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clinic as clinicFallback } from "@/lib/data";
import { CalendarIcon, ChevronDownIcon, CloseIcon, KakaoIcon, NaverIcon, PhoneIcon, SendIcon } from "./icons";
import { LocalizedDatePicker } from "./LocalizedDatePicker";

type ClinicLinks = {
  kakaoHref?: string;
  naverBookingHref?: string;
  phoneHref?: string;
  phone?: string;
};

type Msg = { role: "bot" | "user"; text: string };
type View = "chat" | "booking";

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

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [bookingMenuOpen, setBookingMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: t("greeting") }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // booking form fields
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
  const [bAttachTranscript, setBAttachTranscript] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    mobileScrollRef.current?.scrollTo({
      top: mobileScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, loading]);

  // Reset greeting if locale switches mid-session
  useEffect(() => {
    setMessages([{ role: "bot", text: t("greeting") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  async function ask(question: string, presetAnswer?: string) {
    const text = question.trim();
    if (!text || loading) return;

    setMinimized(false);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    if (presetAnswer !== undefined) {
      setMessages((m) => [...m, { role: "bot", text: presetAnswer }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, locale }),
      });
      const data = await res.json();
      const reply: string =
        (typeof data?.answer === "string" && data.answer) ||
        (typeof data?.error === "string" && data.error) ||
        t("fallback");
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: t("fallback") }]);
    } finally {
      setLoading(false);
    }
  }

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
    setBAttachTranscript(false);
  }

  function buildTranscript() {
    const header = t("transcriptHeader");
    const userLabel = t("transcriptUser");
    const botLabel = t("transcriptBot");
    const lines = messages
      .map((m) => `${m.role === "user" ? userLabel : botLabel} > ${m.text}`)
      .join("\n");
    return `${header}\n${lines}`;
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBError(null);
    if (!bName.trim()) return setBError(tBook("errorName"));
    if (!bContact.trim()) return setBError(tBook("errorContact"));
    if (!bConsent) return setBError(tBook("errorConsent"));
    const preferredAt = bDate ? `${bDate}T${bTime || "10:00"}` : "";
    // build final message: optionally prepend chat transcript
    const finalMessage = (() => {
      const useTranscript = bAttachTranscript && messages.length > 1;
      if (!useTranscript) return bMessage;
      const transcript = buildTranscript();
      if (bMessage.trim().length === 0) return transcript;
      return `${transcript}\n\n${t("transcriptUserMessage")}\n${bMessage}`;
    })();
    const source =
      bAttachTranscript && messages.length > 1
        ? "chatbot-with-transcript"
        : "chatbot-direct";
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
          message: finalMessage,
          source,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setBError(data?.error ?? tBook("errorGeneric"));
        return;
      }
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: tBook("success", { contact: bContact.trim() }),
        },
      ]);
      resetBookingForm();
      setView("chat");
    } catch {
      setBError(tBook("errorGeneric"));
    } finally {
      setBSending(false);
    }
  }

  // Booking form JSX — shared between desktop panel & mobile sheet.
  const bookingForm = (
    <>
      <div className="flex items-center gap-3 border-b border-line/40 px-5 py-3">
        <button
          type="button"
          onClick={() => {
            setView("chat");
            setBError(null);
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

      <form
        onSubmit={submitBooking}
        className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm"
      >
        {/* Mode selection — only when chat exists */}
        {messages.length > 1 && (
          <div className="rounded-2xl border border-line/60 bg-blush/20 p-3">
            <p className="mb-2 text-[11px] font-semibold text-ink">{t("attachTranscript")}</p>
            <div className="grid grid-cols-2 gap-1.5 rounded-full bg-white p-1 ring-1 ring-line/60">
              <button
                type="button"
                onClick={() => setBAttachTranscript(true)}
                className={`rounded-full px-2 py-1.5 text-[11px] font-semibold leading-none transition ${
                  bAttachTranscript
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {t("modeUseChat")}
              </button>
              <button
                type="button"
                onClick={() => setBAttachTranscript(false)}
                className={`rounded-full px-2 py-1.5 text-[11px] font-semibold leading-none transition ${
                  !bAttachTranscript
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {t("modeWriteDirect")}
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-snug text-ink-soft">
              {bAttachTranscript ? t("modeUseChatHint") : t("modeWriteDirectHint")}
            </p>
          </div>
        )}
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
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "12:00",
                  "12:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
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
    </>
  );

  const faqRaw = t.raw("faq");
  const faqList: string[] = Array.isArray(faqRaw) ? (faqRaw as string[]) : [];
  const hasChat = messages.length > 1;

  return (
    <>
      {/* DESKTOP — floating orb */}
      <div
        className={`hidden fixed bottom-6 right-4 z-50 lg:bottom-7 lg:right-6 lg:block ${
          open ? "" : "animate-floaty"
        }`}
      >
        <button
          type="button"
          aria-label={open ? t("closeLabel") : t("openLabel")}
          onClick={() => setOpen((v) => !v)}
          className="relative h-16 w-16 rounded-full transition-transform hover:scale-105 active:scale-95 lg:h-20 lg:w-20"
          style={{
            boxShadow:
              "0 16px 36px rgba(130,95,70,0.3), 0 4px 10px rgba(80,40,15,0.18)",
          }}
        >
          {!open && (
            <span
              className="pointer-events-none absolute inset-0 animate-orb-spin rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #e8cdaf, #c49074, #9a6e54, #fff3df, #e8cdaf, #9a6e54, #e8cdaf)",
                filter:
                  "drop-shadow(0 0 6px rgba(196,144,116,0.7)) drop-shadow(0 0 2px rgba(232,205,175,0.5))",
              }}
            />
          )}

          <span
            className="absolute inset-[2px] overflow-hidden rounded-full backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.32)",
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(130,95,70,0.2)",
            }}
          >
            <span
              className="absolute right-[10%] top-[18%] h-10 w-10 animate-wisp-1 rounded-full lg:h-14 lg:w-14"
              style={{
                background:
                  "radial-gradient(circle, #9a6e54 0%, rgba(154,110,84,0) 65%)",
                filter: "blur(7px)",
              }}
            />
            <span
              className="absolute bottom-[12%] right-[20%] h-9 w-9 animate-wisp-2 rounded-full lg:h-12 lg:w-12"
              style={{
                background:
                  "radial-gradient(circle, #c49074 0%, rgba(196,144,116,0) 65%)",
                filter: "blur(7px)",
              }}
            />
            <span
              className="absolute bottom-[20%] left-[12%] h-9 w-9 animate-wisp-3 rounded-full lg:h-12 lg:w-12"
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

      {/* DESKTOP — chat panel */}
      {open && (
        <div
          className="chat-in fixed z-[60] hidden lg:flex flex-col overflow-hidden bottom-28 right-6 h-[80vh] max-h-[820px] w-[460px] rounded-3xl border border-line/50 bg-cream/55 shadow-2xl shadow-ink/20 backdrop-blur-2xl"
          role="dialog"
          aria-label={t("headerTitle")}
        >
          <div className="relative flex items-center justify-end bg-brand px-3 py-1.5 text-white">
            <button
              type="button"
              aria-label={t("closeLabel")}
              onClick={() => setOpen(false)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 pb-5 pt-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex animate-msg-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-brand text-white"
                      : "rounded-bl-md bg-white text-ink shadow-sm shadow-ink/5"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex animate-msg-in justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm shadow-ink/5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/60" />
                </div>
              </div>
            )}
          </div>

          {faqList.length > 0 && (
            <div className="border-t border-line/30 bg-white/25 px-4 py-3">
              <p className="mb-2 text-[11px] font-medium text-ink-soft">{t("faqTitle")}</p>
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {faqList.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    className="shrink-0 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-line/30 bg-white/30 px-4 pb-4 pt-3 lg:rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 rounded-full border border-line bg-cream px-3 py-1.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? t("inputPlaceholderLoading") : t("inputPlaceholder")}
                disabled={loading}
                className="flex-1 bg-transparent px-1 py-1.5 text-[16px] outline-none placeholder:text-ink-soft/60 disabled:opacity-60 lg:text-sm"
              />
              <button
                type="submit"
                aria-label={t("send")}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
                disabled={loading || !input.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={() => {
                  setView("booking");
                  setBError(null);
                }}
                className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
                aria-label={t("ctaBooking")}
                title={t("ctaBooking")}
              >
                <CalendarIcon className="h-5 w-5" />
              </button>
              <a
                href={clinic.kakaoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#FAE100] text-[#3C1E1E] transition hover:opacity-90"
                aria-label={t("ctaKakao")}
                title={t("ctaKakao")}
              >
                <KakaoIcon className="h-5 w-5" />
              </a>
              <a
                href={clinic.phoneHref}
                className="grid h-11 w-11 place-items-center rounded-full bg-sand text-ink transition hover:bg-blush"
                aria-label={clinic.phone}
                title={clinic.phone}
              >
                <PhoneIcon className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-2 whitespace-pre-line text-center text-[10px] leading-snug text-ink-soft/70">
              {t("disclaimer")}
            </p>
          </div>

          {view === "booking" && (
            <div className="absolute inset-0 z-10 flex flex-col bg-cream/95 backdrop-blur-xl lg:rounded-3xl">
              {bookingForm}
            </div>
          )}
        </div>
      )}

      {/* MOBILE — unified glass container at bottom; grows wider when chat begins */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="relative mx-auto mb-3 mt-3 w-[calc(100%-3rem)] max-w-[480px]">
          {/* Soft warm halo behind chat — gradient light source */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-10 -bottom-6 -top-2"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(255,240,220,0.6) 0%, rgba(245,210,180,0.4) 25%, rgba(255,250,245,0.2) 55%, transparent 80%)",
              filter: "blur(28px)",
            }}
          />
          {/* Side accent — warm beige (left) */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 bottom-8 h-32 w-32 rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(232,180,138,0.95) 0%, rgba(255,235,210,0.5) 50%, transparent 80%)",
            }}
          />
          {/* Side accent — cool tint (right) */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-8 h-32 w-32 rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168,192,224,0.85) 0%, rgba(230,240,250,0.45) 50%, transparent 80%)",
            }}
          />


        <div
          className={`pointer-events-auto relative mx-auto flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/20 backdrop-blur-2xl transition-[max-width] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${
            hasChat && !minimized
              ? "max-w-[420px] delay-0"
              : "max-w-[340px] delay-[400ms]"
          }`}
          style={{
            boxShadow: [
              // 11 o'clock — soft white highlight (gradient white → beige)
              "-12px -12px 28px rgba(255,255,255,0.4)",
              "-7px -7px 16px rgba(255,240,225,0.28)",
              "-3px -3px 8px rgba(232,205,175,0.18)",
              // 5 o'clock — soft warm beige depth
              "12px 12px 30px rgba(196,144,116,0.2)",
              "7px 7px 16px rgba(232,205,175,0.22)",
              "3px 3px 8px rgba(255,235,215,0.2)",
              // base lift
              "0 6px 18px rgba(120,80,50,0.08)",
              // inner highlight (top edge sheen)
              "inset 0 1px 0 rgba(255,255,255,0.55)",
              // inner shade (bottom edge depth)
              "inset 0 -1px 0 rgba(150,110,80,0.05)",
            ].join(", "),
          }}
        >
          {/* Expandable section (header + messages) — height starts mid-width-transition for smooth handoff */}
          {hasChat && (
            <div
              className={`overflow-hidden transition-[max-height,opacity] ease-[cubic-bezier(0.33,1,0.68,1)] ${
                !minimized
                  ? "max-h-[60vh] opacity-100 duration-[1100ms] delay-[250ms]"
                  : "max-h-0 opacity-0 duration-[450ms] delay-0"
              }`}
            >
              <div>
                {/* Header — minimize + clear */}
                <div className="flex items-center justify-between border-b border-white/25 px-2.5 py-1">
                  <button
                    type="button"
                    onClick={() => setMinimized(true)}
                    aria-label={t("closeLabel")}
                    className="grid h-6 w-6 place-items-center rounded-full text-ink-soft/70 transition hover:bg-white/30 hover:text-ink"
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
                      setMessages([{ role: "bot", text: t("greeting") }]);
                      setInput("");
                      setMinimized(false);
                    }}
                    aria-label={t("clearLabel")}
                    title={t("clearLabel")}
                    className="grid h-6 w-6 place-items-center rounded-full text-ink-soft/70 transition hover:bg-white/30 hover:text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 4.5h7m-5.5 0v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1m-4 0v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div
                  ref={mobileScrollRef}
                  className="max-h-[55vh] space-y-2 overflow-y-auto px-3.5 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {messages.slice(1).map((m, i) => (
                    <div
                      key={i}
                      className={`flex animate-msg-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
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
                  ))}
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
            </div>
          )}

          {/* Bottom action area (input + icons + faq chips) */}
          <div
            className={`px-3.5 pb-2 pt-2.5 ${hasChat && !minimized ? "border-t border-white/35" : ""}`}
          >
            {/* Clean glass input with subtle focus accent */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 rounded-2xl border border-white/55 bg-white/80 pl-3 pr-2 py-1.5 backdrop-blur-md transition-shadow duration-300 focus-within:border-brand/35 focus-within:shadow-[0_0_0_3px_rgba(196,144,116,0.15)]"
            >
                {hasChat && minimized && (
                  <button
                    type="button"
                    onClick={() => setMinimized(false)}
                    aria-label={t("openLabel")}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-soft/70 transition hover:bg-ink/5 hover:text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 7.5L6 4.5L9 7.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? t("inputPlaceholderLoading") : t("inputPlaceholder")}
                  disabled={loading}
                  size={1}
                  className={`h-7 w-0 min-w-0 flex-1 appearance-none bg-transparent px-2 text-[16px] outline-none placeholder:text-ink-soft/60 lg:text-sm ${loading ? "opacity-60" : ""}`}
                />
                <button
                  type="submit"
                  aria-label={t("send")}
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-white transition hover:bg-brand-dark ${
                    loading || !input.trim() ? "opacity-60" : ""
                  }`}
                  aria-disabled={loading || !input.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                </button>
              </form>

            <div className="relative mt-1.5 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setBookingMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand/85 px-2 py-1 text-[11px] font-semibold leading-none text-white"
                aria-label={t("ctaBooking")}
                aria-expanded={bookingMenuOpen}
              >
                <CalendarIcon className="block h-3 w-3 shrink-0" />
                <span className="leading-none">{t("ctaBookingShort")}</span>
              </button>
              <a
                href={clinic.kakaoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/50 px-2 py-1 leading-none text-ink backdrop-blur"
                aria-label={t("ctaKakao")}
                title={t("ctaKakao")}
              >
                <KakaoIcon className="block h-3.5 w-3.5 shrink-0" />
              </a>
              <a
                href={clinic.phoneHref}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/50 px-2 py-1 leading-none text-ink backdrop-blur"
                aria-label={clinic.phone}
                title={clinic.phone}
              >
                <PhoneIcon className="block h-3.5 w-3.5 shrink-0" />
              </a>

            </div>
            <p className="mt-1.5 whitespace-pre-line text-center text-[9px] leading-snug text-ink-soft/60">
              {t("disclaimer")}
            </p>
          </div>
        </div>

        {/* Booking choice popover — rendered OUTSIDE chat container to escape overflow-hidden */}
        {bookingMenuOpen && (
          <>
            <button
              type="button"
              aria-label="close"
              onClick={() => setBookingMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 z-[45] cursor-default bg-transparent"
              tabIndex={-1}
            />
            <div
              className="pointer-events-auto absolute bottom-14 left-[calc(14px+(100%-28px-12px)/6)] z-[46] w-[9rem] overflow-hidden rounded-lg border border-white/35 bg-white/25 backdrop-blur-2xl"
              style={{
                boxShadow:
                  "0 8px 24px rgba(120,80,50,0.14), 0 2px 6px rgba(60,40,20,0.05), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setBookingMenuOpen(false);
                  // default to attach if there's a chat — user can change inside form
                  setBAttachTranscript(messages.length > 1);
                  setView("booking");
                  setBError(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] font-medium text-ink transition hover:bg-white/40"
              >
                <CalendarIcon className="block h-3.5 w-3.5 shrink-0 text-brand" />
                <span>{t("ctaBookingDirect")}</span>
              </button>
              <a
                href={clinic.naverBookingHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setBookingMenuOpen(false)}
                className="flex w-full items-center gap-2 border-t border-white/35 px-3 py-1.5 text-left text-[11px] font-medium text-ink transition hover:bg-white/40"
              >
                <NaverIcon className="block h-3 w-3 shrink-0 text-[#03C75A]" />
                <span>{t("ctaNaver")}</span>
              </a>
            </div>
          </>
        )}
        </div>
      </div>

      {/* MOBILE — booking full-screen sheet */}
      {view === "booking" && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-cream/95 backdrop-blur-xl lg:hidden">
          {bookingForm}
        </div>
      )}
    </>
  );
}
