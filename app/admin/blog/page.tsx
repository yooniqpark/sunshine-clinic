import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@yooniqpark/clinic-core/auth";
import { listBlogPosts } from "@/lib/blog";
import s from "./blog.module.css";

export const dynamic = "force-dynamic";
export default async function AdminBlog() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/admin/login");
  const posts = await listBlogPosts(true);
  return <div><div className={s.heading}><div><span className={s.eyebrow}>DOCTOR’S NOTES</span><h1>블로그 원고</h1><p className={s.description}>DOCX 원고를 가져온 뒤 미리보기를 확인하고 게시할 수 있습니다.</p></div><Link className={s.primary} href="/admin/blog/new">DOCX 원고 가져오기</Link></div>
    {posts.length === 0 ? <div className={s.empty}>등록된 원고가 없습니다.<br />DOCX 파일을 올리면 비공개 초안으로 저장됩니다.</div> : <div className={s.list}>{posts.map(post => <article key={post.id} className={s.item}><div><span className={`${s.badge} ${post.published ? s.published : ""}`}>{post.published ? "게시됨" : "비공개 초안"}</span><h2>{post.title}</h2><p className={s.itemMeta}>{post.category} · {new Date(post.updatedAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}</p><p className={s.itemMeta}>{post.sourceName}</p></div><div className={s.itemActions}><Link className={s.secondary} href={`/journal/${post.id}`} target="_blank" rel="noopener noreferrer">미리보기 ↗</Link><Link className={s.primary} href={`/admin/blog/${post.id}`}>편집</Link></div></article>)}</div>}
  </div>;
}
