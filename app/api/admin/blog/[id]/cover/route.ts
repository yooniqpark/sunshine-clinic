import { blogAdmin, getBlogPost, saveBlogPost } from '@/lib/blog';
import { BLOG_COVER_MAX_BYTES, encodeBlogCover } from '@/lib/blog-cover';

export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get('host') || new URL(req.url).host);
  } catch {
    return false;
  }
}

export async function POST(req: Request, { params }: Context) {
  const user = await blogAdmin();
  if (!user) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  if (!sameOrigin(req)) return Response.json({ error: '잘못된 요청입니다.' }, { status: 403 });
  if (Number(req.headers.get('content-length')) > BLOG_COVER_MAX_BYTES + 256 * 1024) {
    return Response.json({ error: '이미지는 5MB 이하로 선택해 주세요.' }, { status: 413 });
  }
  const post = await getBlogPost((await params).id);
  if (!post) return Response.json({ error: '원고를 찾을 수 없습니다.' }, { status: 404 });

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return Response.json({ error: '이미지 파일을 선택해 주세요.' }, { status: 400 });
    if (file.size > BLOG_COVER_MAX_BYTES) return Response.json({ error: '이미지는 5MB 이하로 선택해 주세요.' }, { status: 413 });
    post.coverUrl = await encodeBlogCover(file);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : '이미지 파일을 확인해 주세요.' }, { status: 400 });
  }

  post.updatedAt = new Date().toISOString();
  try {
    return Response.json({ post: await saveBlogPost(post, user.id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: '이미지를 저장하지 못했습니다. 다시 시도해 주세요.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Context) {
  const user = await blogAdmin();
  if (!user) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  if (!sameOrigin(req)) return Response.json({ error: '잘못된 요청입니다.' }, { status: 403 });
  const post = await getBlogPost((await params).id);
  if (!post) return Response.json({ error: '원고를 찾을 수 없습니다.' }, { status: 404 });
  post.coverUrl = post.html.match(/<img[^>]*src="([^"]+)"/)?.[1] || '';
  post.updatedAt = new Date().toISOString();
  try {
    return Response.json({ post: await saveBlogPost(post, user.id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: '기본 이미지로 되돌리지 못했습니다. 다시 시도해 주세요.' }, { status: 500 });
  }
}
