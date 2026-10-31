import 'server-only';

export const BLOG_COVER_MAX_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const allowedFormats = new Set(['jpeg', 'png', 'webp', 'avif', 'heif']);

export async function encodeBlogCover(file: File): Promise<string> {
  if (!allowedTypes.has(file.type)) throw new Error('JPG, PNG, WebP, AVIF 이미지를 선택해 주세요.');
  if (!file.size || file.size > BLOG_COVER_MAX_BYTES) throw new Error('이미지는 5MB 이하로 선택해 주세요.');

  try {
    const { default: sharp } = await import('sharp');
    const source = sharp(Buffer.from(await file.arrayBuffer()), {
      failOn: 'error',
      limitInputPixels: 16_000_000,
    });
    const metadata = await source.metadata();
    if (!metadata.format || !allowedFormats.has(metadata.format)) throw new Error('Unsupported format');
    const image = await source.rotate()
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();
    // Covers live with the post, so drafts and immutable releases do not need
    // a separate publicly accessible upload or file lifecycle.
    return `data:image/webp;base64,${image.toString('base64')}`;
  } catch {
    throw new Error('이미지를 읽을 수 없습니다. 정상적인 JPG, PNG, WebP, AVIF 파일을 선택해 주세요.');
  }
}
