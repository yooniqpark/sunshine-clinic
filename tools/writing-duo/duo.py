"""
글쓰기 듀오 엔진: Claude와 GPT가 토론하며(또는 작가·편집자로) 병원 홍보 글을 완성합니다.
화면은 app.py(웹페이지)가 담당하고, 이 파일은 두 AI의 대화 흐름만 담당합니다.

API 크레딧이 아니라 **구독**을 씁니다:
  Claude → Claude Code(`claude`)에 Claude Pro/Max 계정으로 로그인
  GPT    → Codex CLI(`codex`)에 ChatGPT Plus/Pro 계정으로 로그인
"""

import json
import os
import re
import shutil
import subprocess
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent
WORK = HERE / "data" / "work"  # AI 도구를 실행할 빈 폴더 (다른 파일을 건드리지 않도록)


def settings() -> dict:
    """.env 파일의 설정을 읽습니다. (없어도 기본값으로 동작)"""
    load_dotenv(HERE / ".env", override=True)
    return {
        "mode": os.getenv("MODE", "debate").lower(),
        "writer": os.getenv("WRITER", "claude").lower(),
        "claude_model": os.getenv("CLAUDE_MODEL", "").strip(),  # 비우면 구독 기본 모델
        "gpt_model": os.getenv("GPT_MODEL", "").strip(),
        "max_revisions": int(os.getenv("MAX_REVISIONS", "3")),
        "debate_rounds": int(os.getenv("DEBATE_ROUNDS", "2")),
        "target_score": float(os.getenv("TARGET_SCORE", "8.5")),
        "clinic_profile": os.getenv(
            "CLINIC_PROFILE",
            "선샤인의원 — 서울 송파구 잠실 서일빌딩 10층의 피부과 의원 (피부 시술·레이저·보톡스 등)",
        ),
    }


# ─────────────────────────────────────────────
# 로그인 상태 확인 (화면의 초록/빨강 점)
# ─────────────────────────────────────────────
_status_cache: dict = {"at": 0.0, "value": None}


def _run(cmd: list[str], stdin: str | None = None, timeout: int = 30) -> subprocess.CompletedProcess:
    env = dict(os.environ)
    # API 키가 환경에 있으면 구독 대신 크레딧이 쓰이므로 빼고 실행
    for k in ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "OPENAI_API_KEY", "CODEX_API_KEY"):
        env.pop(k, None)
    env.pop("CLAUDECODE", None)  # Claude Code 안에서 실행해도 따로 돌도록
    WORK.mkdir(parents=True, exist_ok=True)
    return subprocess.run(
        cmd, input=(stdin or "").encode("utf-8"), capture_output=True, cwd=WORK, env=env, timeout=timeout,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )


def _out(p: subprocess.CompletedProcess) -> str:
    return (p.stdout.decode("utf-8", "replace") + "\n" + p.stderr.decode("utf-8", "replace")).strip()


def login_status(refresh: bool = False) -> dict:
    """두 도구가 설치·로그인돼 있는지. 매번 확인하면 느려서 30초간 기억합니다."""
    if not refresh and _status_cache["value"] and time.time() - _status_cache["at"] < 30:
        return _status_cache["value"]

    def check_claude() -> dict:
        exe = shutil.which("claude")
        if not exe:
            return {"ok": False, "text": "설치 안 됨 — 설치하기.bat 실행"}
        try:
            p = _run([exe, "auth", "status", "--json"])
            info = json.loads(p.stdout.decode("utf-8", "replace") or "{}")
        except (subprocess.SubprocessError, OSError, json.JSONDecodeError):
            return {"ok": True, "text": "설치됨 (로그인 상태 확인 불가)"}
        if not info.get("loggedIn"):
            return {"ok": False, "text": "로그인 필요 — 로그인하기.bat 실행"}
        if info.get("authMethod") in ("api_key", "apiKey"):
            return {"ok": True, "warn": True, "text": "API 키로 로그인됨 (구독이 아닌 크레딧 사용)"}
        return {"ok": True, "text": "구독 계정 로그인됨"}

    def check_codex() -> dict:
        exe = shutil.which("codex")
        if not exe:
            return {"ok": False, "text": "설치 안 됨 — 설치하기.bat 실행"}
        try:
            text = _out(_run([exe, "login", "status"]))
        except (subprocess.SubprocessError, OSError):
            return {"ok": True, "text": "설치됨 (로그인 상태 확인 불가)"}
        low = text.lower()
        if "not logged in" in low or "logged in" not in low:
            return {"ok": False, "text": "로그인 필요 — 로그인하기.bat 실행"}
        if "api key" in low:
            return {"ok": True, "warn": True, "text": "API 키로 로그인됨 (구독이 아닌 크레딧 사용)"}
        return {"ok": True, "text": "ChatGPT 계정 로그인됨"}

    with ThreadPoolExecutor(2) as ex:
        c, g = ex.submit(check_claude), ex.submit(check_codex)
        value = {"claude": c.result(), "gpt": g.result()}
    _status_cache.update(at=time.time(), value=value)
    return value


