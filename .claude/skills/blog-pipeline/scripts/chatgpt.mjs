// 사용자 PC에 로그인된 ChatGPT(chatgpt.com)를 보이지 않는 브라우저로 조작합니다.
// - 전용 크롬 프로필(기본: ~/.blog-pipeline/chatgpt-profile)에 로그인 상태를 저장해 두고 재사용합니다.
// - 기본은 headless(창 없음)라 사용자가 하던 작업에 영향이 없습니다.
// - 봇 확인 화면 등으로 headless가 막히면 화면 밖(offscreen) 창으로 한 번 더 시도합니다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const PROFILE_DIR =
  process.env.BLOG_CHATGPT_PROFILE || path.join(os.homedir(), ".blog-pipeline", "chatgpt-profile");
const BASE_URL = process.env.BLOG_CHATGPT_URL || "https://chatgpt.com/";
// 임시 채팅을 쓰면 ChatGPT 대화 목록이 지저분해지지 않습니다. (BLOG_CHATGPT_TEMPORARY=0 으로 끄기)
const TEMPORARY = process.env.BLOG_CHATGPT_TEMPORARY !== "0";

const SEL = {
  input: "#prompt-textarea",
  send: 'button[data-testid="send-button"]',
  stop: 'button[data-testid="stop-button"]',
  assistant: '[data-message-author-role="assistant"]',
  loginButton: '[data-testid="login-button"], a[href*="/auth/login"]',
  fileInput: 'input[type="file"]',
};

export class ChatGPTError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadPlaywright() {
  try {
    return (await import("playwright")).chromium;
  } catch {
    throw new ChatGPTError(
      "NO_PLAYWRIGHT",
      "playwright 패키지를 찾을 수 없습니다. 저장소 폴더에서 `npm install` 을 먼저 실행하세요.",
    );
  }
}

async function launch(mode) {
  const chromium = await loadPlaywright();
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  const args = ["--disable-blink-features=AutomationControlled", "--no-first-run", "--no-default-browser-check"];
  const opts = {
    headless: mode === "headless",
    viewport: { width: 1280, height: 900 },
    locale: "ko-KR",
    acceptDownloads: true,
    args,
  };
  if (mode === "offscreen") args.push("--window-position=-32000,-32000", "--window-size=1280,900");
  // 1순위: PC에 설치된 크롬(사람이 쓰는 브라우저와 동일 → 차단 가능성 낮음). 없으면 Playwright 내장 크로미움.
  const channel = process.env.BLOG_BROWSER_CHANNEL ?? "chrome";
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      return await chromium.launchPersistentContext(PROFILE_DIR, channel ? { ...opts, channel } : opts);
    } catch (e) {
      const msg = String(e?.message || e);
      if (channel && /channel|executable|not found|distribution/i.test(msg)) {
        return await chromium.launchPersistentContext(PROFILE_DIR, opts);
      }
      // 이전 실행이 아직 프로필을 잡고 있으면 잠시 기다렸다 재시도
      if (/ProcessSingleton|SingletonLock|already in use|user data directory/i.test(msg) && attempt < 5) {
        await sleep(5000);
        continue;
      }
      throw e;
    }
  }
}

async function isChallenge(page) {
  const title = (await page.title().catch(() => "")) || "";
  if (/just a moment|잠시만|attention required/i.test(title)) return true;
  return (await page.locator('iframe[src*="challenges.cloudflare.com"]').count().catch(() => 0)) > 0;
}

async function openNewChat(page) {
  const url = TEMPORARY ? `${BASE_URL.replace(/\/$/, "")}/?temporary-chat=true` : BASE_URL;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await page.locator(SEL.input).first().isVisible().catch(() => false)) {
      // 로그인 안 된 상태에서도 입력창이 보이므로 로그인 버튼 유무를 같이 확인
      if (await page.locator(SEL.loginButton).first().isVisible().catch(() => false)) {
        throw new ChatGPTError("NOT_LOGGED_IN", "ChatGPT에 로그인되어 있지 않습니다.");
      }
      return;
    }
    if (/\/auth\/|login/.test(page.url())) throw new ChatGPTError("NOT_LOGGED_IN", "ChatGPT에 로그인되어 있지 않습니다.");
    await sleep(1000);
  }
  if (await isChallenge(page)) throw new ChatGPTError("CHALLENGE", "ChatGPT 봇 확인 화면에 막혔습니다.");
  throw new ChatGPTError("NO_INPUT", "ChatGPT 입력창을 찾지 못했습니다. (화면 구조가 바뀌었을 수 있음)");
}

