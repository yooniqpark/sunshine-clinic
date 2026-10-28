import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

/* ────────────────────────────────────────────────────────────
   글쓰기 도우미 엔진 — 두 가지 진행 방식. 화면/저장은 호출하는 쪽 담당.
   - loop:   작가 AI가 쓰고, 편집자 AI가 채점·지적하고, 목표 점수까지 주고받는다.
   - debate: 두 AI가 각자 쓰고, 서로의 원고를 비판·반박하며 고친 뒤,
             더 높게 평가받은 쪽이 둘을 합쳐 최종본을 만들고 상대가 최종 검토한다.
   ──────────────────────────────────────────────────────────── */

export type Agent = "claude" | "gpt";
export type Kind = "youtube" | "blog";
export type Mode = "debate" | "loop";

export const KIND_LABEL: Record<Kind, string> = { youtube: "유튜브 대본", blog: "블로그" };
export const AGENT_NAME: Record<Agent, string> = { claude: "Claude", gpt: "GPT" };

export const DEFAULTS = {
  claudeModel: process.env.WRITING_CLAUDE_MODEL || "claude-opus-5-5",
  gptModel: process.env.WRITING_GPT_MODEL || "gpt-5",
  mode: "debate" as Mode,
  writer: "claude" as Agent,
  targetScore: 8.5,
  maxRevisions: 3,
  debateRounds: 2,
};

const CLINIC_PROFILE =
  process.env.WRITING_CLINIC_PROFILE ||
  "선샤인의원 — 서울특별시 송파구 잠실동 181-4의 피부과 의원 (피부 시술·레이저·보톡스 등)";

/** 병원 홍보 글이 지켜야 할 의료광고 기준 (의료법 제56조 요지) */
const MEDICAL_AD_RULES = `[병원 정보]
${CLINIC_PROFILE}
병원명·위치 외의 정보(의료진 경력, 장비 대수, 수상·인증, 환자 수 등)는 의뢰서에 없으면 지어내지 말고 [확인 필요]로 남긴다.

[의료광고 기준 - 의료법 제56조, 반드시 지킬 것]
- 치료 효과를 보장하거나 단정하지 않는다 ("100%", "완치", "확실한 효과", "부작용 없음" 등 금지)
- 최상급·비교 표현을 쓰지 않는다 ("최고", "유일", "최초", "No.1", 다른 병원과의 비교)
- 환자 치료 후기·체험담, 시술 전후 사진을 광고 수단으로 쓰지 않는다
- 시술을 소개할 때는 개인차가 있다는 점과 가능한 부작용·주의사항을 함께 안내한다
- 할인·이벤트를 과도하게 강조해 환자를 유인하지 않는다 ("파격", "공짜", "오늘만" 등)
- 공포심을 조장하거나 확인되지 않은 수치·논문을 인용하지 않는다
- 홍보보다 정보 전달이 중심이 되게 쓰고, 마무리는 "상담 후 결정" 수준의 부드러운 안내로 한다`;

const RUBRICS: Record<Kind, Record<string, string>> = {
  youtube: {
    도입부: "첫 15초 안에 시청자를 붙잡는가",
    구성: "흐름이 자연스럽고 이탈 구간이 없는가",
    정확성: "사실 오류나 과장이 없는가",
    "의료광고 준수": "효과 보장·최상급·후기 남용 등 의료법상 문제 표현이 없는가",
    "말하기 편함": "소리 내어 읽었을 때 자연스러운가",
    마무리: "구독·댓글 등 행동 유도가 자연스러운가",
  },
  blog: {
    도입부: "제목과 첫 문단이 클릭하고 계속 읽게 만드는가",
    구성: "소제목 구조가 명확하고 훑어보기 쉬운가",
    정확성: "사실 오류나 과장이 없는가",
    "의료광고 준수": "효과 보장·최상급·후기 남용 등 의료법상 문제 표현이 없는가",
    "읽기 편함": "문장이 짧고 쉬운가",
    마무리: "검색 키워드 반영과 행동 유도가 있는가",
  },
};