# ─────────────────────────────────────────────
# 채점 기준표와 지시문
# ─────────────────────────────────────────────
RUBRICS = {
    "youtube": {
        "도입부": "첫 15초 안에 시청자를 붙잡는가",
        "구성": "흐름이 자연스럽고 이탈 구간이 없는가",
        "정확성": "사실 오류나 과장이 없는가",
        "의료광고 준수": "효과 보장·최상급·후기 남용 등 의료법상 문제 표현이 없는가",
        "말하기 편함": "소리 내어 읽었을 때 자연스러운가",
        "마무리": "구독·댓글 등 행동 유도가 자연스러운가",
    },
    "blog": {
        "도입부": "제목과 첫 문단이 클릭하고 계속 읽게 만드는가",
        "구성": "소제목 구조가 명확하고 훑어보기 쉬운가",
        "정확성": "사실 오류나 과장이 없는가",
        "의료광고 준수": "효과 보장·최상급·후기 남용 등 의료법상 문제 표현이 없는가",
        "읽기 편함": "문장이 짧고 쉬운가",
        "마무리": "검색 키워드 반영과 행동 유도가 있는가",
    },
}
KIND_LABEL = {"youtube": "유튜브 대본", "blog": "블로그"}
NAME = {"claude": "Claude", "gpt": "GPT"}


def medical_ad_rules(clinic: str) -> str:
    """병원 홍보 글이 지켜야 할 의료광고 기준 (의료법 제56조 요지)"""
    return f"""[병원 정보]
{clinic}
병원명·위치 외의 정보(의료진 경력, 장비 대수, 수상·인증, 환자 수 등)는 의뢰서에 없으면 지어내지 말고 [확인 필요]로 남긴다.

[의료광고 기준 - 의료법 제56조, 반드시 지킬 것]
- 치료 효과를 보장하거나 단정하지 않는다 ("100%", "완치", "확실한 효과", "부작용 없음" 등 금지)
- 최상급·비교 표현을 쓰지 않는다 ("최고", "유일", "최초", "No.1", 다른 병원과의 비교)
- 환자 치료 후기·체험담, 시술 전후 사진을 광고 수단으로 쓰지 않는다
- 시술을 소개할 때는 개인차가 있다는 점과 가능한 부작용·주의사항을 함께 안내한다
- 할인·이벤트를 과도하게 강조해 환자를 유인하지 않는다 ("파격", "공짜", "오늘만" 등)
- 공포심을 조장하거나 확인되지 않은 수치·논문을 인용하지 않는다
- 홍보보다 정보 전달이 중심이 되게 쓰고, 마무리는 "상담 후 결정" 수준의 부드러운 안내로 한다"""


WRITER_SYSTEM = """너는 병원 홍보용 유튜브 대본과 블로그 글을 전문으로 쓰는 작가다.
- 의뢰서의 조건(대상, 분량, 말투, 꼭 넣을 내용)을 반드시 지킨다.
- [참고 예시 글]이 있으면 그 글의 말투, 문장 길이, 구성 방식을 따라 쓴다. 단, 내용이나 문장을 그대로 베끼지 않는다.
- 편집자 피드백을 받으면 반영해 수정하되, 동의하지 않는 지적은 이유를 한 줄로 밝히고 원래대로 둬도 된다.
- 편집자가 '잘된 점'으로 꼽은 부분은 함부로 바꾸지 않는다.
- 사용자가 직접 쓴 원고를 다듬을 때는 글쓴이의 목소리와 핵심 내용을 최대한 살린다.
- 확실하지 않은 사실은 지어내지 말고 [확인 필요] 표시를 남긴다.
- 원고의 제목과 소제목은 마크다운(#, ##)으로 표시한다.

{rules}

반드시 아래 형식으로만 답한다:
===원고===
(완성된 원고 전체)
===수정메모===
(이번에 무엇을 반영했고, 무엇을 왜 반영하지 않았는지. 첫 초안이면 '첫 초안')"""

