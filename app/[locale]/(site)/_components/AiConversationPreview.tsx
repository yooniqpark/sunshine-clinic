"use client";

import { useId, useState } from "react";
import { ChatOrb } from "@/components/ChatOrb";
import { ArrowUpRightIcon } from "@/components/icons";
import { requestClinicChatOpen } from "@/lib/clinic-chat-events";
import type { AiConciergePreviewCopy } from "@/lib/ai-concierge";
import styles from "./AiConcierge.module.css";

/** Curated examples stay local; only the explicit chat button opens the live widget. */
export function AiConversationPreview({
  copy,
  brandTitle,
}: {
  copy: AiConciergePreviewCopy;
  brandTitle: string;
}) {
  const [selectedId, setSelectedId] = useState(copy.questions[0]?.id ?? "");
  const exchangeId = useId();
  const selected = copy.questions.find((question) => question.id === selectedId) ?? copy.questions[0];

  if (!selected) return null;

  return (
    <div
      role="region"
      aria-label={copy.label}
      data-ai-conversation-preview
      className={styles.preview}
    >
      <div className={styles.previewHeader}>
        <div className={styles.previewIdentity}>
          <ChatOrb className={styles.orbVisual} spinning={false} />
          <div className={styles.previewName}>
            <strong>{brandTitle}</strong>
            <span>{copy.assistantLabel}</span>
          </div>
        </div>
        <span className={styles.previewLabel}>{copy.label}</span>
      </div>

      <div className={styles.previewMessages}>
        <p className={`${styles.message} ${styles.assistantMessage}`}>{copy.greeting}</p>
        <div
          id={exchangeId}
          className={styles.previewExchange}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className={`${styles.message} ${styles.guestMessage}`} data-ai-preview-question>
            {selected.question}
          </p>
          <p className={`${styles.message} ${styles.assistantMessage}`} data-ai-preview-answer>
            {selected.answer}
          </p>
        </div>
      </div>

      <div role="group" aria-label={copy.hint} className={styles.questionOptions}>
        {copy.questions.map((question) => (
          <button
            key={question.id}
            type="button"
            aria-pressed={selected.id === question.id}
            aria-controls={exchangeId}
            className={styles.questionChip}
            onClick={() => setSelectedId(question.id)}
          >
            {question.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label={copy.inputActionLabel}
        data-ai-preview-open-chat
        className={styles.previewOpenChat}
        onClick={() => requestClinicChatOpen(window)}
      >
        <span>{copy.inputHint}</span>
        <ArrowUpRightIcon aria-hidden="true" className={styles.actionIcon} />
      </button>
    </div>
  );
}