const WRITER_SYSTEM = `너는 병원 홍보용 유튜브 대본과 블로그 글을 전문으로 쓰는 작가다.
- 의뢰서의 조건(대상, 분량, 말투, 꼭 넣을 내용)을 반드시 지킨다.
- [참고 예시 글]이 있으면 그 글의 말투, 문장 길이, 구성 방식을 따라 쓴다. 단, 내용이나 문장을 그대로 베끼지 않는다.
- 편집자 피드백을 받으면 반영해 수정하되, 동의하지 않는 지적은 이유를 한 줄로 밝히고 원래대로 둬도 된다.
- 편집자가 '잘된 점'으로 꼽은 부분은 함부로 바꾸지 않는다.
- 사용자가 직접 쓴 원고를 다듬을 때는 글쓴이의 목소리와 핵심 내용을 최대한 살린다.
- 확실하지 않은 사실은 지어내지 말고 [확인 필요] 표시를 남긴다.
- 의료·시술 관련 내용은 효과를 단정하거나 과장하지 않는다.
- 원고의 제목과 소제목은 마크다운(#, ##)으로 표시한다.

${MEDICAL_AD_RULES}

반드시 아래 형식으로만 답한다:
===원고===
(완성된 원고 전체)
===수정메모===
(이번에 무엇을 반영했고, 무엇을 왜 반영하지 않았는지. 첫 초안이면 '첫 초안')`;

const EDITOR_SYSTEM = `너는 깐깐하지만 공정한 편집자다.
- 글을 직접 다시 쓰지 않는다. 점수와 수정 지시만 한다.
- 채점 기준표의 항목마다 10점 만점으로 점수를 매긴다 (소수점 한 자리 가능).
- 가장 중요한 수정 사항을 최대 3개, '위치 / 이유 / 고치는 방법'으로 구체적으로 제시한다.
- [참고 예시 글]이 있으면 그 말투와 구성을 잘 따랐는지도 함께 본다.
- 칭찬만 하지 말고, 수정할 게 정말 거의 없을 때만 no_major_changes를 true로 한다.
- 잘된 점 1~2개를 꼭 적는다 (다음 수정 때 유지되도록).
- 사실 확인이 필요한 문장이나 의료광고로 문제될 수 있는 과장 표현이 있으면 fact_check에 적는다.
- comment에는 작가에게 건네는 한두 문장의 총평을 적는다.

${MEDICAL_AD_RULES}

반드시 아래 JSON 형식으로만 답한다:
{
  "comment": "총평 한두 문장",
  "scores": {"항목이름": 점수, ...},
  "strengths": ["잘된 점", ...],
  "fixes": [{"where": "위치", "why": "이유", "how": "고치는 방법"}, ...],
  "fact_check": ["확인이 필요한 문장", ...],
  "no_major_changes": false
}`;

/* 토론 모드: 같은 의뢰로 각자 쓴 두 AI가 서로의 원고를 놓고 토론한다 */
const DEBATER_SYSTEM = `${WRITER_SYSTEM}

[토론 규칙]
너는 지금 다른 AI 작가와 같은 의뢰로 각자 글을 쓰고, 서로 비판하며 더 나은 글을 만드는 토론에 참여하고 있다.
- 상대의 지적을 받으면, 수정메모에 지적 하나하나마다 한 줄씩 "✅ 수용: (무엇을 어떻게 고쳤는지)" 또는 "🙅 반박: (왜 동의하지 않는지 근거)"로 답한다.
- 무조건 수용하지 말고, 독자에게 더 나은 쪽을 근거로 판단한다. 다만 의료광고 기준 위반 지적은 반드시 수용한다.`;