EDITOR_SYSTEM = """너는 깐깐하지만 공정한 편집자다.
- 글을 직접 다시 쓰지 않는다. 점수와 수정 지시만 한다.
- 채점 기준표의 항목마다 10점 만점으로 점수를 매긴다 (소수점 한 자리 가능).
- 가장 중요한 수정 사항을 최대 3개, '위치 / 이유 / 고치는 방법'으로 구체적으로 제시한다.
- [참고 예시 글]이 있으면 그 말투와 구성을 잘 따랐는지도 함께 본다.
- 칭찬만 하지 말고, 수정할 게 정말 거의 없을 때만 no_major_changes를 true로 한다.
- 잘된 점 1~2개를 꼭 적는다 (다음 수정 때 유지되도록).
- 사실 확인이 필요한 문장이나 의료광고로 문제될 수 있는 과장 표현이 있으면 fact_check에 적는다.
- comment에는 작가에게 건네는 한두 문장의 총평을 적는다.

{rules}

반드시 아래 JSON 형식으로만 답한다:
{{
  "comment": "총평 한두 문장",
  "scores": {{"항목이름": 점수, ...}},
  "strengths": ["잘된 점", ...],
  "fixes": [{{"where": "위치", "why": "이유", "how": "고치는 방법"}}, ...],
  "fact_check": ["확인이 필요한 문장", ...],
  "no_major_changes": false
}}"""

DEBATE_WRITER_RULES = """[토론 규칙]
너는 지금 다른 AI 작가와 같은 의뢰로 각자 글을 쓰고, 서로 비판하며 더 나은 글을 만드는 토론에 참여하고 있다.
- 상대의 지적을 받으면, 수정메모에 지적 하나하나마다 한 줄씩 "✅ 수용: (무엇을 어떻게 고쳤는지)" 또는 "🙅 반박: (왜 동의하지 않는지 근거)"로 답한다.
- 무조건 수용하지 말고, 독자에게 더 나은 쪽을 근거로 판단한다. 다만 의료광고 기준 위반 지적은 반드시 수용한다."""

DEBATE_CRITIC_RULES = """[토론 규칙]
너는 지금 편집자이자 토론 상대로서, 같은 의뢰로 글을 쓴 상대 AI 작가의 원고를 평가한다.
- 네 원고를 홍보하지 말고 상대 원고 자체를 공정하게 채점한다. 다만 네가 더 잘 풀었다고 생각하는 부분은 구체적으로 제안해도 된다.
- [지난 라운드 너의 지적]과 [상대의 답변]이 있으면: 상대의 반박이 타당하면 그 지적은 철회하고, 타당하지 않으면 근거를 더해 다시 지적한다. comment에 이 판단을 짧게 밝힌다."""

# 명령줄 도구는 원래 코딩용이라, 글만 쓰고 파일·명령은 건드리지 말라고 덧붙입니다
TOOL_NOTE = "\n\n[작업 방식] 이번 요청은 글쓰기다. 파일을 읽거나 만들거나 명령을 실행하지 말고, 요청한 형식의 답만 바로 출력한다."

REFERENCE_LIMIT = 15000  # 참고 글이 너무 길면 앞부분만 사용
CALL_TIMEOUT = 15 * 60  # AI 한 번 부를 때 최대 15분


# ─────────────────────────────────────────────
# AI 호출 (구독 계정으로 로그인된 명령줄 도구 사용)
# ─────────────────────────────────────────────
class AIError(RuntimeError):
    """화면에 그대로 보여줄 수 있는 오류"""


