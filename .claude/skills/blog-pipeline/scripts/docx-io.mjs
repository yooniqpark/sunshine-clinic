// 워드(.docx) 읽기/만들기와 글자 수 세기.
// 원고는 마크다운(.md)으로 쓰고, 이 모듈이 블로그용 워드 파일로 바꿉니다.
import fs from "node:fs";
import path from "node:path";

const FONT = { ascii: "Malgun Gothic", eastAsia: "맑은 고딕", hAnsi: "Malgun Gothic", cs: "Malgun Gothic" };
const REF_HEADING = /^#{1,3}\s*(참고\s*(자료|문헌)|references?|출처)\s*$/i;

// ───────── 머리말(front matter) ─────────
export function splitFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: md.slice(m[0].length) };
}

// ───────── 글자 수 ─────────
/** 본문 글자 수. 머리말·이미지 줄·참고자료 섹션·마크다운 기호는 빼고 셉니다. */
export function countChars(md) {
  const { body } = splitFrontMatter(md);
  const lines = [];
  let inRefs = false;
  for (const raw of body.split(/\r?\n/)) {
    if (REF_HEADING.test(raw.trim())) inRefs = true;
    else if (/^#{1,2}\s/.test(raw) && inRefs) inRefs = false;
    if (inRefs) continue;
    if (/^\s*!\[.*\]\(.*\)\s*$/.test(raw)) continue;
    lines.push(
      raw
        .replace(/^#{1,6}\s+/, "")
        .replace(/^\s*([-*•]|\d+[.)])\s+/, "")
        .replace(/^>\s?/, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
    );
  }
  const text = lines.join("\n").trim();
  return {
    withSpaces: text.replace(/\r?\n/g, "").length,
    withoutSpaces: text.replace(/\s/g, "").length,
  };
}

// ───────── 읽기 ─────────
/** docx → 마크다운. 들어있는 이미지는 imgDir에 저장하고 상대경로로 연결합니다. */
export async function readDocx(file, imgDir) {
  const mammoth = (await import("mammoth")).default;
  let n = 0;
  const options = {};
  if (imgDir) {
    fs.mkdirSync(imgDir, { recursive: true });
    options.convertImage = mammoth.images.imgElement(async (image) => {
      const ext = (image.contentType || "image/png").split("/")[1].replace("jpeg", "jpg");
      const name = `orig-${String(++n).padStart(2, "0")}.${ext}`;
      fs.writeFileSync(path.join(imgDir, name), await image.read());
      return { src: path.join(path.basename(imgDir), name).split(path.sep).join("/") };
    });
  } else {
    // 이미지 폴더를 안 주면 본문에 base64가 쏟아지지 않도록 자리표시만 남깁니다
    options.convertImage = mammoth.images.imgElement(async () => ({ src: `image-${++n}` }));
  }
  const { value } = await mammoth.convertToMarkdown({ path: file }, options);
  return value
    .replace(/__(.+?)__/g, "**$1**")
    .replace(/\\([.\-()!#*_[\]])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ───────── 이미지 크기 ─────────
function imageSize(buf) {
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: "png" };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), type: "jpg" };
      }
      i += 2 + len;
    }
  }
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return { w: 1200, h: 675, type: "webp" };
  return null;
}

async function toWordImage(buf) {
  const size = imageSize(buf);
  if (size && size.type !== "webp") return { data: buf, ...size };
  // webp 등 워드가 못 여는 형식은 sharp로 png 변환
  const sharp = (await import("sharp")).default;
  const png = await sharp(buf).png().toBuffer();
  return { data: png, ...imageSize(png) };
}

// ───────── 만들기 ─────────
function inlineRuns(d, text, base = {}) {
  const runs = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:[^)\s]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push(new d.TextRun({ text: text.slice(last, m.index), font: FONT, ...base }));
    if (m[1] !== undefined) runs.push(new d.TextRun({ text: m[1], bold: true, font: FONT, ...base }));
    else
      runs.push(
        new d.ExternalHyperlink({
          link: m[3],
          children: [new d.TextRun({ text: m[2], style: "Hyperlink", font: FONT, ...base })],
        }),
      );
    last = re.lastIndex;
  }
  if (last < text.length) runs.push(new d.TextRun({ text: text.slice(last), font: FONT, ...base }));
  return runs;
}