const CRITIC_SYSTEM = `${EDITOR_SYSTEM}

[토론 규칙]
너는 지금 편집자이자 토론 상대로서, 같은 의뢰로 글을 쓴 상대 AI 작가의 원고를 평가한다.
- 네 원고를 홍보하지 말고 상대 원고 자체를 공정하게 채점한다. 다만 네가 더 잘 풀었다고 생각하는 부분은 구체적으로 제안해도 된다.
- [지난 라운드 너의 지적]과 [상대의 답변]이 있으면: 상대의 반박이 타당하면 그 지적은 철회하고, 타당하지 않으면 근거를 더해 다시 지적한다. comment에 이 판단을 짧게 밝힌다.`;

const REFERENCE_LIMIT = 15000; // 참고 글이 너무 길면 앞부분만 (비용 절약)

export type Feedback = {
  scores: Record<string, number>;
  strengths: string[];
  fixes: { where?: string; why?: string; how?: string }[];
  fact_check: string[];
  no_major_changes: boolean;
  comment?: string;
  average: number;
};

export type Options = {
  mode?: Mode;
  debateRounds?: number;
  writer?: Agent;
  targetScore?: number;
  maxRevisions?: number;
  claudeModel?: string;
  gptModel?: string;
  demo?: boolean;
};

export type Job = {
  brief: string;
  kind: Kind;
  original?: string; // 시작 원고 (있으면 초안을 새로 쓰지 않음)
  instruction?: string; // original 에 적용할 추가 요청
  reference?: string;
} & Options;

export type Say = (role: "user" | Agent | "system", type: string, content: string, meta?: object) => Promise<void>;
export type Typing = (who: Agent | null, text: string) => void;

export function keyStatus() {
  return {
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
    gpt: Boolean(process.env.OPENAI_API_KEY),
  };
}

/* ── AI 호출 ── */
class AI {
  tokens = { claude: 0, gpt: 0 };
  private demoRound = 0;
  private claude?: Anthropic;
  private gpt?: OpenAI;

  constructor(private demo: boolean, private models: { claude: string; gpt: string }) {
    if (demo) return;
    const missing = [
      !process.env.ANTHROPIC_API_KEY && "ANTHROPIC_API_KEY",
      !process.env.OPENAI_API_KEY && "OPENAI_API_KEY",
    ].filter(Boolean);
    if (missing.length) {
      throw new UserFacingError(
        `서버에 ${missing.join(", ")} 가 설정되지 않았습니다. 관리자에게 서버 .env 설정을 요청하거나, 설정에서 연습 모드를 켜 주세요.`
      );
    }
    this.claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.gpt = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async ask(who: Agent, system: string, user: string, wantJson = false): Promise<string> {
    if (this.demo) return this.fake(wantJson);
    if (who === "claude") {
      const resp = await this.claude!.messages.create({
        model: this.models.claude,
        max_tokens: 16000,
        system,
        messages: [{ role: "user", content: user }],
      });
      this.tokens.claude += resp.usage.input_tokens + resp.usage.output_tokens;
      return resp.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    }
    const resp = await this.gpt!.responses.create({
      model: this.models.gpt,
      instructions: system,
      input: user,
      ...(wantJson ? { text: { format: { type: "json_object" as const } } } : {}),
    });
    this.tokens.gpt += resp.usage?.total_tokens ?? 0;
    return resp.output_text;
  }

  /** 연습 모드: AI를 부르지 않고 점수가 오르는 흐름만 보여준다. */
  private async fake(wantJson: boolean): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    if (!wantJson) {
      return (
        `===원고===\n# 연습 모드 원고 (${this.demoRound + 1}번째 버전)\n\n` +
        "안녕하세요! 오늘은 **아침 피로**에 대해 이야기해 볼게요.\n\n" +
        "## 첫 번째 이유\n\n- 수면 중 호흡이 끊기는 경우\n- 늦은 시간 스마트폰 사용\n\n" +
        "## 마무리\n\n오늘 밤 하나만 실천해 보세요. 구독과 좋아요도 부탁드려요!\n" +
        "===수정메모===\n" +
        (this.demoRound === 0 ? "첫 초안" : "✅ 수용: 도입부를 질문형으로 바꿨습니다.\n🙅 반박: 소제목 개수는 분량에 맞아 그대로 뒀습니다.")
      );
    }
    this.demoRound += 1;
    const base = [6.5, 7.6, 8.7][Math.min(this.demoRound - 1, 2)];
    const r1 = (n: number) => Math.round(n * 10) / 10;
    return JSON.stringify({
      comment: "(연습 모드) 전체 흐름은 좋지만 도입부가 조금 약해요.",
      scores: { 도입부: base, 구성: r1(base + 0.2), 정확성: base, "의료광고 준수": r1(base + 0.1), "읽기 편함": r1(base - 0.1), 마무리: base },
      strengths: ["말투가 친근함"],
      fixes: [{ where: "첫 문단", why: "궁금증이 약함", how: "질문으로 시작하기" }],
      fact_check: ["(연습 모드 예시) 수면 무호흡 관련 통계 수치"],
      no_major_changes: base >= 8.5,
    });
  }
}

