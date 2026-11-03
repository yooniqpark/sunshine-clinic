import { OpenClinicChatButton } from "@/components/OpenClinicChatButton";
import { ArrowUpRightIcon } from "@/components/icons";
import { getAiConciergeCopy } from "@/lib/ai-concierge";
import { AiConversationPreview } from "./AiConversationPreview";
import styles from "./AiConcierge.module.css";

/** Localized introduction to the shared chat; model attribution is Chinese-only. */
export function AiConcierge({ locale }: { locale: string }) {
  const copy = getAiConciergeCopy(locale);
  if (!copy) return null;

  return (
    <section
      id="ai-concierge"
      data-ai-concierge
      data-locale={locale}
      aria-labelledby="ai-concierge-title"
      lang={locale === "zh" ? "zh-CN" : locale}
      className={styles.section}
    >
      {locale === "zh" && <span id="chinese-ai-concierge" className={styles.legacyAnchor} aria-hidden="true" />}
      <div className={styles.container}>
        <div className={styles.context}>
          <span>{copy.context}</span>
          <span className={styles.language}>{copy.languageLabel}</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="ai-concierge-title" className={styles.title}>
              {copy.title.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p className={styles.description}>
              {copy.description.map((line) => <span key={line}>{line}</span>)}
            </p>
            <OpenClinicChatButton className={styles.action}>
              {copy.action}
              <ArrowUpRightIcon aria-hidden="true" className={styles.actionIcon} />
            </OpenClinicChatButton>
            <p className={styles.previewHint}>{copy.preview.hint}</p>
            {locale === "zh" && copy.provider && (
              <div className={styles.model}>
                <span className={styles.modelLabel}>{copy.provider.label}</span>
                <span className={styles.modelProvider}>{copy.provider.name}</span>
              </div>
            )}
          </div>

          <AiConversationPreview
            key={locale}
            copy={copy.preview}
            brandTitle={copy.orbTitle}
          />
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
          {locale === "zh" && copy.provider && <p>{copy.provider.note}</p>}
        </div>
      </div>
    </section>
  );
}
