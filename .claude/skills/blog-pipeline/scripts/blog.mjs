#!/usr/bin/env node
// blog-pipeline 도우미 CLI. 저장소 루트에서 실행합니다.
//
//   node .claude/skills/blog-pipeline/scripts/blog.mjs <명령> [인자]
//
//   init  <원본.docx> [--name 슬러그]     작업 폴더(blog-work/날짜-슬러그) 생성 + 원본 텍스트/이미지 추출
//   read  <파일.docx> [--images 폴더]     docx → 마크다운 출력
//   count <원고.md> [--limit 2000]        본문 글자 수 (공백 포함/제외). 초과하면 종료코드 2
//   build <원고.md> <결과.docx>           마크다운 원고 → 워드 파일
//   gpt   <프롬프트.md> <답변.md> [--attach 파일]   ChatGPT에 보내고 답변 저장
//   image <프롬프트.txt> <결과.png>       ChatGPT로 이미지 생성 (실패 시 OPENAI_API_KEY 있으면 API로)
//   card  <카드.html> <결과.png> [--width 1080]   HTML 인포그래픽 → PNG (한글 글자가 정확함)
//   check                                 ChatGPT 로그인 상태 확인 (창 없음)
//   login                                 처음 한 번: 창을 띄워 ChatGPT 로그인
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../..");
const WORK = process.env.BLOG_WORK_DIR || path.join(REPO, "blog-work");

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = path.join(REPO, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  }
}

function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const k = argv[i].slice(2);
      const next = argv[i + 1];
      flags[k] = next && !next.startsWith("--") ? (i++, next) : true;
    } else pos.push(argv[i]);
  }
  return { pos, flags };
}

const out = (obj) => console.log(JSON.stringify(obj, null, 2));
const need = (v, usage) => {
  if (!v) {
    console.error(`사용법: ${usage}`);
    process.exit(64);
  }
  return v;
};

