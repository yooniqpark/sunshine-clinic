"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import s from "./writing.module.css";

/* ────────────────────────────────────────────────────────────
   글쓰기 도우미 채팅 화면 — Claude(작가)와 GPT(편집자)의 대화를 보여준다.
   ──────────────────────────────────────────────────────────── */

type Agent = "claude" | "gpt";
type Kind = "youtube" | "blog";
type Msg = { id: number; role: string; type: string; content: string; meta: Record<string, unknown>; createdAt: string };
type Conv = { id: string; title: string; kind: string; updatedAt: string };
type Job = { status: "running" | "idle"; who: Agent | null; text: string };
type Att = { as: "reference" | "original"; name: string; text: string };
type Fb = {
  scores?: Record<string, number>; strengths?: string[]; fact_check?: string[];
  fixes?: { where?: string; why?: string; how?: string }[]; average?: number; version?: number;
};
type Opts = { demo: boolean; writer: Agent; targetScore: number; maxRevisions: number; claudeModel: string; gptModel: string };

const API = "/api/admin/writing";
const NAME: Record<Agent, string> = { claude: "Claude", gpt: "GPT" };
const ROLE: Record<string, string> = { writer: "작가", editor: "편집자" };
const KIND: Record<string, string> = { youtube: "🎬 유튜브 대본", blog: "📝 블로그" };
const EXAMPLES: { kind: Kind; label: string; text: string }[] = [
  { kind: "youtube", label: "유튜브 대본", text: "아침에 일어나자마자 피곤한 이유 3가지와 해결법\n대상: 30~40대 직장인 / 분량: 8분 / 말투: 친근한 존댓말\n첫 문장은 질문으로 시작해줘" },
  { kind: "blog", label: "블로그", text: "처음 피부과 레이저 시술 받기 전에 알아야 할 5가지\n대상: 시술이 처음인 20~30대 / 2,000자 / 차분하고 신뢰감 있게\n검색 키워드: 레이저 시술 주의사항, 과장 표현 금지" },
  { kind: "blog", label: "블로그", text: "환절기 피부 건조, 집에서 할 수 있는 관리 4가지\n대상: 피부 고민 많은 30대 / 1,500자 / 밝고 친근하게" },
];

/* ── 아이콘 (직접 그린 단순한 모양) ── */
function Avatar({ who, small }: { who: Agent; small?: boolean }) {
  return (
    <div className={`${s.av} ${who === "claude" ? s.avclaude : s.avgpt} ${small ? s.avSmall : ""}`} aria-hidden>
      {who === "claude" ? (
        // Claude: 펜촉에서 퍼지는 빛 (작가)
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2" />
        </svg>
      ) : (
        // GPT: 육각형 + 체크 (편집·검토)
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4z" />
          <path d="m8.6 12.2 2.4 2.4 4.6-4.8" />
        </svg>
      )}
    </div>
  );
}

