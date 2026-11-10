import Link from "next/link";
import { getBlogPost } from "@/lib/blog";
import { journalPostPath } from "@/lib/blog-seo";
import { journalTopicForTreatment } from "@/lib/journal-topics";

export async function RelatedJournal({ locale, treatmentPath }: { locale: string; treatmentPath: string }) {
  if (locale !== "ko") return null;
  const topic = journalTopicForTreatment(treatmentPath);
  if (!topic) return null;
  const post = await getBlogPost(topic.id);
  if (!post?.published) return null;

  return (
    <section aria-labelledby="related-journal" className="border-y border-line bg-cream px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 id="related-journal" className="font-serif text-2xl text-ink">관련 닥터스 블로그</h2>
        <Link className="mt-4 inline-block text-brand-dark underline underline-offset-4" href={journalPostPath(post.id)}>
          {post.title} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
