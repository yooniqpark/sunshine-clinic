import { getBlogPost } from "@/lib/blog";
import { journalMediaKey, readJournalBodyImage } from "@/lib/journal-body-images";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string; id: string; key: string }> }) {
  const { locale, id, key } = await params;
  const missing = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (locale !== "ko" || !journalMediaKey.test(key)) return missing();
  const post = await getBlogPost(id);
  if (!post?.published) return missing();
  const image = readJournalBodyImage(post.html, key);
  if (!image) return missing();

  const etag = '"' + key + '"';
  const headers = {
    "Content-Type": image.mime,
    "Cache-Control": "public, no-cache",
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "X-Content-Type-Options": "nosniff",
    ETag: etag,
  };
  // Recheck publication before returning a conditional response.
  if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
  return new Response(new Uint8Array(image.bytes), { headers });
}
