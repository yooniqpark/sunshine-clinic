"""대화 기록 저장소 (SQLite). 파이썬에 기본으로 들어 있어 따로 설치할 것이 없습니다.
기록은 data/duo.db 파일 하나에 저장됩니다. 이 파일을 지우면 기록이 모두 사라집니다."""

import json
import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "duo.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS conversations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    kind        TEXT NOT NULL,          -- youtube / blog
    brief       TEXT NOT NULL,          -- 처음 요청 (이어서 수정할 때 다시 사용)
    reference   TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL,      -- user / claude / gpt / system
    type            TEXT NOT NULL,      -- request / draft / feedback / status / done / error
    content         TEXT NOT NULL DEFAULT '',
    meta            TEXT NOT NULL DEFAULT '{}',
    created_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);
"""


def _now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH, timeout=10)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    con.execute("PRAGMA journal_mode = WAL")
    return con


def init():
    with connect() as con:
        con.executescript(SCHEMA)


def create_conversation(title: str, kind: str, brief: str, reference: str) -> int:
    with connect() as con:
        cur = con.execute(
            "INSERT INTO conversations (title, kind, brief, reference, created_at, updated_at) VALUES (?,?,?,?,?,?)",
            (title, kind, brief, reference, _now(), _now()),
        )
        return cur.lastrowid


def get_conversation(cid: int) -> dict | None:
    with connect() as con:
        row = con.execute("SELECT * FROM conversations WHERE id = ?", (cid,)).fetchone()
        return dict(row) if row else None


def list_conversations() -> list[dict]:
    with connect() as con:
        rows = con.execute(
            "SELECT id, title, kind, updated_at FROM conversations ORDER BY updated_at DESC, id DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def delete_conversation(cid: int):
    with connect() as con:
        con.execute("DELETE FROM conversations WHERE id = ?", (cid,))


def add_message(cid: int, role: str, type_: str, content: str = "", meta: dict | None = None) -> int:
    with connect() as con:
        cur = con.execute(
            "INSERT INTO messages (conversation_id, role, type, content, meta, created_at) VALUES (?,?,?,?,?,?)",
            (cid, role, type_, content, json.dumps(meta or {}, ensure_ascii=False), _now()),
        )
        con.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (_now(), cid))
        return cur.lastrowid


def _row(r) -> dict:
    d = dict(r)
    d["meta"] = json.loads(d["meta"] or "{}")
    return d


def get_messages(cid: int, after: int = 0) -> list[dict]:
    with connect() as con:
        rows = con.execute(
            "SELECT * FROM messages WHERE conversation_id = ? AND id > ? ORDER BY id", (cid, after)
        ).fetchall()
        return [_row(r) for r in rows]


def get_message(mid: int) -> dict | None:
    with connect() as con:
        r = con.execute("SELECT * FROM messages WHERE id = ?", (mid,)).fetchone()
        return _row(r) if r else None


def last_of_type(cid: int, type_: str) -> dict | None:
    with connect() as con:
        r = con.execute(
            "SELECT * FROM messages WHERE conversation_id = ? AND type = ? ORDER BY id DESC LIMIT 1", (cid, type_)
        ).fetchone()
        return _row(r) if r else None