/** 마크다운 원고 → 블로그용 docx. 마지막 페이지에 SEO 정보(참고용)를 붙입니다. */
export async function buildDocx(mdPath, outPath, { appendix = true } = {}) {
  const d = await import("docx");
  const md = fs.readFileSync(mdPath, "utf8");
  const baseDir = path.dirname(mdPath);
  const { meta, body } = splitFrontMatter(md);
  const children = [];

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    let m;
    if ((m = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/))) {
      const file = path.resolve(baseDir, m[2]);
      if (!fs.existsSync(file)) {
        children.push(new d.Paragraph({ children: [new d.TextRun({ text: `[이미지 없음: ${m[2]}]`, color: "C00000", font: FONT })] }));
        continue;
      }
      const img = await toWordImage(fs.readFileSync(file));
      const width = Math.min(600, img.w || 600);
      const height = Math.round(width * ((img.h || 338) / (img.w || 600)));
      children.push(
        new d.Paragraph({
          alignment: d.AlignmentType.CENTER,
          children: [
            new d.ImageRun({
              type: img.type,
              data: img.data,
              transformation: { width, height },
              altText: { name: m[1] || "image", title: m[1] || "image", description: m[1] || "" },
            }),
          ],
        }),
      );
      const caption = m[3] || "";
      if (caption)
        children.push(
          new d.Paragraph({
            alignment: d.AlignmentType.CENTER,
            children: [new d.TextRun({ text: caption, italics: true, size: 18, color: "666666", font: FONT })],
          }),
        );
      continue;
    }
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      const level = [d.HeadingLevel.HEADING_1, d.HeadingLevel.HEADING_2, d.HeadingLevel.HEADING_3][m[1].length - 1];
      children.push(new d.Paragraph({ heading: level, children: inlineRuns(d, m[2]), spacing: { before: 240, after: 120 } }));
      continue;
    }
    if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
      children.push(new d.Paragraph({ bullet: { level: 0 }, children: inlineRuns(d, m[1]) }));
      continue;
    }
    if ((m = line.match(/^\s*(\d+)[.)]\s+(.*)$/))) {
      children.push(new d.Paragraph({ indent: { left: 360, hanging: 360 }, children: inlineRuns(d, `${m[1]}. ${m[2]}`) }));
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) {
      children.push(
        new d.Paragraph({
          indent: { left: 400 },
          shading: { type: d.ShadingType.CLEAR, fill: "F3F6FA", color: "auto" },
          border: { left: { style: d.BorderStyle.SINGLE, size: 18, color: "4A7BD0", space: 8 } },
          children: inlineRuns(d, m[1]),
        }),
      );
      continue;
    }
    children.push(new d.Paragraph({ children: inlineRuns(d, line), spacing: { after: 160, line: 360 } }));
  }

  if (appendix && Object.keys(meta).length) {
    const c = countChars(md);
    children.push(new d.Paragraph({ children: [new d.PageBreak()] }));
    children.push(new d.Paragraph({ heading: d.HeadingLevel.HEADING_2, children: inlineRuns(d, "SEO 정보 (참고용 — 게시할 때는 앞쪽 원고만 사용)") }));
    const rows = [
      ["SEO 제목", meta.title],
      ["메인 키워드", meta.keyword],
      ["보조 키워드", meta.sub_keywords],
      ["메타 설명", meta.meta_description],
      ["태그", meta.tags],
      ["본문 글자 수", `공백 포함 ${c.withSpaces}자 / 공백 제외 ${c.withoutSpaces}자`],
    ].filter(([, v]) => v);
    children.push(
      new d.Table({
        width: { size: 100, type: d.WidthType.PERCENTAGE },
        rows: rows.map(
          ([k, v]) =>
            new d.TableRow({
              children: [
                new d.TableCell({
                  width: { size: 25, type: d.WidthType.PERCENTAGE },
                  shading: { type: d.ShadingType.CLEAR, fill: "EEF2F7", color: "auto" },
                  children: [new d.Paragraph({ children: inlineRuns(d, k, { bold: true }) })],
                }),
                new d.TableCell({ children: [new d.Paragraph({ children: inlineRuns(d, String(v)) })] }),
              ],
            }),
        ),
      }),
    );
  }

  const doc = new d.Document({
    creator: "blog-pipeline",
    title: meta.title || "",
    styles: {
      default: { document: { run: { font: FONT, size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 36, bold: true, font: FONT } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", run: { size: 28, bold: true, font: FONT, color: "1F3864" } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", run: { size: 24, bold: true, font: FONT } },
      ],
    },
    sections: [{ properties: {}, children }],
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, await d.Packer.toBuffer(doc));
  return outPath;
}
