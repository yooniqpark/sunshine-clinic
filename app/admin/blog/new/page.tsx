import { redirect } from "next/navigation";
import { auth } from "@yooniqpark/clinic-core/auth";
import BlogEditor from "../BlogEditor";

export const dynamic = "force-dynamic";
export default async function NewBlogPost() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/admin/login");
  return <BlogEditor />;
}