/** 브라우저를 열고 fn(page)을 실행. headless가 막히면 offscreen으로 재시도. */
export async function withChatGPT(fn) {
  const preferred = process.env.BLOG_CHATGPT_MODE || "headless"; // headless | offscreen | visible
  const modes = preferred === "headless" ? ["headless", "offscreen"] : [preferred];
  let lastErr;
  for (const mode of modes) {
    const ctx = await launch(mode);
    try {
      const page = ctx.pages()[0] || (await ctx.newPage());
      await openNewChat(page);
      return await fn(page);
    } catch (e) {
      lastErr = e;
      if (!(e instanceof ChatGPTError) || !["CHALLENGE", "NO_INPUT"].includes(e.code)) throw e;
    } finally {
      await ctx.close().catch(() => {});
    }
  }
  throw lastErr;
}

async function attachFiles(page, files) {
  if (!files?.length) return;
  await page.locator(SEL.fileInput).first().setInputFiles(files);
  // 업로드가 끝나면 전송 버튼이 활성화됩니다
  await page.waitForTimeout(2000);
  await page.waitForSelector(`${SEL.send}:not([disabled])`, { timeout: 120_000 }).catch(() => {});
}

async function typePrompt(page, text) {
  const box = page.locator(SEL.input).first();
  await box.click();
  // 붙여넣기 이벤트로 넣으면 줄바꿈이 유지되고 긴 글도 빠릅니다
  await page.evaluate(
    ({ sel, t }) => {
      const el = document.querySelector(sel);
      el.focus();
      const dt = new DataTransfer();
      dt.setData("text/plain", t);
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
    },
    { sel: SEL.input, t: text },
  );
  await page.waitForTimeout(500);
  const got = (await box.innerText().catch(() => "")).replace(/\s/g, "").length;
  if (got < text.replace(/\s/g, "").length * 0.8) {
    await box.fill("").catch(() => {});
    await page.keyboard.insertText(text);
  }
}

async function send(page) {
  const btn = page.locator(`${SEL.send}:not([disabled])`).first();
  try {
    await btn.waitFor({ timeout: 30_000 });
    await btn.click();
  } catch {
    await page.keyboard.press("Enter");
  }
}

async function waitForReply(page, prevCount, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  // 새 답변 말풍선이 생길 때까지
  while ((await page.locator(SEL.assistant).count()) <= prevCount) {
    if (Date.now() > deadline) throw new ChatGPTError("TIMEOUT", "ChatGPT 답변이 시작되지 않았습니다.");
    await sleep(1000);
  }
  // 생성 중(정지 버튼 표시)이 끝나고 글자가 3초 이상 변하지 않으면 완료로 판단
  let last = "";
  let stableSince = Date.now();
  while (Date.now() < deadline) {
    const continueBtn = page.getByRole("button", { name: /continue generating|계속 생성/i });
    if (await continueBtn.isVisible().catch(() => false)) await continueBtn.click().catch(() => {});
    const generating = await page.locator(SEL.stop).first().isVisible().catch(() => false);
    const text = await page.locator(SEL.assistant).last().innerText().catch(() => "");
    if (text !== last) {
      last = text;
      stableSince = Date.now();
    }
    if (!generating && text.trim() && Date.now() - stableSince > 3000) return text.trim();
    await sleep(1000);
  }
  throw new ChatGPTError("TIMEOUT", "ChatGPT 답변이 시간 안에 끝나지 않았습니다.");
}

/** 프롬프트를 보내고 답변 텍스트를 돌려줍니다. */
export async function ask(prompt, { attach = [], timeoutMs = 10 * 60_000 } = {}) {
  return withChatGPT(async (page) => {
    await attachFiles(page, attach);
    const prev = await page.locator(SEL.assistant).count();
    await typePrompt(page, prompt);
    await send(page);
    return waitForReply(page, prev, timeoutMs);
  });
}

