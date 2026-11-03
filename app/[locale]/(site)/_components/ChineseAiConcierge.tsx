import { OpenClinicChatButton } from "@/components/OpenClinicChatButton";
import { ArrowUpRightIcon } from "@/components/icons";
import {
  CHINESE_AI_CONCIERGE_COPY,
  shouldShowChineseAiConcierge,
} from "@/lib/chinese-ai-concierge";
import styles from "./ChineseAiConcierge.module.css";

/** Chinese landing-only introduction to the clinic's existing AI concierge. */
export function ChineseAiConcierge({ locale }: { locale: string }) {
  if (!shouldShowChineseAiConcierge(locale)) return null;

  const copy = CHINESE_AI_CONCIERGE_COPY;

  return (
    <section
      id="chinese-ai-concierge"
      aria-labelledby="chinese-ai-concierge-title"
      lang="zh-CN"
      className={styles.section}
    >
      <div className={styles.container}>
        <div className={styles.context}>
          <span>{copy.context}</span>
          <span className={styles.language}>{copy.languageLabel}</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.orbArea} aria-hidden="true">
            <div className={styles.outerOrbit} />
            <div className={styles.innerOrbit} />
            <div className={styles.orb} />
            <div className={styles.orbCaption}>
              <span>{copy.orbTitle}</span>
              <span>{copy.orbSubtitle}</span>
            </div>
          </div>

          <div className={styles.copy}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="chinese-ai-concierge-title" className={styles.title}>
              {copy.title.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p className={styles.description}>
              {copy.description.map((line) => <span key={line}>{line}</span>)}
            </p>
            <OpenClinicChatButton className={styles.action}>
              {copy.action}
              <ArrowUpRightIcon aria-hidden="true" className={styles.actionIcon} />
            </OpenClinicChatButton>
            <div className={styles.model}>
              <span className={styles.modelLabel}>{copy.modelLabel}</span>
              <span className={styles.modelProvider}>{copy.modelProvider}</span>
            </div>
          </div>
        </div>

        <ol className={styles.steps}>
          {copy.steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">{step.number}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.notes}>
          <p>{copy.disclaimer}</p>
          <p>{copy.providerNote}</p>
        </div>
      </div>
    </section>
  );
}
