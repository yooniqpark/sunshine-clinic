"use client";

import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { AdminLoginText } from "@yooniqpark/clinic-core/clinic";
import styles from "./login.module.css";

type LoginFormText = Pick<AdminLoginText, "usernameLabel" | "passwordLabel" | "submitLabel" | "submittingLabel" | "invalidCredentialsMessage" | "rateLimitMessage">;
const RETRY_MESSAGE = "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";

/** Only return an administrator route on this site's own origin. */
export function safeAdminCallback(requested: string | undefined | null, origin: string): string {
  if (!requested || requested.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(requested)) return "/admin";
  if (!requested.startsWith("/") && !/^https?:\/\//i.test(requested)) return "/admin";
  try {
    const destination = new URL(requested, origin);
    if (destination.origin !== new URL(origin).origin || destination.username || destination.password) return "/admin";
    if (destination.pathname !== "/admin" && !destination.pathname.startsWith("/admin/")) return "/admin";
    return destination.pathname + destination.search + destination.hash;
  } catch {
    return "/admin";
  }
}

export function formatRateLimitMessage(template: string, seconds: string | undefined | null): string {
  const retry = Number(seconds);
  const minutes = Number.isFinite(retry) && retry > 0 ? Math.max(1, Math.ceil(retry / 60)) : 1;
  return template.replaceAll("{minutes}", String(minutes));
}

export default function LoginForm({ text, requestedCallback, initialError, initialRetry }: {
  text: LoginFormText;
  requestedCallback?: string;
  initialError?: string;
  initialRetry?: string;
}) {
  const router = useRouter();
  const inFlight = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(() => initialError === "too-many-attempts"
    ? formatRateLimitMessage(text.rateLimitMessage, initialRetry)
    : initialError === "CredentialsSignin" ? text.invalidCredentialsMessage : initialError ? RETRY_MESSAGE : null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setErr(null);
    setLoading(true);
    try {
      const callback = safeAdminCallback(requestedCallback, window.location.origin);
      const result = await signIn("credentials", { email, password, redirect: false, redirectTo: callback });
      if (result?.error === "too-many-attempts" || result?.status === 429) {
        setErr(formatRateLimitMessage(text.rateLimitMessage, result.code));
      } else if (result?.error === "CredentialsSignin") {
        setErr(text.invalidCredentialsMessage);
      } else if (result?.ok && !result.error) {
        router.replace(callback);
        router.refresh();
      } else {
        setErr(RETRY_MESSAGE);
      }
    } catch {
      // HTML error pages, network failures, and malformed auth responses must all release the form.
      setErr(RETRY_MESSAGE);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return <form onSubmit={onSubmit} className={styles.form} aria-busy={loading}>
    <label className={styles.field}><span>{text.usernameLabel}</span><input type="text" autoComplete="username" autoFocus required disabled={loading} value={email} onChange={event => setEmail(event.target.value)} /></label>
    <label className={styles.field}><span>{text.passwordLabel}</span><input type="password" autoComplete="current-password" required disabled={loading} value={password} onChange={event => setPassword(event.target.value)} /></label>
    {err && <p className={styles.error} role="alert">{err}</p>}
    <button type="submit" disabled={loading} className={styles.submit} aria-busy={loading}>{loading ? text.submittingLabel : text.submitLabel}</button>
  </form>;
}
