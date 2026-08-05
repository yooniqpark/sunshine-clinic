import { prisma } from "@/lib/prisma";

/* ────────────────────────────────────────────────────────────
   챗봇 대화 로거 — 방문자 질문/답변을 ChatLog에 누적한다.
   admin(/admin/chats)에서 열람. 로깅 실패가 챗봇 응답을 막지 않도록
   항상 try/catch로 감싼다.
   ──────────────────────────────────────────────────────────── */

type ChatLogArgs = {
  locale: string;
  question: string;
  answer: string;
  status: "ok" | "fallback" | "error";
  model?: string | null;
  sessionId?: string | null;
};

export async function logChatMessage(args: ChatLogArgs) {
  try {
    await prisma.chatLog.create({
      data: {
        sessionId: args.sessionId ?? null,
        locale: args.locale,
        question: args.question.slice(0, 1000),
        answer: args.answer.slice(0, 2000),
        status: args.status,
        model: args.model ?? null,
      },
    });
  } catch (e) {
    // never block the actual API on logging failure
    console.error("logChatMessage failed:", e);
  }
}