class AI:
    def __init__(self, demo: bool, cfg: dict):
        self.demo = demo
        self.cfg = cfg
        self.demo_round = 0
        self.lock = threading.Lock()
        self.calls = {"claude": 0, "gpt": 0}
        if demo:
            return
        self.exe = {"claude": shutil.which("claude"), "gpt": shutil.which("codex")}
        missing = [n for n, w in (("Claude Code", "claude"), ("Codex", "gpt")) if not self.exe[w]]
        if missing:
            raise AIError(
                f"{', '.join(missing)} 가 설치돼 있지 않습니다. '설치하기.bat' 을 실행한 뒤 "
                "'글쓰기.bat' 을 다시 실행해 주세요. (설치 직후라면 검은 창을 닫고 다시 열어야 합니다)"
            )
        # 로그인이 안 된 채로 부르면 한참 재시도하다 멈추므로 먼저 확인
        status = login_status(refresh=True)
        logged_out = [f"{n}: {status[w]['text']}" for n, w in (("Claude", "claude"), ("ChatGPT", "gpt"))
                      if not status[w]["ok"]]
        if logged_out:
            raise AIError("구독 계정 로그인이 필요합니다. '로그인하기.bat' 을 실행해 주세요.\n" + "\n".join(logged_out))

    def ask(self, who: str, system: str, user: str, want_json: bool = False) -> str:
        if self.demo:
            return self._fake(want_json)
        with self.lock:
            self.calls[who] += 1
        try:
            return self._claude(system, user) if who == "claude" else self._codex(system, user)
        except subprocess.TimeoutExpired:
            raise AIError(f"{NAME[who]} 응답이 {CALL_TIMEOUT // 60}분 넘게 없어 멈췄습니다. 잠시 뒤 다시 시도해 주세요.")

    def _claude(self, system: str, user: str) -> str:
        WORK.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile("w", suffix=".txt", encoding="utf-8", delete=False, dir=WORK) as f:
            f.write(system + TOOL_NOTE)
        try:
            cmd = [self.exe["claude"], "-p", "--output-format", "json", "--tools", "",
                   "--no-session-persistence", "--system-prompt-file", f.name]
            if self.cfg.get("claude_model"):
                cmd += ["--model", self.cfg["claude_model"]]
            p = _run(cmd, user, CALL_TIMEOUT)
        finally:
            os.unlink(f.name)
        raw = p.stdout.decode("utf-8", "replace").strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            raise AIError(explain("claude", _out(p)))
        if data.get("is_error") or p.returncode != 0:
            raise AIError(explain("claude", str(data.get("result") or _out(p))))
        return str(data.get("result", ""))

    def _codex(self, system: str, user: str) -> str:
        WORK.mkdir(parents=True, exist_ok=True)
        fd, out = tempfile.mkstemp(suffix=".txt", dir=WORK)
        os.close(fd)
        try:
            cmd = [self.exe["gpt"], "exec", "--skip-git-repo-check", "--ephemeral", "--sandbox", "read-only",
                   "--color", "never", "-o", out]
            if self.cfg.get("gpt_model"):
                cmd += ["-m", self.cfg["gpt_model"]]
            cmd.append("-")  # 지시문은 길어서 명령줄 대신 표준입력으로 전달
            p = _run(cmd, f"[지시]\n{system}{TOOL_NOTE}\n\n[요청]\n{user}", CALL_TIMEOUT)
            text = Path(out).read_text(encoding="utf-8", errors="replace").strip()
        finally:
            os.unlink(out)
        if p.returncode != 0 or not text:
            raise AIError(explain("gpt", _out(p)))
        return text

    def _fake(self, want_json: bool) -> str:
        """연습 모드용 가짜 응답. 점수가 회차마다 오르는 모습을 보여줍니다."""
        time.sleep(0.8)
        if not want_json:
            return (
                f"===원고===\n# 연습 모드 원고 ({self.demo_round + 1}번째 버전)\n\n"
                "연습 모드에서는 AI를 부르지 않고 이 예시 글만 보여드려요. "
                "실제 글을 쓰려면 ⚙️ 설정에서 연습 모드를 꺼 주세요.\n\n"
                "## 예시 소제목\n\n- 첫 번째 내용\n- 두 번째 내용\n\n"
                "## 마무리\n\n궁금한 점은 상담을 통해 확인해 보세요.\n"
                "===수정메모===\n"
                + ("첫 초안" if self.demo_round == 0 else
                   "✅ 수용: 도입부를 질문형으로 바꿨습니다.\n🙅 반박: 소제목 개수는 분량에 맞아 그대로 뒀습니다.")
            )
        with self.lock:
            self.demo_round += 1
            base = [6.5, 7.6, 8.7][min(self.demo_round - 1, 2)]
        return json.dumps(
            {
                "comment": "(연습 모드) 전체 흐름은 좋지만 도입부가 조금 약해요.",
                "scores": {"도입부": base, "구성": round(base + 0.2, 1), "정확성": base,
                           "의료광고 준수": round(base + 0.1, 1), "읽기 편함": round(base - 0.1, 1), "마무리": base},
                "strengths": ["말투가 친근함"],
                "fixes": [{"where": "첫 문단", "why": "궁금증이 약함", "how": "질문으로 시작하기"}],
                "fact_check": ["(연습 모드 예시) 시술 효과 지속 기간"],
                "no_major_changes": base >= 8.5,
            },
            ensure_ascii=False,
        )


