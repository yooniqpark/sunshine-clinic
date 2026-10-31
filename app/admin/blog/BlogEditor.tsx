"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import s from "./blog.module.css";

const normalizeCategory = (category: string) => category === "닥터스 노트" ? "닥터스 블로그" : category;
const normalizePost = (post: BlogPost): BlogPost => ({ ...post, category: normalizeCategory(post.category) });

export default function BlogEditor({ initialPost }: { initialPost?: BlogPost }) {
  const router = useRouter();
  const [post, setPost] = useState(() => initialPost ? normalizePost(initialPost) : undefined);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [category, setCategory] = useState(normalizeCategory(initialPost?.category ?? "닥터스 블로그"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [coverFilename, setCoverFilename] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const dirty = !!post && (post.title !== title || post.category !== category);
  async function upload(file?: File) {
    if (!file || busy || post) return;
    if (!file.name.toLowerCase().endsWith(".docx")) { setError("DOCX 파일을 선택해 주세요."); return; }
    setBusy(true); setError(""); setNotice("문서를 불러오고 있습니다…");
    try {
      const data = new FormData(); data.append("file", file); data.append("category", normalizeCategory(category));
      if (title.trim()) data.append("title", title.trim());
      const response = await fetch("/api/admin/blog", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok || !body.post) throw new Error(body.error || "원고를 가져오지 못했습니다.");
      const imported = normalizePost(body.post as BlogPost);
      setPost(imported); setTitle(imported.title); setCategory(imported.category);
      setNotice("원고를 비공개 초안으로 저장했습니다. 미리보기를 확인한 뒤 게시해 주세요.");
      router.replace(`/admin/blog/${imported.id}`); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "문서를 불러오지 못했습니다."); setNotice(""); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  async function save(published?: boolean) {
    if (busy) return;
    if (!post || !title.trim()) { setError("제목을 입력해 주세요."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), category: normalizeCategory(category.trim()), ...(published !== undefined ? { published } : {}) }) });
      const body = await response.json();
      if (!response.ok || !body.post) throw new Error(body.error || "저장하지 못했습니다.");
      const saved = normalizePost(body.post as BlogPost); setPost(saved); setTitle(saved.title); setCategory(saved.category);
      setNotice(published === true ? "게시했습니다. 방문자가 닥터스 블로그에서 읽을 수 있습니다." : published === false ? "비공개로 전환했습니다. 방문자에게 더 이상 표시되지 않습니다." : "변경사항을 저장했습니다.");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "저장하지 못했습니다."); }
    finally { setBusy(false); }
  }
  async function updateCover(file?: File, reset = false) {
    if (!post || busy || (!file && !reset)) return;
    setError(""); setNotice("");
    if (file) {
      setCoverFilename(file.name);
      if (!/\.(jpe?g|png|webp|avif)$/i.test(file.name) || (file.type && !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))) {
        setError("JPG, PNG, WebP, AVIF 이미지 파일을 선택해 주세요.");
        if (coverRef.current) coverRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("미리보기 이미지는 5MB 이하로 등록해 주세요.");
        if (coverRef.current) coverRef.current.value = "";
        return;
      }
    }
    setBusy(true); setNotice(reset ? "본문 첫 이미지로 되돌리고 있습니다…" : "미리보기 이미지를 저장하고 있습니다…");
    try {
      const data = new FormData();
      if (file) data.append("file", file);
      const response = await fetch(`/api/admin/blog/${post.id}/cover`, reset ? { method: "DELETE" } : { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok || !body.post) throw new Error(body.error || "미리보기 이미지를 저장하지 못했습니다.");
      setPost(normalizePost(body.post as BlogPost));
      if (reset) setCoverFilename("");
      setNotice(reset ? "본문 첫 이미지로 되돌렸습니다." : `${file?.name} · 미리보기 이미지를 저장했습니다.`);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "미리보기 이미지를 저장하지 못했습니다."); setNotice(""); }
    finally { setBusy(false); if (coverRef.current) coverRef.current.value = ""; }
  }
  const imageCount = (post?.html.match(/<img\b/gi) ?? []).length;
  const tableCount = (post?.html.match(/<table\b/gi) ?? []).length;
  const firstBodyImage = post?.html.match(/<img\b[^>]*\bsrc=["']([^"']*)["']/i)?.[1] ?? "";
  return <div className={s.editor}>
    <div><Link className={s.back} href="/admin/blog">← 블로그 원고 목록</Link><div className={s.heading}><div><span className={s.eyebrow}>DOCTOR’S BLOG</span><h1>{post ? "원고 편집" : "DOCX 원고 가져오기"}</h1><p className={s.description}>원고의 내용과 이미지를 가져와 닥터스 블로그에 게시합니다.</p></div>{post && <span className={`${s.badge} ${post.published ? s.published : ""}`}>{post.published ? "게시됨" : "비공개 초안"}</span>}</div></div>
    {!post && <section className={s.upload}><h2>Word 원고 업로드</h2><p>제목·소제목·강조·이미지·표를 가져옵니다. 글꼴과 줄바꿈, 페이지 여백은 웹 화면에 맞게 표시됩니다.<br />업로드한 원고는 자동 게시되지 않습니다.</p><label className={s.fileLabel} htmlFor="blog-docx">{busy ? "원고를 가져오는 중…" : "DOCX 파일 선택"}</label><input id="blog-docx" ref={fileRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden disabled={busy} onChange={e => upload(e.target.files?.[0])} /><p className={s.coverHint}>DOCX 원고를 저장한 뒤 미리보기 이미지를 등록할 수 있습니다.</p></section>}
    <div className={s.fields}><label className={s.label}>제목<input className={s.input} value={title} maxLength={200} disabled={busy} onChange={e => setTitle(e.target.value)} placeholder="비워 두면 원고의 첫 제목을 사용합니다" /></label><label className={s.label}>카테고리<input className={s.input} value={category} maxLength={60} disabled={busy} onChange={e => setCategory(e.target.value)} /></label></div>
    {error && <div className={s.error} role="alert">{error}</div>}{notice && <div className={s.success} role="status">{notice}</div>}
    {post && <><section className={s.coverSection} aria-labelledby="blog-cover-heading" aria-busy={busy}><h2 id="blog-cover-heading">미리보기 이미지</h2><div className={s.coverLayout}><div className={s.coverPreview}>{post.coverUrl ? <Image key={post.coverUrl} src={post.coverUrl} alt="현재 블로그 미리보기 이미지" fill unoptimized sizes="(max-width: 700px) 100vw, 260px" className={s.coverImage} /> : <p className={s.coverEmpty}>등록된 미리보기 이미지가 없습니다.</p>}</div><div className={s.coverDetails}><p id="blog-cover-help" className={s.status}>블로그 목록과 최신 글 미리보기에 표시할 이미지를 선택해 주세요. 저장하면 바로 반영되며, 원고 본문은 그대로 유지됩니다.</p><p className={s.status}>JPG · PNG · WebP · AVIF / 최대 5MB</p><div className={s.coverActions}><button className={s.primary} type="button" disabled={busy} aria-describedby="blog-cover-help" onClick={() => coverRef.current?.click()}>{post.coverUrl ? "이미지 교체" : "미리보기 이미지 업로드"}</button><input ref={coverRef} type="file" hidden accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif" disabled={busy} aria-label="미리보기 이미지 파일 선택" onChange={e => updateCover(e.target.files?.[0])} />{post.coverUrl !== firstBodyImage && <button className={s.secondary} type="button" disabled={busy} onClick={() => updateCover(undefined, true)}>본문 첫 이미지로 되돌리기</button>}</div>{coverFilename && <p className={s.status}>선택한 파일: {coverFilename}</p>}</div></div></section><section className={s.document}><h2>가져온 문서</h2><p className={s.status}>{post.sourceName} · <a href={`/api/admin/blog/${post.id}/source`}>원본 DOCX 다운로드 ↓</a></p><p className={s.status}>삽입 이미지 {imageCount}개 · 표 {tableCount}개</p><p className={s.status}>미리보기에서 본문과 이미지 순서를 확인해 주세요. 원고를 다시 가져오려면 새 초안을 등록할 수 있습니다.</p><Link className={s.previewLink} href={`/journal/${post.id}`} target="_blank" rel="noopener noreferrer">닥터스 블로그 게시 화면 미리보기 ↗</Link><iframe key={`${post.id}-${post.updatedAt}`} className={s.previewFrame} title="닥터스 블로그 게시 화면 미리보기" src={`/journal/${post.id}?preview=${encodeURIComponent(post.updatedAt)}`} referrerPolicy="same-origin" /></section>
      <div className={s.actions}><div className={s.actionGroup}><button className={s.secondary} type="button" disabled={busy || !dirty} onClick={() => save()}>변경사항 저장</button></div><div className={s.actionGroup}>{post.published ? <button className={s.danger} type="button" disabled={busy} onClick={() => save(false)}>비공개로 전환</button> : <button className={s.primary} type="button" disabled={busy} onClick={() => save(true)}>검토 완료 · 게시하기</button>}</div></div>
      {dirty && <p className={s.status}>아직 저장하지 않은 제목 또는 카테고리 변경사항이 있습니다. 게시하면 변경사항도 함께 저장됩니다.</p>}
    </>}
  </div>;
}