/* ── 간단한 마크다운 (#, ##, -, 1., **굵게**) ── */
function inline(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));
}
function Markdown({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let list: { tag: "ul" | "ol"; items: ReactNode[] } | null = null;
  const flush = () => {
    if (!list) return;
    const L = list.tag;
    out.push(<L key={out.length}>{list.items}</L>);
    list = null;
  };
  text.split("\n").forEach((raw, i) => {
    const line = raw.trimEnd();
    let m: RegExpMatchArray | null;
    if (!line.trim()) return flush();
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) {
      flush();
      const H = (["h1", "h2", "h3"] as const)[m[1].length - 1];
      out.push(<H key={`h${i}`}>{inline(m[2])}</H>);
    } else if ((m = line.match(/^\s*[-*•]\s+(.*)/)) || (m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
      const tag = /^\s*\d/.test(line) ? "ol" : "ul";
      if (!list || list.tag !== tag) { flush(); list = { tag, items: [] }; }
      list.items.push(<li key={i}>{inline(m[1])}</li>);
    } else {
      flush();
      out.push(<p key={`p${i}`}>{inline(line)}</p>);
    }
  });
  flush();
  return <>{out}</>;
}

function timeOf(iso: string) {
  const d = new Date(iso);
  return isNaN(+d) ? "" : d.toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function readOpts(): Partial<Opts> {
  try { return JSON.parse(localStorage.getItem("writing-opts") || "{}"); } catch { return {}; }
}
function saveOpts(o: Opts) {
  try { localStorage.setItem("writing-opts", JSON.stringify(o)); } catch {}
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const j = await res.json().catch(() => ({ error: "응답을 읽지 못했어요" }));
  if (!res.ok || j.error) throw new Error(j.error || "오류가 났어요");
  return j as T;
}

async function copyText(text: string, btn: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(text);
    const o = btn.textContent;
    btn.textContent = "✓ 복사됨";
    setTimeout(() => (btn.textContent = o), 1400);
  } catch {
    alert("복사에 실패했어요. '전체 보기'를 누른 뒤 직접 드래그해서 복사해 주세요.");
  }
}

/* ── 원고 카드 ── */
function DraftCard({ m, convId, title }: { m: Msg; convId: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <span>📄 {title}</span>
        <span>
          <button className={s.linkBtn} onClick={(e) => copyText(m.content, e.currentTarget)}>복사</button>
          <a className={s.linkBtn} href={`${API}/${convId}/docx?message=${m.id}`}>워드</a>
        </span>
      </div>
      <div className={`${s.doc} ${open ? "" : s.clamp}`}><Markdown text={m.content} /></div>
      <button className={s.expand} onClick={() => setOpen(!open)}>{open ? "접기 ▴" : "전체 보기 ▾"}</button>
    </div>
  );
}

function FeedbackCard({ f, who }: { f: Fb; who: Agent }) {
  const color = who === "claude" ? "var(--claude)" : "var(--gpt)";
  return (
    <div className={s.card}>
      <div className={s.fb}>
        <div className={s.avg}><strong>{f.average}</strong><span>/ 10 · {f.version}번째 원고 평균</span></div>
        <div className={s.bars}>
          {Object.entries(f.scores ?? {}).map(([k, v]) => (
            <div key={k} className={s.bar}>
              <span>{k}</span>
              <div className={s.track}><div className={s.fill} style={{ width: `${Math.max(0, Math.min(10, +v)) * 10}%`, background: color }} /></div>
              <em>{v}</em>
            </div>
          ))}
        </div>
        {!!f.strengths?.length && (
          <div><h4>👍 잘된 점</h4><ul>{f.strengths.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        )}
        {!!f.fixes?.length && (
          <div><h4>✏️ 고칠 점</h4><ol>{f.fixes.map((x, i) => <li key={i}>{x.how}<br /><small>{x.where} · {x.why}</small></li>)}</ol></div>
        )}
        {!!f.fact_check?.length && (
          <div className={s.warnBox}><b>⚠️ 사실 확인 필요</b><ul>{f.fact_check.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        )}
      </div>
    </div>
  );
}

function MessageView({ m, convId, lastDraft }: { m: Msg; convId: string; lastDraft?: Msg }) {
  if (m.role === "user" && m.type === "request") {
    const atts = (m.meta.attachments as { as: string; name: string; chars: number }[] | undefined) ?? [];
    return (
      <div className={`${s.msg} ${s.user}`}>
        <div className={s.userCol}>
          {m.content && <div className={s.bubble}>{m.content}</div>}
          {!!atts.length && (
            <div className={s.attList}>
              {atts.map((a, i) => (
                <span key={i} className={s.att}>{a.as === "original" ? "📄 내 원고" : "📎 참고 글"} · {a.name} · {a.chars.toLocaleString()}자</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (m.role === "user" && m.type === "draft") {
    return (
      <div className={`${s.msg} ${s.user}`}>
        <div className={s.userCol} style={{ width: "80%" }}><DraftCard m={m} convId={convId} title="보내주신 원고" /></div>
      </div>
    );
  }
  if (m.type === "status") return <div className={s.sys}>{m.content}</div>;
  if (m.type === "error") return <div className={s.errBox}>⚠️ {m.content}</div>;
  if (m.type === "done") {
    const scores = (m.meta.scores as number[] | undefined) ?? [];
    return (
      <div className={s.done}>
        <strong>✅ 완성됐어요 · {m.content}</strong>
        <div className={s.traj}>점수 {scores.join(" → ")}</div>
        <div className={s.btns}>
          <a className={`${s.btn} ${s.btnDark}`} href={`${API}/${convId}/docx`}>📄 최종 원고 워드 받기</a>
          {lastDraft && <button className={s.btn} onClick={(e) => copyText(lastDraft.content, e.currentTarget)}>📋 최종 원고 복사</button>}
        </div>
        <div className={s.tip}>마음에 안 드는 부분이 있으면 아래에 이어서 요청해 보세요</div>
      </div>
    );
  }
  const who = (m.role === "gpt" ? "gpt" : "claude") as Agent;
  const head = (
    <div className={s.who}>
      <b>{NAME[who]}</b>
      <span className={`${s.role} ${who === "claude" ? s.roleclaude : s.rolegpt}`}>{ROLE[m.meta.role as string] ?? ""}</span>
      <span className={s.time}>{timeOf(m.createdAt)}</span>
    </div>
  );
  if (m.type === "draft") {
    const memo = m.meta.memo as string | undefined;
    return (
      <div className={s.msg}>
        <Avatar who={who} />
        <div className={s.body}>
          {head}
          {memo && memo !== "첫 초안" && <p className={s.memo}>{memo}</p>}
          <DraftCard m={m} convId={convId} title={`${m.meta.version}번째 원고`} />
        </div>
      </div>
    );
  }
  if (m.type === "feedback") {
    return (
      <div className={s.msg}>
        <Avatar who={who} />
        <div className={s.body}>{head}<FeedbackCard f={m.meta as Fb} who={who} /></div>
      </div>
    );
  }
  return null;
}

/* ── 메인 ── */
type Props = {
  initialId: string | null;
  initialConvs: Conv[];
  keys: { claude: boolean; gpt: boolean };
  defaults: Omit<Opts, "demo">;
};

const noop = () => () => {};

export default function WritingChat(props: Props) {
  // 설정을 브라우저(localStorage)에 기억하므로, 서버 화면과 어긋나지 않게 브라우저에서만 그린다
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <div className={s.wrap} />;
  return <Chat {...props} />;
}

function Chat({ initialId, initialConvs, keys, defaults }: Props) {
  const [convs, setConvs] = useState<Conv[]>(initialConvs);
  const [convId, setConvId] = useState<string | null>(initialId);
  const [conv, setConv] = useState<{ title: string; kind: string } | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [job, setJob] = useState<Job>({ status: "idle", who: null, text: "" });
  const [tick, setTick] = useState(0);
  const [input, setInput] = useState("");
  const [kind, setKind] = useState<Kind>("youtube");
  const [atts, setAtts] = useState<Att[]>([]);
  const [sending, setSending] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [modal, setModal] = useState<"att" | "set" | null>(null);
  const [attAs, setAttAs] = useState<Att["as"]>("reference");
  const [attText, setAttText] = useState("");
  const [attName, setAttName] = useState("");
  const [opts, setOpts] = useState<Opts>(() => {
    const o = { ...defaults, demo: false, ...readOpts() } as Opts;
    if (!keys.claude || !keys.gpt) o.demo = true; // 키가 없으면 연습 모드
    return o;
  });
  const lastId = useRef(0);
  const forceScroll = useRef(true);
  const atBottom = useRef(true); // 사용자가 맨 아래를 보고 있는지 (새 메시지가 오기 전 기준)
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadList = useCallback(async () => {
    const j = await api<{ conversations: Conv[] }>(API);
    setConvs(j.conversations);
  }, []);

  useEffect(() => saveOpts(opts), [opts]);

  /** 다른 대화로 이동 (null = 새 대화) */
  function openConv(id: string | null) {
    if (id === convId) return;
    lastId.current = 0;
    forceScroll.current = true;
    setMsgs([]);
    setConv(null);
    setJob({ status: "idle", who: null, text: "" });
    setConvId(id);
    setSideOpen(false);
    history.replaceState(null, "", id ? `?c=${id}` : location.pathname);
  }

  // 새 메시지 가져오기 (작업 중이면 1.2초마다)
  useEffect(() => {
    if (!convId) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const j = await api<{ conversation: { title: string; kind: string }; messages: Msg[]; job: Job }>(
          `${API}/${convId}?after=${lastId.current}`
        );
        if (!alive) return;
        setConv(j.conversation);
        if (j.messages.length) {
          lastId.current = j.messages[j.messages.length - 1].id;
          setMsgs((prev) => {
            const seen = new Set(prev.map((m) => m.id));
            return [...prev, ...j.messages.filter((m) => !seen.has(m.id))];
          });
        }
        setJob(j.job);
        if (j.job.status === "running") timer = setTimeout(poll, 1200);
        else loadList().catch(() => {});
      } catch (e) {
        if (!alive) return;
        if (lastId.current === 0) { setConvId(null); history.replaceState(null, "", location.pathname); return; }
        setJob({ status: "idle", who: null, text: "" });
        alert(e instanceof Error ? e.message : "연결이 끊겼어요");
      }
    };
    poll();
    return () => { alive = false; clearTimeout(timer); };
  }, [convId, tick, loadList]);

  // 스크롤: 맨 아래를 보고 있었거나, 방금 보냈/열었으면 새 메시지를 따라 아래로
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !msgs.length) return;
    if (forceScroll.current || atBottom.current) {
      el.scrollTop = el.scrollHeight;
      atBottom.current = true;
      forceScroll.current = false;
    }
  }, [msgs, job]);

  // 입력창 높이 자동
  useEffect(() => {
    const t = inputRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 220) + "px";
  }, [input]);

  const busy = sending || job.status === "running";
  const canSend = !busy && (input.trim() !== "" || atts.some((a) => a.as === "original"));

  async function send() {
    if (!canSend) return;
    setSending(true);
    try {
      const j = await api<{ conversationId: string }>(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, text: input, kind, attachments: atts, settings: opts }),
      });
      setInput("");
      setAtts([]);
      forceScroll.current = true;
      if (j.conversationId !== convId) openConv(j.conversationId);
      else setTick((t) => t + 1);
      loadList().catch(() => {});
    } catch (e) {
      alert(e instanceof Error ? e.message : "보내지 못했어요");
    } finally {
      setSending(false);
    }
  }

  function newChat() {
    openConv(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function del(id: string) {
    if (!confirm("이 대화 기록을 지울까요? 되돌릴 수 없어요.")) return;
    try {
      await api(`${API}/${id}`, { method: "DELETE" });
      if (id === convId) newChat();
      loadList().catch(() => {});
    } catch (e) {
      alert(e instanceof Error ? e.message : "지우지 못했어요");
    }
  }

  async function loadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const j = await api<{ text: string }>(`${API}/extract`, { method: "POST", body: fd });
      setAttText(j.text);
      setAttName(file.name);
    } catch (e) {
      alert(e instanceof Error ? e.message : "파일을 읽지 못했어요");
    }
  }

  function addAtt() {
    const text = attText.trim();
    if (!text) return alert("첨부할 글을 넣어 주세요.");
    setAtts((a) => [...a.filter((x) => x.as !== attAs), { as: attAs, name: attName || "붙여넣은 글", text }]);
    setModal(null);
    inputRef.current?.focus();
  }

  const lastDraft = [...msgs].reverse().find((m) => m.type === "draft");
  const writer = opts.writer;
  const editor: Agent = writer === "claude" ? "gpt" : "claude";

  return (
    <div className={s.wrap}>
      {/* 사이드바: 대화 기록 */}
      <aside className={`${s.side} ${sideOpen ? s.sideOpen : ""}`}>
        <button className={s.newBtn} onClick={newChat}>＋ 새 대화</button>
        <div className={s.histLabel}>대화 기록</div>
        <nav className={s.hist}>
          {convs.length === 0 && <div className={s.histEmpty}>아직 대화가 없어요</div>}
          {convs.map((c) => (
            <div key={c.id} className={`${s.histItem} ${c.id === convId ? s.active : ""}`} onClick={() => openConv(c.id)}>
              <span>{c.kind === "youtube" ? "🎬" : "📝"}</span>
              <span className={s.histTitle}>{c.title}</span>
              <button className={s.del} aria-label="삭제" title="삭제" onClick={(e) => { e.stopPropagation(); del(c.id); }}>✕</button>
            </div>
          ))}
        </nav>
        <div className={s.sideFoot}>
          <button onClick={() => setModal("set")}>
            ⚙️ 설정
            <span style={{ marginLeft: "auto", display: "inline-flex", gap: 4 }}>
              <span className={s.dot} style={{ background: keys.claude ? "var(--gpt)" : "var(--err)" }} />
              <span className={s.dot} style={{ background: keys.gpt ? "var(--gpt)" : "var(--err)" }} />
            </span>
          </button>
        </div>
      </aside>

      {/* 본문 */}
      <div className={s.main} onClick={() => sideOpen && setSideOpen(false)}>
        <div className={s.topbar}>
          <button className={s.menu} aria-label="대화 기록" onClick={(e) => { e.stopPropagation(); setSideOpen(!sideOpen); }}>☰</button>
          <h2>{convId ? conv?.title ?? "" : "새 대화"}</h2>
          {conv && <span className={s.chip}>{KIND[conv.kind]}</span>}
          {opts.demo && <span className={`${s.chip} ${s.demoChip}`}>연습 모드</span>}
        </div>

        <div
          className={s.scroll}
          ref={scrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 220;
          }}
        >
          {!convId ? (
            <div className={s.hero}>
              <div className={s.pair}><Avatar who="claude" /><Avatar who="gpt" /></div>
              <h3>무엇을 써드릴까요?</h3>
              <p>{NAME[writer]}가 쓰고, {NAME[editor]}가 고칠 점을 짚어주며 함께 완성해요.</p>
              <div className={s.examples}>
                {EXAMPLES.map((x, i) => (
                  <button key={i} className={s.ex} onClick={() => { setKind(x.kind); setInput(x.text); inputRef.current?.focus(); }}>
                    <small>{x.label}</small>{x.text.split("\n")[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={s.thread}>
              {msgs.map((m) => <MessageView key={m.id} m={m} convId={convId} lastDraft={lastDraft} />)}
              {job.status === "running" && (
                <div className={s.typing}>
                  {job.who && <Avatar who={job.who} />}
                  <span>{job.who && <><b>{NAME[job.who]}</b>가 </>}{job.text || "준비하는 중"}</span>
                  <span className={s.dots}><i /><i /><i /></span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={s.composerWrap}>
          <div className={s.composer}>
            {!!atts.length && (
              <div className={s.attachments}>
                {atts.map((a, i) => (
                  <span key={i} className={s.att}>
                    {a.as === "original" ? "📄 내 원고" : "📎 참고 글"} · {a.name} · {a.text.length.toLocaleString()}자
                    <button aria-label="첨부 빼기" onClick={() => setAtts(atts.filter((_, j) => j !== i))}>✕</button>
                  </span>
                ))}
              </div>
            )}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
              }}
              placeholder={convId ? "이어서 수정 요청 (예: 더 짧게, 도입부를 더 강하게)" : "주제, 대상, 분량, 말투를 자유롭게 적어주세요"}
            />
            <div className={s.tools}>
              {!convId && (
                <div className={s.seg}>
                  <button className={kind === "youtube" ? s.on : ""} onClick={() => setKind("youtube")}>🎬 유튜브</button>
                  <button className={kind === "blog" ? s.on : ""} onClick={() => setKind("blog")}>📝 블로그</button>
                </div>
              )}
              <button className={s.iconBtn} onClick={() => { setAttText(""); setAttName(""); setModal("att"); }}>📎 글 첨부</button>
              <button className={s.send} aria-label="보내기" disabled={!canSend} onClick={send}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
          <div className={s.footNote}>Enter 보내기 · Shift+Enter 줄바꿈 · AI가 쓴 사실 정보와 의료 표현은 꼭 직접 확인하세요</div>
        </div>
      </div>

      {/* 첨부 모달 */}
      {modal === "att" && (
        <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className={s.modal} role="dialog" aria-modal="true" aria-label="글 첨부하기">
            <h3>글 첨부하기</h3>
            <div className={s.pick}>
              <button className={attAs === "reference" ? s.on : ""} onClick={() => setAttAs("reference")}><b>참고 예시 글</b><span>이 글의 말투·구성을 따라 써요</span></button>
              <button className={attAs === "original" ? s.on : ""} onClick={() => setAttAs("original")}><b>내 원고</b><span>이 글을 채점하고 다듬어요</span></button>
            </div>
            <label htmlFor="attText">내용 <span className={s.hint}>붙여넣거나 파일(.txt, .docx)을 불러오세요</span></label>
            <textarea id="attText" value={attText} onChange={(e) => setAttText(e.target.value)} placeholder="여기에 글을 붙여넣으세요" autoFocus />
            <div className={s.row}>
              <button className={s.btn} style={{ marginRight: "auto" }} onClick={() => fileRef.current?.click()}>📂 파일 불러오기</button>
              <button className={s.btn} onClick={() => setModal(null)}>취소</button>
              <button className={`${s.btn} ${s.btnDark}`} onClick={addAtt}>첨부</button>
            </div>
            <input ref={fileRef} type="file" accept=".txt,.md,.docx" className={s.hidden}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
          </div>
        </div>
      )}

      {/* 설정 모달 */}
      {modal === "set" && (
        <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className={s.modal} role="dialog" aria-modal="true" aria-label="설정">
            <h3>설정</h3>
            <label className={s.toggle} style={{ margin: 0 }}>
              <span><b>연습 모드</b><br /><span className={s.hint}>AI를 부르지 않아 비용 0원. 흐름만 확인해요</span></span>
              <input type="checkbox" checked={opts.demo} onChange={(e) => setOpts({ ...opts, demo: e.target.checked })} />
            </label>
            <label htmlFor="optWriter">작가 역할</label>
            <select id="optWriter" value={opts.writer} onChange={(e) => setOpts({ ...opts, writer: e.target.value as Agent })}>
              <option value="claude">Claude가 쓰고 GPT가 편집</option>
              <option value="gpt">GPT가 쓰고 Claude가 편집</option>
            </select>
            <div className={s.grid2}>
              <div>
                <label htmlFor="optTarget">목표 점수</label>
                <input id="optTarget" type="number" min={5} max={10} step={0.1} value={opts.targetScore}
                  onChange={(e) => setOpts({ ...opts, targetScore: parseFloat(e.target.value) || 8.5 })} />
              </div>
              <div>
                <label htmlFor="optMax">최대 수정 횟수 <span className={s.hint}>많을수록 비용↑</span></label>
                <input id="optMax" type="number" min={0} max={6} step={1} value={opts.maxRevisions}
                  onChange={(e) => setOpts({ ...opts, maxRevisions: Math.max(0, Math.min(6, parseInt(e.target.value, 10) || 0)) })} />
              </div>
            </div>
            <div className={s.grid2}>
              <div>
                <label htmlFor="optClaude">Claude 모델</label>
                <input id="optClaude" type="text" value={opts.claudeModel} onChange={(e) => setOpts({ ...opts, claudeModel: e.target.value.trim() })} />
              </div>
              <div>
                <label htmlFor="optGpt">GPT 모델</label>
                <input id="optGpt" type="text" value={opts.gptModel} onChange={(e) => setOpts({ ...opts, gptModel: e.target.value.trim() })} />
              </div>
            </div>
            <label>API 키 상태 <span className={s.hint}>서버 .env 에서 설정</span></label>
            <div className={s.keyRow}>
              <span>{keys.claude ? "🟢" : "🔴"} Claude {keys.claude ? "연결됨" : "키 없음 (ANTHROPIC_API_KEY)"}</span>
              <span>{keys.gpt ? "🟢" : "🔴"} GPT {keys.gpt ? "연결됨" : "키 없음 (OPENAI_API_KEY)"}</span>
            </div>
            <div className={s.row}><button className={`${s.btn} ${s.btnDark}`} onClick={() => setModal(null)}>완료</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
