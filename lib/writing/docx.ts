import { Document, HeadingLevel, Packer, PageBreak, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import mammoth from "mammoth";
import { AGENT_NAME, KIND_LABEL, type Agent, type Feedback, type Kind } from "./engine";

/* 원고 → 워드(.docx). 구글 문서·한글(HWP)에서도 열린다. */

const FONT = "맑은 고딕";

/** **굵게** 표시를 실제 굵은 글씨로 (split 결과의 홀수 번째가 굵은 부분) */
function runs(text: string): TextRun[] {
  return text.split(/\*\*(.+?)\*\*/g).flatMap((p, i) => (p ? [new TextRun({ text: p, bold: i % 2 === 1 })] : []));
}

function markdownToParagraphs(md: string): Paragraph[] {
  const out: Paragraph[] = [];
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(#{1,3})\s+(.*)/))) {
      const level = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][m[1].length - 1];
      out.push(new Paragraph({ heading: level, children: runs(m[2].trim()) }));
    } else if ((m = line.match(/^\s*[-*•]\s+(.*)/))) {
      out.push(new Paragraph({ bullet: { level: 0 }, children: runs(m[1]) }));
    } else if ((m = line.match(/^\s*(\d+)[.)]\s+(.*)/))) {
      out.push(new Paragraph({ children: runs(`${m[1]}. ${m[2]}`), indent: { left: 360 } }));
    } else {
      out.push(new Paragraph({ children: runs(line), spacing: { after: 120 } }));
    }
  }
  return out;
}

export type Summary = {
  kind?: Kind;
  writer?: Agent;
  editor?: Agent;
  scores?: number[];
  stop_reason?: string;
  final_feedback?: Feedback;
};

export async function buildDocx(draft: string, summary?: Summary | null): Promise<Buffer> {
  const children: (Paragraph | Table)[] = markdownToParagraphs(draft);

  if (summary) {
    const cell = (t: string, bold = false) =>
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t, bold })] })] });
    const rows: [string, string][] = [
      ["글 종류", summary.kind ? KIND_LABEL[summary.kind] : ""],
      ["작가 / 편집자", `${summary.writer ? AGENT_NAME[summary.writer] : ""} / ${summary.editor ? AGENT_NAME[summary.editor] : ""}`],
      ["점수 변화", (summary.scores ?? []).join(" → ")],
      ["종료 이유", summary.stop_reason ?? ""],
    ];
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ heading: HeadingLevel.HEADING_1, text: "작업 기록" }),
      new Paragraph({ children: [new TextRun({ text: "이 페이지는 참고용입니다. 글을 올릴 때는 앞쪽 원고만 사용하세요.", color: "888888" })] }),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map(([k, v]) => new TableRow({ children: [cell(k, true), cell(v)] })) })
    );
    const fb = summary.final_feedback;
    const list = (title: string, items: string[]) => {
      if (!items.length) return;
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, text: title }));
      items.forEach((s) => children.push(new Paragraph({ bullet: { level: 0 }, text: s })));
    };
    if (fb) {
      list("⚠️ 올리기 전에 직접 확인할 것", fb.fact_check ?? []);
      list("편집자가 꼽은 잘된 점", fb.strengths ?? []);
      list("남은 개선 제안", (fb.fixes ?? []).map((f) => `${f.where}: ${f.how} (${f.why})`));
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: { name: FONT, eastAsia: FONT }, size: 22 } } } },
    sections: [{ children }],
  });
  return Packer.toBuffer(doc);
}

/** 업로드한 파일(.docx / .txt)에서 글자만 뽑는다. */
export async function extractText(name: string, data: Buffer): Promise<string> {
  if (name.toLowerCase().endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: data });
    return value.trim();
  }
  const utf8 = new TextDecoder("utf-8", { fatal: true });
  try {
    return utf8.decode(data).replace(/^﻿/, "").trim();
  } catch {
    // 윈도우 메모장의 옛날 한글 인코딩(CP949)
    return new TextDecoder("euc-kr").decode(data).trim();
  }
}
