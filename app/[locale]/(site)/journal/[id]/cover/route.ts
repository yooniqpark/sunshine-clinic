import { getBlogPost } from "@/lib/blog";
import { hasJournalCover } from "@/lib/blog-seo";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (locale !== "ko") return new Response(null, { status: 404 });
  const post = await getBlogPost(id);
  if (!post?.published || !hasJournalCover(post.coverUrl)) return new Response(null, { status: 404 });
  try {
    const { default: sharp } = await import("sharp");
    const encoded = post.coverUrl.slice(post.coverUrl.indexOf(",") + 1);
    const image = await sharp(Buffer.from(encoded, "base64"), { failOn: "error", limitInputPixels: 16_000_000 })
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#fff" })
      .jpeg({ quality: 84 })
      .toBuffer();
    return new Response(new Uint8Array(image), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
