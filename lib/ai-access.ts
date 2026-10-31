import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { summarizeAiAccess, type AiAccessStats } from './ai-access-summary';
export type { AiAccessStats } from './ai-access-summary';

export async function getAiAccessStats(now = new Date()): Promise<AiAccessStats> {
  const file = process.env.CLINIC_AI_ACCESS_FILE || (process.env.CLINIC_UPLOAD_DIR
    ? path.join(path.dirname(path.resolve(process.env.CLINIC_UPLOAD_DIR)), 'analytics', 'ai-access.json')
    : path.join(process.cwd(), '.analytics', 'ai-access.json'));
  try {
    return summarizeAiAccess(JSON.parse(await readFile(file, 'utf8')), now);
  } catch { return summarizeAiAccess(null, now); }
}
