import type { Metadata } from "next";
import clinic from "@clinic/app";
import { getAdminLoginText } from "@yooniqpark/clinic-core/clinic";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

const text = getAdminLoginText(clinic.config);
export const metadata: Metadata = { title: text.pageTitle };
type Query = Record<string, string | string[] | undefined>;
const single = (value: Query[string]) => Array.isArray(value) ? value[0] : value;

export default async function LoginPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  return <main className={styles.shell}>
    <section className={`${styles.panel} ${styles.brandPanel}`} aria-label={text.brandTitle}>
      <div className={styles.brandBlock}>
        <div className={styles.mark} aria-hidden="true">{text.mark}</div>
        <p className={styles.brandTitle}>{text.brandTitle}</p>
        <p className={styles.brandSubtitle}>{text.brandSubtitle}</p>
        <div className={styles.foilRule} aria-hidden="true" />
        <p className={styles.contextLabel}>{text.contextLabel}</p>
      </div>
    </section>
    <section className={`${styles.panel} ${styles.formPanel}`}>
      <div className={styles.formCard}>
        <h1 className={styles.heading}>{text.heading}</h1>
        <p className={styles.description}>{text.description}</p>
        <LoginForm text={text} requestedCallback={single(query.callbackUrl)} initialError={single(query.error)} initialRetry={single(query.retry) ?? single(query.code)} />
      </div>
    </section>
  </main>;
}