function slugify(s) {
  return (
    s
      .normalize("NFC")
      .replace(/\.[^.]+$/, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "post"
  );
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

async function gptViaApi(prompt) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI();
  const res = await client.responses.create({ model: process.env.BLOG_GPT_MODEL || "gpt-5", input: prompt });
  return res.output_text;
}

async function imageViaApi(prompt, outPath) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI();
  const res = await client.images.generate({
    model: process.env.BLOG_IMAGE_MODEL || "gpt-image-1",
    prompt,
    size: "1536x1024",
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(res.data[0].b64_json, "base64"));
}

async function main() {
  loadEnv();
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, flags } = parseArgs(rest);
  const io = () => import("./docx-io.mjs");
  const gpt = () => import("./chatgpt.mjs");

  switch (cmd) {
    case "init": {
      const src = path.resolve(need(pos[0], "init <원본.docx> [--name 슬러그]"));
      if (!fs.existsSync(src)) throw new Error(`파일이 없습니다: ${src}`);
      const dir = path.join(WORK, `${today()}-${slugify(flags.name || path.basename(src))}`);
      fs.mkdirSync(path.join(dir, "images"), { recursive: true });
      fs.copyFileSync(src, path.join(dir, "00_원본.docx"));
      const { readDocx } = await io();
      const md = await readDocx(src, path.join(dir, "images"));
      fs.writeFileSync(path.join(dir, "00_원본.md"), md);
      const state = { stage: "initialized", source: src, created: new Date().toISOString() };
      fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify(state, null, 2));
      const { countChars } = await io();
      out({ dir, source_md: path.join(dir, "00_원본.md"), source_chars: countChars(md) });
      break;
    }
    case "read": {
      const { readDocx } = await io();
      console.log(await readDocx(path.resolve(need(pos[0], "read <파일.docx>")), flags.images && path.resolve(flags.images)));
      break;
    }
    case "count": {
      const { countChars } = await io();
      const c = countChars(fs.readFileSync(need(pos[0], "count <원고.md>"), "utf8"));
      const limit = Number(flags.limit || process.env.BLOG_CHAR_LIMIT || 2000);
      out({ ...c, limit, ok: c.withSpaces <= limit });
      if (c.withSpaces > limit) process.exitCode = 2;
      break;
    }
    case "build": {
      const { buildDocx } = await io();
      const md = path.resolve(need(pos[0], "build <원고.md> <결과.docx>"));
      const dest = path.resolve(need(pos[1], "build <원고.md> <결과.docx>"));
      await buildDocx(md, dest, { appendix: !flags["no-appendix"] });
      out({ ok: true, docx: dest });
      break;
    }
    case "gpt": {
      const promptFile = need(pos[0], "gpt <프롬프트.md> <답변.md>");
      const dest = path.resolve(need(pos[1], "gpt <프롬프트.md> <답변.md>"));
      const prompt = fs.readFileSync(promptFile, "utf8");
      let reply;
      const via = process.env.BLOG_GPT_MODE === "api" ? "api" : "chatgpt-web";
      if (via === "api") reply = await gptViaApi(prompt);
      else {
        const { ask } = await gpt();
        const attach = flags.attach ? [path.resolve(flags.attach)] : [];
        reply = await ask(prompt, { attach });
      }
      fs.writeFileSync(dest, reply);
      out({ ok: true, via, reply: dest, chars: reply.length });
      break;
    }
    case "image": {
      const arg = need(pos[0], "image <프롬프트.txt> <결과.png>");
      const prompt = fs.existsSync(arg) ? fs.readFileSync(arg, "utf8") : arg;
      const dest = path.resolve(need(pos[1], "image <프롬프트.txt> <결과.png>"));
      try {
        if (process.env.BLOG_GPT_MODE === "api") throw new Error("api mode");
        const { generateImage } = await gpt();
        await generateImage(prompt, dest);
        out({ ok: true, via: "chatgpt-web", image: dest });
      } catch (e) {
        if (!process.env.OPENAI_API_KEY) throw e;
        await imageViaApi(prompt, dest);
        out({ ok: true, via: "openai-api", image: dest, browserError: String(e.message || e) });
      }
      break;
    }
    case "card": {
      const html = path.resolve(need(pos[0], "card <카드.html> <결과.png>"));
      const dest = path.resolve(need(pos[1], "card <카드.html> <결과.png>"));
      const { chromium } = await import("playwright");
      let browser;
      try {
        browser = await chromium.launch({ headless: true });
      } catch {
        browser = await chromium.launch({ headless: true, channel: "chrome" });
      }
      const page = await browser.newPage({ viewport: { width: Number(flags.width || 1080), height: 800 }, deviceScaleFactor: 2 });
      await page.goto(`file://${html}`);
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.evaluate(() => document.fonts?.ready);
      // body의 첫 요소(카드)만 잘라서 저장 → 여백 없는 이미지
      const card = page.locator("body > *").first();
      if (await card.count()) await card.screenshot({ path: dest });
      else await page.screenshot({ path: dest, fullPage: true });
      await browser.close();
      out({ ok: true, image: dest });
      break;
    }
    case "check": {
      const { checkLogin, PROFILE_DIR } = await gpt();
      const r = await checkLogin();
      out({ ...r, profile: PROFILE_DIR });
      if (!r.ok) process.exitCode = r.code === "NOT_LOGGED_IN" ? 3 : 1;
      break;
    }
    case "login": {
      const { interactiveLogin, PROFILE_DIR } = await gpt();
      const ok = await interactiveLogin();
      out({ ok, profile: PROFILE_DIR });
      if (!ok) process.exitCode = 3;
      break;
    }
    default:
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 15).join("\n").replace(/^\/\/ ?/gm, ""));
      process.exitCode = cmd ? 64 : 0;
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, code: e.code || "ERROR", error: String(e.message || e) }));
  process.exit(e.code === "NOT_LOGGED_IN" ? 3 : 1);
});
