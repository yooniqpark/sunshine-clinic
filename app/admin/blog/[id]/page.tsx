import { notFound, redirect } from "next/navigation";
import { auth } from "@yooniqpark/clinic-core/auth";
import { getBlogPost } from "@/lib/blog";
import BlogEditor from "../BlogEditor";

export const dynamic = "force-dynamic";
export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/admin/login");
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();
  return <BlogEditor initialPost={post} />;
}