export class UserFacingError extends Error {}

/** API 오류를 일반인이 이해할 수 있는 말로 바꾼다. */
export function friendlyError(e: unknown): string {
  if (e instanceof UserFacingError) return e.message;
  const msg = e instanceof Error ? e.message : String(e);
  const low = msg.toLowerCase();
  const who = e instanceof Anthropic.APIError ? "Claude" : e instanceof OpenAI.APIError ? "GPT" : "";
  const status = (e as { status?: number })?.status;
  let hint: string;
  if (low.includes("credit balance") || low.includes("quota")) hint = `${who} API 크레딧이 부족합니다. 결제 페이지에서 충전 상태를 확인해 주세요.`;
  else if (status === 401 || low.includes("api key") || low.includes("authentication")) hint = `${who} API 키가 올바르지 않습니다. 서버 .env 의 키를 확인해 주세요.`;
  else if (status === 404 || (low.includes("model") && (low.includes("not found") || low.includes("does not exist"))))
    hint = `${who} 모델 이름을 쓸 수 없습니다. 설정에서 모델 이름을 확인해 주세요.`;
  else if (status === 429) hint = `${who} 요청이 너무 잦습니다. 1~2분 뒤 다시 시도해 주세요.`;
  else if (low.includes("timeout") || low.includes("connection")) hint = "AI 서버와 연결이 불안정합니다. 잠시 뒤 다시 시도해 주세요.";
  else hint = "예상하지 못한 오류입니다. 아래 원문을 개발 담당자에게 전달해 주세요.";
  return `${hint}\n\n[원문] ${msg.slice(0, 600)}`;
}

/* ── 도우미 ── */
function parseWriter(text: string): { draft: string; memo: string } {
  const m = text.match(/===\s*원고\s*===\s*([\s\S]*?)\s*===\s*수정메모\s*===\s*([\s\S]*)/);
  return m ? { draft: m[1].trim(), memo: m[2].trim() } : { draft: text.trim(), memo: "(수정메모 없음)" };
}

function parseEditor(text: string): Feedback {
  let fb: Omit<Feedback, "average">;
  try {
    const m = text.match(/\{[\s\S]*\}/);
    const raw = JSON.parse(m ? m[0] : text);
    fb = {
      scores: raw.scores && typeof raw.scores === "object" ? raw.scores : {},
      strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
      fixes: Array.isArray(raw.fixes) ? raw.fixes : [],
      fact_check: Array.isArray(raw.fact_check) ? raw.fact_check : [],
      no_major_changes: Boolean(raw.no_major_changes),
      comment: typeof raw.comment === "string" ? raw.comment : undefined,
    };
  } catch {
    fb = {
      scores: {},
      strengths: [],
      fixes: [{ where: "전체", why: "편집자 응답 형식 오류", how: text.slice(0, 1000) }],
      fact_check: [],
      no_major_changes: false,
    };
  }
  const nums = Object.values(fb.scores).map(Number).filter((n) => Number.isFinite(n));
  const average = nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100 : 0;
  return { ...fb, average };
}

