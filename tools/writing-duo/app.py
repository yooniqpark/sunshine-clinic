"""
글쓰기 듀오 웹페이지. 실행하면 브라우저가 자동으로 열립니다.
이 창(검은 창)을 닫으면 페이지도 멈춥니다. 대화 기록은 data/duo.db 에 저장됩니다.

    python app.py
"""

import base64
import json
import re
import sys
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

import db
import duo
import topics
from export_docx import build_docx, read_docx_text

HERE = Path(__file__).resolve().parent
WEB = HERE / "web"
JOBS: dict[int, dict] = {}  # 대화 번호 → 진행 상태 (메모리에만)
LOCK = threading.Lock()


def make_title(text: str) -> str:
    line = next((l.strip().lstrip("#").strip() for l in text.splitlines() if l.strip().lstrip("#").strip()), "새 대화")
    return line[:40] + ("…" if len(line) > 40 else "")


def start_job(cid: int, job: dict):
    state = {"status": "running", "who": None, "text": "준비 중"}
    with LOCK:
        JOBS[cid] = state

    def say(role, type_, content="", meta=None):
        db.add_message(cid, role, type_, content, meta)

    def typing(who, text):
        with LOCK:
            state["who"], state["text"] = who, text

    def work():
        try:
            duo.run_session(job, say, typing)
        except Exception as e:  # noqa: BLE001
            db.add_message(cid, "system", "error", duo.friendly_error(e))
        finally:
            with LOCK:
                state["status"], state["who"] = "idle", None

    threading.Thread(target=work, daemon=True).start()


def handle_send(data: dict) -> dict:
    """사용자 메시지 한 개를 받아 새 대화를 시작하거나, 기존 대화를 이어갑니다."""
    text = (data.get("text") or "").strip()
    files = data.get("attachments") or []
    reference = "\n\n".join(a["text"] for a in files if a.get("as") == "reference")
    original = "\n\n".join(a["text"] for a in files if a.get("as") == "original")
    opts = data.get("settings") or {}
    if not text and not original:
        raise ValueError("요청 내용을 적어 주세요.")

    cid = data.get("conversation_id")
    conv = db.get_conversation(int(cid)) if cid else None
    with LOCK:
        if conv and JOBS.get(conv["id"], {}).get("status") == "running":
            raise ValueError("아직 작업 중이에요. 끝난 뒤에 다시 보내 주세요.")

    attach_meta = [{"name": a.get("name") or "붙여넣은 글", "as": a.get("as"), "chars": len(a["text"])} for a in files]
    if conv:  # 이어서 수정: 마지막 원고 + 새 요청
        last = db.last_of_type(conv["id"], "draft")
        reference = reference or conv["reference"]
        job = {"brief": conv["brief"], "kind": conv["kind"], "reference": reference,
               "original": original or (last["content"] if last else ""), "instruction": text}
    else:
        kind = data.get("kind") if data.get("kind") in duo.RUBRICS else "blog"
        brief = f"글 종류: {duo.KIND_LABEL[kind]}\n{text}" if text else f"글 종류: {duo.KIND_LABEL[kind]}"
        # 주제 중복 확인에서 "겹치지 않게 쓰기"를 골랐으면 새 각도와 이미 쓴 글 목록을 의뢰서에 덧붙임
        angle = (data.get("angle") or "").strip()
        if angle:
            brief += f"\n\n[이번 글의 각도 - 이미 쓴 글과 겹치지 않도록 정한 방향]\n{angle}"
        avoid = topics.avoid_block([str(k) for k in data.get("avoid") or []])
        if avoid:
            brief += f"\n\n{avoid}"
        title = make_title(text) if text else make_title(original)
        cid = db.create_conversation(title, kind, brief, reference)
        conv = db.get_conversation(cid)
        job = {"brief": brief, "kind": kind, "reference": reference, "original": original, "instruction": ""}

    db.add_message(conv["id"], "user", "request", text, {"attachments": attach_meta})
    job.update({
        "mode": opts.get("mode"),
        "writer": opts.get("writer"),
        "target_score": opts.get("target_score"),
        "max_revisions": opts.get("max_revisions"),
        "debate_rounds": opts.get("debate_rounds"),
        "demo": bool(opts.get("demo")),
    })
    start_job(conv["id"], job)
    return {"conversation_id": conv["id"]}