def explain(who: str, msg: str) -> str:
    """명령줄 도구의 오류를 일반인이 이해할 수 있는 말로 바꿉니다."""
    name = NAME[who]
    low = msg.lower()
    if any(k in low for k in ("not logged in", "login", "log in", "unauthorized", "401", "authentication")):
        hint = f"{name} 로그인이 필요합니다. '로그인하기.bat' 을 실행해 구독 계정으로 로그인해 주세요."
    elif any(k in low for k in ("usage limit", "rate limit", "limit reached", "hit your limit", "429", "quota")):
        hint = f"{name} 구독 사용량 한도에 도달했습니다. 한도가 풀릴 때까지(보통 몇 시간) 기다렸다가 다시 시도해 주세요."
    elif "model" in low and any(k in low for k in ("not found", "does not exist", "not supported", "invalid")):
        hint = f"{name} 모델 이름을 쓸 수 없습니다. .env 의 모델 이름을 지우면 구독 기본 모델을 씁니다."
    elif any(k in low for k in ("connection", "timeout", "network", "econn")):
        hint = "인터넷 연결이 불안정합니다. 잠시 뒤 다시 시도해 주세요."
    else:
        hint = f"{name} 실행 중 예상하지 못한 오류가 났습니다. 아래 원문을 복사해서 Claude에게 보여주세요."
    return f"{hint}\n\n[원문] {msg.strip()[:600]}"


def friendly_error(e: Exception) -> str:
    return str(e) if isinstance(e, AIError) else f"예상하지 못한 오류입니다. 아래 원문을 복사해서 Claude에게 보여주세요.\n\n[원문] {str(e)[:600]}"


# ─────────────────────────────────────────────
# 도우미 함수
# ─────────────────────────────────────────────
def detect_type(brief: str) -> str:
    m = re.search(r"글\s*종류\s*[:：]\s*(.+)", brief)
    kind = m.group(1) if m else brief[:200]
    return "youtube" if re.search(r"유튜브|영상|대본|youtube", kind, re.I) else "blog"


def parse_writer(text: str) -> tuple[str, str]:
    m = re.search(r"===\s*원고\s*===\s*(.*?)\s*===\s*수정메모\s*===\s*(.*)", text, re.S)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return text.strip(), "(수정메모 없음)"


def parse_editor(text: str) -> dict:
    m = re.search(r"\{.*\}", text, re.S)
    try:
        fb = json.loads(m.group(0) if m else text)
        if not isinstance(fb, dict):
            raise ValueError
    except (json.JSONDecodeError, ValueError):
        fb = {"scores": {}, "strengths": [], "fixes": [{"where": "전체", "why": "편집자 응답 형식 오류",
                                                        "how": text[:1000]}],
              "fact_check": [], "no_major_changes": False}
    fb.setdefault("scores", {})
    scores = [float(v) for v in fb["scores"].values() if isinstance(v, (int, float))]
    fb["average"] = round(sum(scores) / len(scores), 2) if scores else 0.0
    return fb


def format_feedback(fb: dict) -> str:
    lines = [f"[총평] {fb['comment']}", ""] if fb.get("comment") else []
    lines.append("[점수]")
    lines += [f"- {k}: {v}" for k, v in fb.get("scores", {}).items()]
    lines.append(f"- 평균: {fb['average']}")
    lines.append("\n[잘된 점 - 유지할 것]")
    lines += [f"- {s}" for s in fb.get("strengths", [])]
    lines.append("\n[수정 지시]")
    for i, f in enumerate(fb.get("fixes", []), 1):
        lines.append(f"{i}. 위치: {f.get('where')} / 이유: {f.get('why')} / 방법: {f.get('how')}")
    if fb.get("fact_check"):
        lines.append("\n[사실 확인 필요]")
        lines += [f"- {s}" for s in fb["fact_check"]]
    return "\n".join(lines)


def rubric_text(rubric: dict) -> str:
    return "\n".join(f"- {k}: {v}" for k, v in rubric.items())


def safe_name(text: str) -> str:
    return re.sub(r"[^\w가-힣-]+", "_", text).strip("_")[:30] or "글"