/** ChatGPT 이미지 생성 → 가장 큰 결과 이미지를 outPath로 저장합니다. */
export async function generateImage(prompt, outPath, { timeoutMs = 8 * 60_000 } = {}) {
  return withChatGPT(async (page) => {
    const prev = await page.locator(SEL.assistant).count();
    await typePrompt(page, prompt);
    await send(page);
    const started = Date.now();
    const deadline = started + timeoutMs;
    while (Date.now() < deadline) {
      const generating = await page.locator(SEL.stop).first().isVisible().catch(() => false);
      const turns = page.locator(SEL.assistant);
      const n = await turns.count();
      if (n > prev && !generating) {
        // 이미지는 답변 말풍선 바깥 컨테이너에 붙는 경우가 있어 마지막 대화 턴 전체에서 찾습니다
        const src = await page.evaluate(() => {
          const turnsEl = document.querySelectorAll('[data-testid^="conversation-turn"], article');
          const scope = turnsEl.length ? turnsEl[turnsEl.length - 1] : document;
          const imgs = [...scope.querySelectorAll("img")].filter(
            (i) => i.complete && i.naturalWidth >= 512 && !/avatar|profile/i.test(i.alt || ""),
          );
          imgs.sort((a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight);
          return imgs[0]?.currentSrc || imgs[0]?.src || null;
        });
        if (src) {
          await sleep(4000); // 점진적 렌더링이 끝나도록 잠시 대기
          const buf = await downloadImage(page, src);
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, buf);
          return outPath;
        }
        const text = await turns.last().innerText().catch(() => "");
        if (text && /can't|cannot|unable|정책|생성할 수 없|도와드릴 수 없/i.test(text) && Date.now() - started > 60_000) {
          throw new ChatGPTError("IMAGE_REFUSED", `ChatGPT가 이미지 생성을 거절했습니다: ${text.slice(0, 200)}`);
        }
      }
      await sleep(2000);
    }
    throw new ChatGPTError("TIMEOUT", "이미지 생성이 시간 안에 끝나지 않았습니다.");
  });
}

async function downloadImage(page, src) {
  if (src.startsWith("data:")) return Buffer.from(src.split(",")[1], "base64");
  const b64 = await page
    .evaluate(async (u) => {
      const r = await fetch(u, { credentials: "include" });
      if (!r.ok) return null;
      const bytes = new Uint8Array(await r.arrayBuffer());
      let s = "";
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(s);
    }, src)
    .catch(() => null);
  if (b64) return Buffer.from(b64, "base64");
  const res = await page.context().request.get(src);
  if (!res.ok()) throw new ChatGPTError("DOWNLOAD", `이미지 다운로드 실패 (${res.status()})`);
  return res.body();
}

/** 처음 한 번: 보이는 창을 띄워 사용자가 직접 로그인. 로그인이 확인되면 자동으로 닫힙니다. */
export async function interactiveLogin() {
  const chromium = await loadPlaywright();
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  const opts = { headless: false, viewport: null, args: ["--disable-blink-features=AutomationControlled"] };
  let ctx;
  try {
    ctx = await chromium.launchPersistentContext(PROFILE_DIR, { ...opts, channel: process.env.BLOG_BROWSER_CHANNEL ?? "chrome" });
  } catch {
    ctx = await chromium.launchPersistentContext(PROFILE_DIR, opts);
  }
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(BASE_URL);
  console.log("열린 크롬 창에서 ChatGPT에 로그인하세요. 로그인이 확인되면 창이 자동으로 닫힙니다. (최대 15분)");
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    const hasInput = await page.locator(SEL.input).first().isVisible().catch(() => false);
    const hasLogin = await page.locator(SEL.loginButton).first().isVisible().catch(() => false);
    if (hasInput && !hasLogin) {
      await sleep(3000);
      await ctx.close();
      return true;
    }
    await sleep(2000);
  }
  await ctx.close();
  return false;
}

/** 로그인 상태만 확인 (창 없음). */
export async function checkLogin() {
  try {
    await withChatGPT(async () => true);
    return { ok: true };
  } catch (e) {
    return { ok: false, code: e.code || "ERROR", message: String(e.message || e) };
  }
}