def extract_text(name: str, data: bytes) -> str:
    if name.lower().endswith(".docx"):
        return read_docx_text(data)
    for enc in ("utf-8-sig", "cp949"):  # 윈도우 메모장의 옛날 한글 인코딩도 지원
        try:
            return data.decode(enc).strip()
        except UnicodeDecodeError:
            continue
    raise ValueError("글자를 읽을 수 없는 파일입니다. .txt 또는 .docx 파일을 올려 주세요.")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # 검은 창에 접속 기록이 쌓이지 않게
        pass

    def _send(self, body: bytes, ctype: str, status=200, extra=None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _json(self, obj, status=200):
        self._send(json.dumps(obj, ensure_ascii=False).encode(), "application/json; charset=utf-8", status)

    def _docx(self, body: bytes, name: str):
        self._send(body, "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                   extra={"Content-Disposition": f"attachment; filename*=UTF-8''{quote(duo.safe_name(name) + '.docx')}"})

    def do_GET(self):
        url = urlparse(self.path)
        path, qs = url.path, parse_qs(url.query)
        if path in ("/", "/index.html"):
            return self._send((WEB / "index.html").read_bytes(), "text/html; charset=utf-8")
        if path == "/api/status":
            return self._json({**duo.settings(), "login": duo.login_status("refresh" in qs)})
        if path == "/api/conversations":
            return self._json(db.list_conversations())
        if path == "/api/published":
            return self._json({"text": topics.load_published()})

        m = re.fullmatch(r"/api/conversations/(\d+)(/docx)?", path)
        if m:
            cid = int(m.group(1))
            conv = db.get_conversation(cid)
            if not conv:
                return self._json({"error": "대화를 찾을 수 없습니다"}, 404)
            if m.group(2):  # 최종 원고 + 작업 기록 요약
                last = db.last_of_type(cid, "draft")
                done = db.last_of_type(cid, "done")
                if not last:
                    return self._json({"error": "아직 원고가 없습니다"}, 404)
                return self._docx(build_docx(last["content"], done["meta"] if done else None), conv["title"])
            after = int((qs.get("after") or ["0"])[0])
            with LOCK:
                job = dict(JOBS.get(cid) or {"status": "idle", "who": None, "text": ""})
            return self._json({"conversation": conv, "messages": db.get_messages(cid, after), "job": job})

        m = re.fullmatch(r"/api/messages/(\d+)/docx", path)
        if m:
            msg = db.get_message(int(m.group(1)))
            if not msg or msg["type"] != "draft":
                return self._json({"error": "원고를 찾을 수 없습니다"}, 404)
            conv = db.get_conversation(msg["conversation_id"])
            return self._docx(build_docx(msg["content"]), f"{conv['title']}_{msg['meta'].get('version', '')}번째")
        self._json({"error": "없는 주소입니다"}, 404)

    def do_POST(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
            data = json.loads(self.rfile.read(n) or b"{}")
        except (ValueError, json.JSONDecodeError):
            return self._json({"error": "잘못된 요청입니다"}, 400)
        try:
            if self.path == "/api/send":
                return self._json(handle_send(data))
            if self.path == "/api/similar":
                text = (data.get("text") or "").strip()
                if not text:
                    raise ValueError("주제를 적어 주세요.")
                return self._json(topics.check(text, bool(data.get("demo"))))
            if self.path == "/api/published":
                topics.save_published(data.get("text") or "")
                return self._json({"ok": True})
            if self.path == "/api/extract":
                text = extract_text(data.get("name", ""), base64.b64decode(data.get("data", "")))
                return self._json({"text": text})
            if self.path == "/api/delete":
                cid = int(data.get("id", 0))
                with LOCK:
                    if JOBS.get(cid, {}).get("status") == "running":
                        raise ValueError("작업 중인 대화는 지울 수 없어요.")
                db.delete_conversation(cid)
                return self._json({"ok": True})
        except ValueError as e:
            return self._json({"error": str(e)}, 400)
        except Exception as e:  # noqa: BLE001
            return self._json({"error": f"처리하지 못했습니다: {e}"}, 500)
        self._json({"error": "없는 주소입니다"}, 404)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    db.init()
    server = None
    for port in range(8765, 8785):  # 다른 프로그램이 쓰고 있으면 다음 번호로
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
            break
        except OSError:
            continue
    if server is None:
        sys.exit("❌ 웹페이지를 열 수 없습니다. PC를 재시작한 뒤 다시 실행해 주세요.")
    url = f"http://127.0.0.1:{server.server_port}"
    print("=" * 50)
    print("  ✍️  글쓰기 듀오가 실행 중입니다")
    print(f"  브라우저가 안 열리면 주소창에 입력: {url}")
    print("  ⚠️  이 창을 닫으면 페이지도 멈춥니다")
    print("=" * 50)
    if "--no-browser" not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
