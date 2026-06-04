import { prisma } from "@/lib/prisma";

/* ────────────────────────────────────────────────────────────
   OpenAI token usage logger + cost helpers.
   Prices (USD per 1M tokens) — keep in sync with OpenAI pricing.
   ──────────────────────────────────────────────────────────── */

const PRICES_PER_M: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1": { input: 2, output: 8 },
};

export function estimateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const p = PRICES_PER_M[model] ?? PRICES_PER_M["gpt-4o-mini"];
  return (
    (promptTokens * p.input) / 1_000_000 +
    (completionTokens * p.output) / 1_000_000
  );
}

type LogArgs = {
  source: "chat" | "translate" | "other";
  model: string;
  promptTokens: number;
  completionTokens: number;
  locale?: string | null;
  meta?: string | null;
};

export async function logTokenUsage(args: LogArgs) {
  const total = args.promptTokens + args.completionTokens;
  const cost = estimateCostUsd(
    args.model,
    args.promptTokens,
    args.completionTokens
  );
  try {
    await prisma.tokenUsage.create({
      data: {
        source: args.source,
        model: args.model,
        promptTokens: args.promptTokens,
        completionTokens: args.completionTokens,
        totalTokens: total,
        costUsd: cost,
        locale: args.locale ?? null,
        meta: args.meta?.slice(0, 500) ?? null,
      },
    });
  } catch (e) {
    // never block the actual API on logging failure
    console.error("logTokenUsage failed:", e);
  }
}