# ─────────────────────────────────────────────
# 메인 흐름
# ─────────────────────────────────────────────
def run_session(job: dict, say, typing=lambda who, text: None) -> dict:
    """
    job 항목:
      brief        의뢰서(사용자 요청) 텍스트
      kind         "youtube" / "blog"
      original     시작 원고 (있으면 초안을 새로 쓰지 않고 이 글에서 출발)
      instruction  original 에 적용할 사용자 추가 요청
      reference    참고 예시 글 (말투·구성 참고용)
      mode         "debate"(토론) / "loop"(작가·편집자)
      writer, target_score, max_revisions, debate_rounds, demo

    say(role, type, content, meta)  채팅에 메시지 한 개를 남깁니다.
    typing(who, text)               "~하는 중" 표시를 바꿉니다.
    """
    cfg = settings()
    for k in ("mode", "writer", "target_score", "max_revisions", "debate_rounds"):
        if job.get(k) not in (None, ""):
            cfg[k] = job[k]
    brief = job["brief"].strip()
    kind = job.get("kind") if job.get("kind") in RUBRICS else detect_type(brief)
    reference = (job.get("reference") or "").strip()[:REFERENCE_LIMIT]
    rules = medical_ad_rules(cfg["clinic_profile"])
    ctx = {
        "cfg": cfg,
        "ai": AI(bool(job.get("demo")), cfg),
        "kind": kind,
        "rubric": RUBRICS[kind],
        "original": (job.get("original") or "").strip(),
        "instruction": (job.get("instruction") or "").strip(),
        "head": f"[의뢰서]\n{brief}\n\n"
                + (f"[참고 예시 글 - 말투와 구성을 참고할 것, 베끼지 말 것]\n{reference}\n\n" if reference else ""),
        "writer_sys": WRITER_SYSTEM.format(rules=rules),
        "editor_sys": EDITOR_SYSTEM.format(rules=rules),
        "target": float(cfg["target_score"]),
    }
    flow = run_loop if cfg["mode"] == "loop" else run_debate
    return flow(ctx, say, typing)


def run_loop(c: dict, say, typing) -> dict:
    """작가·편집자 모드: 한쪽이 쓰고 다른 쪽이 채점, 목표 점수까지 반복"""
    ai, head, target = c["ai"], c["head"], c["target"]
    writer = c["cfg"]["writer"] if c["cfg"]["writer"] in NAME else "claude"
    editor = "gpt" if writer == "claude" else "claude"
    max_rev = int(c["cfg"]["max_revisions"])
    original, instruction = c["original"], c["instruction"]

    say("system", "status",
        f"{KIND_LABEL[c['kind']]} · 작가 {NAME[writer]} · 편집자 {NAME[editor]} · 목표 {target}점 · 최대 수정 {max_rev}회"
        + (" · 연습 모드" if ai.demo else ""))

    def write(prompt: str, label: str, version: int) -> tuple[str, str]:
        typing(writer, label)
        draft, memo = parse_writer(ai.ask(writer, c["writer_sys"], prompt))
        say(writer, "draft", draft, {"version": version, "memo": memo, "role": "writer"})
        return draft, memo

    if original and instruction:
        draft, memo = write(f"{head}[현재 원고]\n{original}\n\n[사용자 추가 요청]\n{instruction}\n\n"
                            "추가 요청을 반영해서 원고를 수정해줘.", "요청하신 내용을 반영하는 중", 1)
    elif original:
        draft, memo = original, "사용자가 직접 쓴 원본"
        say("user", "draft", draft, {"version": 1, "memo": memo, "role": "original"})
    else:
        draft, memo = write(f"{head}위 조건으로 첫 초안을 써줘.", "초안을 쓰는 중", 1)

    version, revision, prev_fixes, scores = 1, 0, "", []
    while True:
        typing(editor, f"{version}번째 원고를 채점하는 중")
        fb = parse_editor(ai.ask(
            editor, c["editor_sys"],
            f"{head}[채점 기준표]\n{rubric_text(c['rubric'])}\n\n"
            + (f"[지난번 수정 지시 - 반영됐는지 확인할 것]\n{prev_fixes}\n\n" if prev_fixes else "")
            + f"[작가의 수정메모]\n{memo}\n\n[원고]\n{draft}", want_json=True))
        scores.append(fb["average"])
        say(editor, "feedback", format_feedback(fb), {**fb, "version": version, "role": "editor"})

        if fb["average"] >= target:
            stop_reason = f"목표 점수({target}) 달성"
            break
        if fb.get("no_major_changes"):
            stop_reason = "편집자가 '큰 수정 없음' 판단"
            break
        if revision >= max_rev:
            stop_reason = f"최대 수정 횟수({max_rev}회) 도달"
            break

        revision += 1
        version += 1
        prev_fixes = format_feedback(fb)
        draft, memo = write(f"{head}[현재 원고]\n{draft}\n\n[편집자 피드백]\n{prev_fixes}\n\n"
                            "피드백을 검토해서 원고를 수정해줘.", f"{revision}번째 수정을 하는 중", version)

    typing(None, "")
    summary = {"kind": c["kind"], "mode": "loop", "writer": writer, "editor": editor, "scores": scores,
               "stop_reason": stop_reason, "calls": ai.calls, "demo": ai.demo, "final_feedback": fb}
    say("system", "done", stop_reason, summary)
    return summary


