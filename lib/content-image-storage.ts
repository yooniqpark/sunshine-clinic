import crypto from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentImageAdapter } from "@yooniqpark/clinic-core/content-types";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const ALLOWED_FORMAT = new Set(["jpeg", "png", "webp", "avif", "heif"]);

function safeSegment(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!normalized) throw new Error("이미지 저장 경로가 올바르지 않습니다.");
  return normalized;
}

function uploadRoot() {
  return process.env.CLINIC_UPLOAD_DIR
    ? path.resolve(process.env.CLINIC_UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
}

function publicPrefix() {
  const configured = process.env.CLINIC_UPLOAD_PUBLIC_PREFIX?.trim() || "/uploads";
  return `/${configured.replace(/^\/+|\/+$/g, "")}`;
}

export const contentImageAdapter: ContentImageAdapter = {
  async upload({ file, group, slug, field, locale }) {
    if (!ALLOWED_MIME.has(file.type)) throw new Error("JPG, PNG, WebP, AVIF 이미지만 업로드할 수 있습니다.");
    if (file.size > MAX_BYTES) throw new Error("이미지는 12MB 이하만 업로드할 수 있습니다.");

    const source = Buffer.from(await file.arrayBuffer());
    // Keep the native image codec out of public-page startup. It is loaded only
    // when an administrator actually uploads an image.
    const { default: sharp } = await import("sharp");
    const pipeline = sharp(source, { failOn: "error", limitInputPixels: 40_000_000 });
    const metadata = await pipeline.metadata();
    if (!metadata.format || !ALLOWED_FORMAT.has(metadata.format)) throw new Error("지원하지 않는 이미지 형식입니다.");

    const output = await pipeline
      .rotate()
      .resize({ width: 3200, height: 3200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toBuffer({ resolveWithObject: true });

    const safeGroup = safeSegment(group);
    const safeSlug = safeSegment(slug);
    const safeField = safeSegment(field);
    const safeLocale = safeSegment(locale);
    const directory = path.join(uploadRoot(), "content", safeGroup, safeSlug);
    await mkdir(directory, { recursive: true });

    const filename = `${safeField}-${safeLocale}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
    const temporary = path.join(directory, `.${filename}.tmp`);
    const destination = path.join(directory, filename);
    await writeFile(temporary, output.data, { flag: "wx", mode: 0o644 });
    await rename(temporary, destination);

    return {
      url: `${publicPrefix()}/content/${safeGroup}/${safeSlug}/${filename}`,
      width: output.info.width,
      height: output.info.height,
      bytes: output.info.size,
    };
  },
};
