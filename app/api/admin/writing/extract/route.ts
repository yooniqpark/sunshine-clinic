import { NextResponse } from "next/server";
import { extractText } from "@/lib/writing/docx";
import { requireAdmin } from "@/lib/writing/service";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

// 첨부 파일(.txt / .docx)에서 글자만 뽑아 돌려준다
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "5MB 이하 파일만 올릴 수 있어요" }, { status: 400 });
  try {
    const text = await extractText(file.name, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "파일을 읽지 못했습니다. .txt 또는 .docx 파일을 올려 주세요." }, { status: 400 });
  }
}