def run_debate(c: dict, say, typing) -> dict:
    """
    토론 모드: 두 AI가 각자 쓰고 → 서로 비판 → 지적마다 수용/반박하며 수정 (라운드 반복)
    → 더 높게 평가받은 쪽이 두 원고를 합쳐 최종본 → 상대가 최종 검토 → 필요하면 마무리 수정
    """
    ai, head, target, rubric = c["ai"], c["head"], c["target"], c["rubric"]
    rounds = max(1, min(4, int(c["cfg"]["debate_rounds"])))
    lead = "gpt" if c["cfg"]["writer"] == "gpt" else "claude"  # 동점일 때 최종 정리 담당
    both = ("claude", "gpt")
    other = {"claude": "gpt", "gpt": "claude"}
    writer_sys = f"{c['writer_sys']}\n\n{DEBATE_WRITER_RULES}"
    critic_sys = f"{c['editor_sys']}\n\n{DEBATE_CRITIC_RULES}"
    original, instruction = c["original"], c["instruction"]

    say("system", "status", f"{KIND_LABEL[c['kind']]} · Claude × GPT 토론 · {rounds}라운드 · 목표 {target}점"
        + (" · 연습 모드" if ai.demo else ""))

    version = {"claude": 0, "gpt": 0}
    drafts: dict[str, tuple[str, str]] = {}

    def pair(fn):
        """두 AI의 작업을 동시에 돌리고, 결과는 Claude → GPT 순서로 돌려줍니다."""
        with ThreadPoolExecutor(2) as ex:
            futures = {who: ex.submit(fn, who) for who in both}
            return {who: futures[who].result() for who in both}

    def write(who: str, prompt: str, label: str, role: str = "debater") -> dict:
        draft, memo = parse_writer(ai.ask(who, writer_sys, prompt))
        version[who] += 1
        return {"draft": draft, "memo": memo,
                "meta": {"version": version[who], "memo": memo, "role": role, "label": label}}

    # ① 각자 초안 (사용자 원고가 있으면 각자 그 원고를 다듬은 버전)
    if original and instruction:
        start = f"[현재 원고]\n{original}\n\n[사용자 추가 요청]\n{instruction}\n\n추가 요청을 반영해서 원고를 수정해줘."
    elif original:
        say("user", "draft", original, {"version": 0, "memo": "사용자가 직접 쓴 원본", "role": "original"})
        start = f"[사용자 원고]\n{original}\n\n글쓴이의 목소리와 핵심 내용을 살리면서, 네가 생각하는 가장 좋은 방향으로 다듬어줘."
    else:
        start = "위 조건으로 첫 초안을 써줘. 상대 AI도 같은 의뢰로 따로 쓰고 있으니, 네 관점을 분명히 담아라."
    typing(None, "Claude와 GPT가 각자 초안을 쓰는 중")
    first = pair(lambda who: write(who, head + start, f"{NAME[who]}의 초안"))
    for who in both:
        drafts[who] = (first[who]["draft"], first[who]["memo"])
        say(who, "draft", first[who]["draft"], first[who]["meta"])

    # ② 서로 비판 → 각자 수정. critique[x] = x의 원고에 대해 상대가 준 마지막 평가
    critique: dict[str, dict] = {}
    history = {"claude": [], "gpt": []}
    rnd = 0
    while True:
        rnd += 1
        typing(None, f"{rnd}라운드 · 서로의 원고를 평가하는 중")

        def judge(author: str) -> dict:
            critic = other[author]
            prev = (f"[지난 라운드 너의 지적]\n{format_feedback(critique[author])}\n\n"
                    f"[상대의 답변 (수정메모)]\n{drafts[author][1]}\n\n") if author in critique else ""
            return parse_editor(ai.ask(
                critic, critic_sys,
                f"{head}[채점 기준표]\n{rubric_text(rubric)}\n\n[참고: 네가 쓴 원고]\n{drafts[critic][0]}\n\n"
                f"{prev}[평가할 상대({NAME[author]}) 원고]\n{drafts[author][0]}", want_json=True))

        fbs = pair(judge)
        for author in both:
            critique[author] = fbs[author]
            history[author].append(fbs[author]["average"])
            say(other[author], "feedback", format_feedback(fbs[author]), {
                **fbs[author], "version": version[author], "round": rnd, "target": author, "role": "critic",
                "label": f"{NAME[author]} 원고 평가 · {rnd}라운드"})

        if all(critique[a]["average"] >= target or critique[a].get("no_major_changes") for a in both):
            stop_reason = f"{rnd}라운드에서 두 원고 모두 기준 통과"
            break
        if rnd >= rounds:
            stop_reason = f"토론 {rounds}라운드 완료"
            break

        typing(None, f"{rnd}라운드 · 지적을 받아들일지 반박할지 정하며 고치는 중")
        revs = pair(lambda who: write(
            who, f"{head}[현재 네 원고]\n{drafts[who][0]}\n\n[상대({NAME[other[who]]})의 평가]\n"
                 f"{format_feedback(critique[who])}\n\n지적마다 수용할지 반박할지 판단해서 원고를 수정해줘.",
            f"{NAME[who]}의 {rnd}라운드 수정본"))
        for who in both:
            drafts[who] = (revs[who]["draft"], revs[who]["memo"])
            say(who, "draft", revs[who]["draft"], revs[who]["meta"])

    # ③ 더 높게 평가받은 쪽이 두 원고를 합쳐 최종본 작성
    ca, ga = critique["claude"]["average"], critique["gpt"]["average"]
    synth = lead if ca == ga else ("claude" if ca > ga else "gpt")
    rev = other[synth]
    say("system", "status", f"평가 점수 Claude {ca} · GPT {ga} → {NAME[synth]}가 두 원고의 장점을 모아 최종 정리, "
                            f"{NAME[rev]}가 최종 검토")
    typing(synth, "두 원고의 좋은 점을 모아 최종본을 쓰는 중")
    final = write(
        synth,
        f"{head}[네 원고]\n{drafts[synth][0]}\n\n[네 원고에 대한 {NAME[rev]}의 평가]\n{format_feedback(critique[synth])}\n\n"
        f"[상대({NAME[rev]}) 원고]\n{drafts[rev][0]}\n\n[상대 원고에 대한 너의 평가]\n{format_feedback(critique[rev])}\n\n"
        "토론을 마무리한다. 네 원고를 뼈대로, 상대 원고에서 더 나은 부분(도입, 표현, 예시, 구성 등)을 가져와 "
        "하나의 최종 원고로 합쳐줘. 수정메모에는 상대 원고에서 무엇을 가져왔는지, 남은 지적은 어떻게 처리했는지 적어줘.",
        "최종 합본", "synthesizer")
    say(synth, "draft", final["draft"], final["meta"])

    # ④ 상대가 최종 검토, 기준 미달이면 한 번 더 다듬기
    typing(rev, "최종 원고를 검토하는 중 (의료광고 기준 포함)")
    review = parse_editor(ai.ask(
        rev, c["editor_sys"] + "\n\n이번은 게시 전 최종 검토다. 특히 의료광고 기준 위반과 사실 확인이 필요한 문장을 빠짐없이 찾아라.",
        f"{head}[채점 기준표]\n{rubric_text(rubric)}\n\n[작가의 수정메모]\n{final['memo']}\n\n[최종 원고]\n{final['draft']}",
        want_json=True))
    say(rev, "feedback", format_feedback(review),
        {**review, "version": version[synth], "role": "reviewer", "label": "최종 검토"})
    if review["average"] >= target or review.get("no_major_changes"):
        stop_reason += f" · 최종 검토 {review['average']}점 통과"
    else:
        typing(synth, "최종 검토를 반영해 마무리하는 중")
        polished = write(synth, f"{head}[현재 원고]\n{final['draft']}\n\n[{NAME[rev]}의 최종 검토]\n"
                                f"{format_feedback(review)}\n\n최종 검토를 반영해 원고를 마무리해줘.",
                         "최종 원고", "synthesizer")
        say(synth, "draft", polished["draft"], polished["meta"])
        stop_reason += f" · 최종 검토({review['average']}점) 반영해 마무리"

    typing(None, "")
    summary = {
        "kind": c["kind"], "mode": "debate", "writer": synth, "editor": rev, "scores": [review["average"]],
        "trajectory": f"Claude {' → '.join(map(str, history['claude']))} · GPT {' → '.join(map(str, history['gpt']))}"
                      f" · 최종 검토 {review['average']}",
        "stop_reason": stop_reason, "calls": ai.calls, "demo": ai.demo, "final_feedback": review,
    }
    say("system", "done", stop_reason, summary)
    return summary
