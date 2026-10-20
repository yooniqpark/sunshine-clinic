import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { friendlyError, KIND_LABEL, runSession, type Agent, type Kind, type Options } from "./engine";

/* ────────────────────────────────────────────────────────────
   글쓰기 도우미 — 대화 저장(Prisma) + 백그라운드 작업 관리.
   서버(pm2) 한 프로세스에서 돌아가므로 진행 상태는 메모리에 둔다.
   ──────────────────────────────────────────────────────────── */

type JobState = { status: "running" | "idle"; who: Agent | null; text: string };
const g = globalThis as unknown as { __writingJobs?: Map<string, JobState> };
const JOBS = (g.__writingJobs ??= new Map());

/** 관리자(ADMIN)만 사용. 아니면 null. */
export async function requireAdmin() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  return user && user.role === "ADMIN" ? user : null;
}

export function jobState(cid: string): JobState {
  return JOBS.get(cid) ?? { status: "idle", who: null, text: "" };
}

export type Message = {
  id: number;
  role: string;
  type: string;
  content: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

function toMessage(m: { id: number; role: string; type: string; content: string; meta: string; createdAt: Date }): Message {
  let meta: Record<string, unknown> = {};
  try { meta = JSON.parse(m.meta); } catch {}
  return { id: m.id, role: m.role, type: m.type, content: m.content, meta, createdAt: m.createdAt.toISOString() };
}

export async function addMessage(cid: string, role: string, type: string, content = "", meta: object = {}) {
  await prisma.writingMessage.create({
    data: { conversationId: cid, role, type, content, meta: JSON.stringify(meta) },
  });
  await prisma.writingConversation.update({ where: { id: cid }, data: { updatedAt: new Date() } });
}

export async function getMessages(cid: string, after = 0) {
  const rows = await prisma.writingMessage.findMany({
    where: { conversationId: cid, id: { gt: after } },
    orderBy: { id: "asc" },
  });
  return rows.map(toMessage);
}

export async function lastOfType(cid: string, type: string) {
  const r = await prisma.writingMessage.findFirst({ where: { conversationId: cid, type }, orderBy: { id: "desc" } });
  return r ? toMessage(r) : null;
}

function makeTitle(text: string) {
  const line = text.split("\n").map((l) => l.replace(/^#+/, "").trim()).find(Boolean) ?? "새 대화";
  return line.length > 40 ? line.slice(0, 40) + "…" : line;
}

export type Attachment = { as: "reference" | "original"; name?: string; text: string };
export type SendInput = {
  conversationId?: string | null;
  text?: string;
  kind?: string;
  attachments?: Attachment[];
  settings?: Options;
};

/** 사용자 메시지 한 개: 새 대화를 시작하거나 기존 대화를 이어간다. */
export async function send(input: SendInput, userId?: string) {
  const text = (input.text ?? "").trim();
  const atts = (input.attachments ?? []).filter((a) => a && typeof a.text === "string" && a.text.trim());
  const pick = (as: Attachment["as"]) => atts.filter((a) => a.as === as).map((a) => a.text.trim()).join("\n\n");
  let reference = pick("reference");
  let original = pick("original");
  if (!text && !original) throw new Error("요청 내용을 적어 주세요.");

  let conv = input.conversationId
    ? await prisma.writingConversation.findUnique({ where: { id: input.conversationId } })
    : null;
  if (input.conversationId && !conv) throw new Error("대화를 찾을 수 없습니다.");
  if (conv && jobState(conv.id).status === "running") throw new Error("아직 작업 중이에요. 끝난 뒤에 다시 보내 주세요.");

  let instruction = "";
  if (conv) {
    // 이어서 수정: 마지막 원고 + 새 요청
    reference = reference || conv.reference;
    original = original || ((await lastOfType(conv.id, "draft"))?.content ?? "");
    instruction = text;
  } else {
    const kind: Kind = input.kind === "youtube" ? "youtube" : "blog";
    const brief = `글 종류: ${KIND_LABEL[kind]}` + (text ? `\n${text}` : "");
    conv = await prisma.writingConversation.create({
      data: { title: makeTitle(text || original), kind, brief, reference, userId: userId ?? null },
    });
  }

  await addMessage(conv.id, "user", "request", text, {
    attachments: atts.map((a) => ({ as: a.as, name: a.name || "붙여넣은 글", chars: a.text.length })),
  });

  const s = input.settings ?? {};
  start(conv.id, {
    brief: conv.brief,
    kind: conv.kind === "youtube" ? "youtube" : "blog",
    reference,
    original,
    instruction,
    mode: s.mode,
    debateRounds: s.debateRounds,
    writer: s.writer,
    targetScore: s.targetScore,
    maxRevisions: s.maxRevisions,
    claudeModel: s.claudeModel,
    gptModel: s.gptModel,
    demo: s.demo,
  });
  return conv.id;
}

function start(cid: string, job: Parameters<typeof runSession>[0]) {
  const state: JobState = { status: "running", who: null, text: "준비 중" };
  JOBS.set(cid, state);
  // 응답은 바로 돌려주고, 두 AI의 대화는 서버에서 계속 진행된다 (화면은 주기적으로 새 메시지를 가져감)
  void runSession(
    job,
    (role, type, content, meta) => addMessage(cid, role, type, content, meta),
    (who, text) => { state.who = who; state.text = text; }
  )
    .catch(async (e) => {
      console.error("writing session failed:", e);
      await addMessage(cid, "system", "error", friendlyError(e)).catch(() => {});
    })
    .finally(() => { state.status = "idle"; state.who = null; });
}
