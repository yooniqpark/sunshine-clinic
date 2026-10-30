"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import s from "./blog.module.css";

export default function BlogEditor({ initialPost }: { initialPost?: BlogPost }) {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "진료 이야기");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = !!post && (post.title !== title || post.category !== category);
  async function upload(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) { setError("DOCX 파일을 선택해 주세요."); return; }
    setBusy(true); setError(""); setNotice("문서를 불러오고 있습니다…");
    try {
      const data = new FormData(); data.append("file", file); data.append("category", category);
      if (title.trim()) data.append("title", title.trim());
      const response = await fetch("/api/admin/blog", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok || !body.post) throw new Error(body.error || "원고를 가져오지 못했습니다.");
      const imported = body.post as BlogPost;
      setPost(imported); setTitle(imported.title); setCategory(imported.category);
      setNotice("원고를 비공개 초안으로 저장했습니다. 미리보기를 확인한 뒤 게시해 주세요.");
      router.replace(`/admin/blog/${imported.id}`); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "문서를 불러오지 못했습니다."); setNotice(""); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  async function save(published?: boolean) {
    if (!post || !title.trim()) { setError("제목을 입력해 주세요."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), category: category.trim(), ...(published !== undefined ? { published } : {}) }) });
      const body = await response.json();
      if (!response.ok || !body.post) throw new Error(body.error || "저장하지 못했습니다.");
      const saved = body.post as BlogPost; setPost(saved); setTitle(saved.title); setCategory(saved.category);
      setNotice(published === true ? "게시했습니다. 방문자가 닥터스 노트에서 읽을 수 있습니다." : published === false ? "비공개로 전환했습니다. 방문자에게 더 이상 표시되지 않습니다." : "변경사항을 저장했습니다.");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "저장하지 못했습니다."); }
    finally { setBusy(false); }
  }
  const imageCount = (post?.html.match(/<img\b/gi) ?? []).length;
  const tableCount = (post?.html.match(/<table\b/gi) ?? []).length;
  return <div className={s.editor}>
    <div><Link className={s.back} href="/admin/blog">← 블로그 원고 목록</Link><div className={s.heading}><div><span className={s.eyebrow}>DOCTOR’S NOTES</span><h1>{post ? "원고 편집" : "DOCX 원고 가져오기"}</h1><p className={s.description}>원고의 내용과 이미지를 가져와 닥터스 노트에 게시합니다.</p></div>{post && <span className={`${s.badge} ${post.published ? s.published : ""}`}>{post.published ? "게시됨" : "비공개 초안"}</span>}</div></div>
    {!post && <section className={s.upload}><h2>Word 원고 업로드</h2><p>제목·소제목·강조·이미지·표를 가져옵니다. 글꼴과 줄바꿈, 페이지 여백은 웹 화면에 맞게 표시됩니다.<br />업로드한 원고는 자동 게시되지 않습니다.</p><label className={s.fileLabel} htmlFor="blog-docx">{busy ? "원고를 가져오는 중…" : "DOCX 파일 선택"}</label><input id="blog-docx" ref={fileRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden disabled={busy} onChange={e => upload(e.target.files?.[0])} /></section>}
    <div className={s.fields}><label className={s.label}>제목<input className={s.input} value={title} maxLength={200} disabled={busy} onChange={e => setTitle(e.target.value)} placeholder="비워 두면 원고의 첫 제목을 사용합니다" /></label><label className={s.label}>카테고리<input className={s.input} value={category} maxLength={60} disabled={busy} onChange={e => setCategory(e.target.value)} /></label></div>
    {error && <div className={s.error} role="alert">{error}</div>}{notice && <div className={s.success} role="status">{notice}</div>}
    {post && <><section className={s.document}><h2>가져온 문서</h2><p className={s.status}>{post.sourceName} · <a href={`/api/admin/blog/${post.id}/source`}>원본 DOCX 다운로드 ↓</a></p><p className={s.status}>삽입 이미지 {imageCount}개 · 표 {tableCount}개</p><p className={s.status}>미리보기에서 본문과 이미지 순서를 확인해 주세요. 원고를 다시 가져오려면 새 초안을 등록할 수 있습니다.</p><Link className={s.previewLink} href={`/journal/${post.id}`} target="_blank" rel="noopener noreferrer">닥터스 노트 게시 화면 미리보기 ↗</Link><iframe key={`${post.id}-${post.updatedAt}`} className={s.previewFrame} title="닥터스 노트 게시 화면 미리보기" src={`/journal/${post.id}?preview=${encodeURIComponent(post.updatedAt)}`} referrerPolicy="same-origin" /></section>
      <div className={s.actions}><div className={s.actionGroup}><button className={s.secondary} type="button" disabled={busy || !dirty} onClick={() => save()}>변경사항 저장</button></div><div className={s.actionGroup}>{post.published ? <button className={s.danger} type="button" disabled={busy} onClick={() => save(false)}>비공개로 전환</button> : <button className={s.primary} type="button" disabled={busy} onClick={() => save(true)}>검토 완료 · 게시하기</button>}</div></div>
      {dirty && <p className={s.status}>아직 저장하지 않은 제목 또는 카테고리 변경사항이 있습니다. 게시하면 변경사항도 함께 저장됩니다.</p>}
    </>}
  </div>;
}