export function formatFeedback(fb: Feedback): string {
  const lines = fb.comment ? [`[총평] ${fb.comment}`, ""] : [];
  lines.push("[점수]", ...Object.entries(fb.scores).map(([k, v]) => `- ${k}: ${v}`), `- 평균: ${fb.average}`);
  lines.push("", "[잘된 점 - 유지할 것]", ...fb.strengths.map((s) => `- ${s}`));
  lines.push("", "[수정 지시]", ...fb.fixes.map((f, i) => `${i + 1}. 위치: ${f.where} / 이유: ${f.why} / 방법: ${f.how}`));
  if (fb.fact_check.length) lines.push("", "[사실 확인 필요]", ...fb.fact_check.map((s) => `- ${s}`));
  return lines.join("\n");
}

const rubricText = (r: Record<string, string>) => Object.entries(r).map(([k, v]) => `- ${k}: ${v}`).join("\n");

/* ── 메인 흐름 ── */
export async function runSession(job: Job, say: Say, typing: Typing) {
  return job.mode === "loop" ? runLoop(job, say, typing) : runDebate(job, say, typing);
}

async function runLoop(job: Job, say: Say, typing: Typing) {
  const writer: Agent = job.writer === "gpt" ? "gpt" : "claude";
  const editor: Agent = writer === "claude" ? "gpt" : "claude";
  const target = Number.isFinite(job.targetScore) ? Number(job.targetScore) : DEFAULTS.targetScore;
  const maxRev = Number.isInteger(job.maxRevisions) ? Number(job.maxRevisions) : DEFAULTS.maxRevisions;
  const models = { claude: job.claudeModel || DEFAULTS.claudeModel, gpt: job.gptModel || DEFAULTS.gptModel };
  const ai = new AI(Boolean(job.demo), models);

  const brief = job.brief.trim();
  const rubric = RUBRICS[job.kind];
  const original = (job.original || "").trim();
  const instruction = (job.instruction || "").trim();
  const reference = (job.reference || "").trim().slice(0, REFERENCE_LIMIT);
  const refBlock = reference ? `[참고 예시 글 - 말투와 구성을 참고할 것, 베끼지 말 것]\n${reference}\n\n` : "";

  await say(
    "system",
    "status",
    `${KIND_LABEL[job.kind]} · 작가 ${AGENT_NAME[writer]} · 편집자 ${AGENT_NAME[editor]} · 목표 ${target}점 · 최대 수정 ${maxRev}회` +
      (job.demo ? " · 연습 모드" : "")
  );

  const write = async (prompt: string, label: string, version: number) => {
    typing(writer, label);
    const out = parseWriter(await ai.ask(writer, WRITER_SYSTEM, prompt));
    await say(writer, "draft", out.draft, { version, memo: out.memo, role: "writer", model: models[writer] });
    return out;
  };

  // ① 시작 원고
  let cur: { draft: string; memo: string };
  if (original && instruction) {
    cur = await write(
      `[의뢰서]\n${brief}\n\n${refBlock}[현재 원고]\n${original}\n\n[사용자 추가 요청]\n${instruction}\n\n추가 요청을 반영해서 원고를 수정해줘.`,
      "요청하신 내용을 반영하는 중",
      1
    );
  } else if (original) {
    cur = { draft: original, memo: "사용자가 직접 쓴 원본" };
    await say("user", "draft", original, { version: 1, memo: cur.memo, role: "original" });
  } else {
    cur = await write(`[의뢰서]\n${brief}\n\n${refBlock}위 조건으로 첫 초안을 써줘.`, "초안을 쓰는 중", 1);
  }

  let version = 1;
  let revision = 0;
  let prevFixes = "";
  const scores: number[] = [];
  let fb: Feedback;
  let stopReason: string;
  for (;;) {
    // ② 편집자 채점 (매번 원래 의뢰서를 함께 보냄)
    typing(editor, `${version}번째 원고를 채점하는 중`);
    fb = parseEditor(
      await ai.ask(
        editor,
        EDITOR_SYSTEM,
        `[의뢰서]\n${brief}\n\n[채점 기준표]\n${rubricText(rubric)}\n\n${refBlock}` +
          (prevFixes ? `[지난번 수정 지시 - 반영됐는지 확인할 것]\n${prevFixes}\n\n` : "") +
          `[작가의 수정메모]\n${cur.memo}\n\n[원고]\n${cur.draft}`,
        true
      )
    );
    scores.push(fb.average);
    await say(editor, "feedback", formatFeedback(fb), { ...fb, version, role: "editor", model: models[editor] });

    // ③ 멈출지 판단
    if (fb.average >= target) { stopReason = `목표 점수(${target}) 달성`; break; }
    if (fb.no_major_changes) { stopReason = "편집자가 '큰 수정 없음' 판단"; break; }
    if (revision >= maxRev) { stopReason = `최대 수정 횟수(${maxRev}회) 도달`; break; }

    // ④ 작가 수정
    revision += 1;
    version += 1;
    prevFixes = formatFeedback(fb);
    cur = await write(
      `[의뢰서]\n${brief}\n\n${refBlock}[현재 원고]\n${cur.draft}\n\n[편집자 피드백]\n${prevFixes}\n\n피드백을 검토해서 원고를 수정해줘.`,
      `${revision}번째 수정을 하는 중`,
      version
    );
  }

  typing(null, "");
  await say("system", "done", stopReason, {
    kind: job.kind, mode: "loop", writer, editor, scores, stop_reason: stopReason,
    tokens: ai.tokens, demo: Boolean(job.demo), final_feedback: fb,
  });
}

/* ── 토론 모드 ── */
async function runDebate(job: Job, say: Say, typing: Typing) {
  const target = Number.isFinite(job.targetScore) ? Number(job.targetScore) : DEFAULTS.targetScore;
  const rounds = Number.isInteger(job.debateRounds) ? Math.max(1, Math.min(4, Number(job.debateRounds))) : DEFAULTS.debateRounds;
  const models = { claude: job.claudeModel || DEFAULTS.claudeModel, gpt: job.gptModel || DEFAULTS.gptModel };
  const ai = new AI(Boolean(job.demo), models);
  const lead: Agent = job.writer === "gpt" ? "gpt" : "claude"; // 동점일 때 최종 정리 담당
  const other = (a: Agent): Agent => (a === "claude" ? "gpt" : "claude");
  const both: Agent[] = ["claude", "gpt"];

  const brief = job.brief.trim();
  const rubric = RUBRICS[job.kind];
  const original = (job.original || "").trim();
  const instruction = (job.instruction || "").trim();
  const reference = (job.reference || "").trim().slice(0, REFERENCE_LIMIT);
  const refBlock = reference ? `[참고 예시 글 - 말투와 구성을 참고할 것, 베끼지 말 것]\n${reference}\n\n` : "";
  const head = `[의뢰서]\n${brief}\n\n${refBlock}`;

  await say(
    "system",
    "status",
    `${KIND_LABEL[job.kind]} · Claude × GPT 토론 · ${rounds}라운드 · 목표 ${target}점` + (job.demo ? " · 연습 모드" : "")
  );

  const version: Record<Agent, number> = { claude: 0, gpt: 0 };
  const drafts = {} as Record<Agent, { draft: string; memo: string }>;
  const write = async (who: Agent, prompt: string, label: string, role = "debater") => {
    const out = parseWriter(await ai.ask(who, DEBATER_SYSTEM, prompt));
    version[who] += 1;
    return { who, out, meta: { version: version[who], memo: out.memo, role, label, model: models[who] } };
  };
  /** 두 AI의 작업을 동시에 돌리고, 화면에는 Claude → GPT 순서로 올린다. */
  const pair = async <T,>(fn: (who: Agent) => Promise<T>) => {
    const [c, g] = await Promise.all(both.map(fn));
    return { claude: c, gpt: g } as Record<Agent, T>;
  };

  // ① 각자 초안 (사용자 원고가 있으면 각자 그 원고를 다듬은 버전)
  let start: string;
  if (original && instruction) start = `[현재 원고]\n${original}\n\n[사용자 추가 요청]\n${instruction}\n\n추가 요청을 반영해서 원고를 수정해줘.`;
  else if (original) {
    await say("user", "draft", original, { version: 0, memo: "사용자가 직접 쓴 원본", role: "original" });
    start = `[사용자 원고]\n${original}\n\n글쓴이의 목소리와 핵심 내용을 살리면서, 네가 생각하는 가장 좋은 방향으로 다듬어줘.`;
  } else start = "위 조건으로 첫 초안을 써줘. 상대 AI도 같은 의뢰로 따로 쓰고 있으니, 네 관점을 분명히 담아라.";
  typing(null, "Claude와 GPT가 각자 초안을 쓰는 중");
  const first = await pair((who) => write(who, head + start, `${AGENT_NAME[who]}의 초안`));
  for (const who of both) {
    drafts[who] = first[who].out;
    await say(who, "draft", first[who].out.draft, first[who].meta);
  }

  // ② 서로 비판 → 각자 수정 (라운드 반복)
  // critique[x] = x의 원고에 대해 상대가 준 마지막 평가
  const critique = {} as Record<Agent, Feedback>;
  const history: Record<Agent, number[]> = { claude: [], gpt: [] };
  let round = 0;
  let stopReason = "";
  for (;;) {
    round += 1;
    typing(null, `${round}라운드 · 서로의 원고를 평가하는 중`);
    const fbs = await pair(async (author) => {
      const critic = other(author);
      const prev = critique[author]
        ? `[지난 라운드 너의 지적]\n${formatFeedback(critique[author])}\n\n[상대의 답변 (수정메모)]\n${drafts[author].memo}\n\n`
        : "";
      return parseEditor(
        await ai.ask(
          critic,
          CRITIC_SYSTEM,
          `${head}[채점 기준표]\n${rubricText(rubric)}\n\n` +
            `[참고: 네가 쓴 원고]\n${drafts[critic].draft}\n\n${prev}[평가할 상대(${AGENT_NAME[author]}) 원고]\n${drafts[author].draft}`,
          true
        )
      );
    });
    for (const author of both) {
      critique[author] = fbs[author];
      history[author].push(fbs[author].average);
      await say(other(author), "feedback", formatFeedback(fbs[author]), {
        ...fbs[author], version: version[author], round, target: author, role: "critic",
        label: `${AGENT_NAME[author]} 원고 평가 · ${round}라운드`, model: models[other(author)],
      });
    }

    const passed = both.every((a) => critique[a].average >= target || critique[a].no_major_changes);
    if (passed) { stopReason = `${round}라운드에서 두 원고 모두 기준 통과`; break; }
    if (round >= rounds) { stopReason = `토론 ${rounds}라운드 완료`; break; }

    typing(null, `${round}라운드 · 지적을 받아들일지 반박할지 정하며 고치는 중`);
    const revs = await pair((who) =>
      write(
        who,
        `${head}[현재 네 원고]\n${drafts[who].draft}\n\n[상대(${AGENT_NAME[other(who)]})의 평가]\n${formatFeedback(critique[who])}\n\n` +
          "지적마다 수용할지 반박할지 판단해서 원고를 수정해줘.",
        `${AGENT_NAME[who]}의 ${round}라운드 수정본`
      )
    );
    for (const who of both) {
      drafts[who] = revs[who].out;
      await say(who, "draft", revs[who].out.draft, revs[who].meta);
    }
  }

  // ③ 더 높게 평가받은 쪽이 두 원고를 합쳐 최종본 작성
  const ca = critique.claude.average;
  const ga = critique.gpt.average;
  const synth: Agent = ca === ga ? lead : ca > ga ? "claude" : "gpt";
  const rev = other(synth);
  await say(
    "system",
    "status",
    `평가 점수 Claude ${ca} · GPT ${ga} → ${AGENT_NAME[synth]}가 두 원고의 장점을 모아 최종 정리, ${AGENT_NAME[rev]}가 최종 검토`
  );
  typing(synth, "두 원고의 좋은 점을 모아 최종본을 쓰는 중");
  const merged = await write(
    synth,
    `${head}[네 원고]\n${drafts[synth].draft}\n\n[네 원고에 대한 ${AGENT_NAME[rev]}의 평가]\n${formatFeedback(critique[synth])}\n\n` +
      `[상대(${AGENT_NAME[rev]}) 원고]\n${drafts[rev].draft}\n\n[상대 원고에 대한 너의 평가]\n${formatFeedback(critique[rev])}\n\n` +
      "토론을 마무리한다. 네 원고를 뼈대로, 상대 원고에서 더 나은 부분(도입, 표현, 예시, 구성 등)을 가져와 하나의 최종 원고로 합쳐줘. " +
      "수정메모에는 상대 원고에서 무엇을 가져왔는지, 남은 지적은 어떻게 처리했는지 적어줘.",
    "최종 합본",
    "synthesizer"
  );
  let final = merged.out;
  await say(synth, "draft", final.draft, merged.meta);

  // ④ 상대가 최종 검토, 기준 미달이면 한 번 더 다듬기
  typing(rev, "최종 원고를 검토하는 중 (의료광고 기준 포함)");
  const review = parseEditor(
    await ai.ask(
      rev,
      `${EDITOR_SYSTEM}\n\n이번은 게시 전 최종 검토다. 특히 의료광고 기준 위반과 사실 확인이 필요한 문장을 빠짐없이 찾아라.`,
      `${head}[채점 기준표]\n${rubricText(rubric)}\n\n[작가의 수정메모]\n${final.memo}\n\n[최종 원고]\n${final.draft}`,
      true
    )
  );
  await say(rev, "feedback", formatFeedback(review), {
    ...review, version: version[synth], role: "reviewer", label: "최종 검토", model: models[rev],
  });
  if (review.average >= target || review.no_major_changes) {
    stopReason += ` · 최종 검토 ${review.average}점 통과`;
  } else {
    typing(synth, "최종 검토를 반영해 마무리하는 중");
    const polished = await write(
      synth,
      `${head}[현재 원고]\n${final.draft}\n\n[${AGENT_NAME[rev]}의 최종 검토]\n${formatFeedback(review)}\n\n최종 검토를 반영해 원고를 마무리해줘.`,
      "최종 원고",
      "synthesizer"
    );
    final = polished.out;
    await say(synth, "draft", final.draft, polished.meta);
    stopReason += ` · 최종 검토(${review.average}점) 반영해 마무리`;
  }

  typing(null, "");
  await say("system", "done", stopReason, {
    kind: job.kind, mode: "debate", writer: synth, editor: rev, scores: [review.average], stop_reason: stopReason,
    trajectory: `Claude ${history.claude.join(" → ")} · GPT ${history.gpt.join(" → ")} · 최종 검토 ${review.average}`,
    tokens: ai.tokens, demo: Boolean(job.demo), final_feedback: review,
  });
}
