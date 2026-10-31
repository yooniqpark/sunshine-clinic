import assert from 'node:assert/strict';
import { summarizeAiAccess } from '../lib/ai-access-summary';

const access = { botId: 'openai-search', at: '2026-10-31T01:10:00Z', path: '/journal', status: 200, verified: true };
  assert.equal(summarizeAiAccess(null).available, false);
  const snapshot = {
    schemaVersion: 1, updatedAt: '2026-10-31T01:20:00Z', coverageFrom: '2026-10-17T00:00:00Z', coverageTo: '2026-10-31T01:20:00Z',
    openaiIpUpdatedAt: '2026-10-31T00:00:00Z', verifiableBots: ['openai-search'],
    hours: {
      '2026-10-31T01:00:00Z': { bots: { 'openai-search': { requests: 10, verified: 8, ok: 6, last: access }, 'claude-bot': { requests: 2, verified: 0, ok: 1 } }, pages: [access] },
      '2026-10-30T14:00:00Z': { bots: { 'openai-search': { requests: 3, verified: 2, ok: 1 } }, pages: [] },
      '2026-10-01T14:00:00Z': { bots: { 'openai-search': { requests: 20, verified: 20, ok: 20 } }, pages: [] },
      '2026-11-01T01:00:00Z': { bots: { 'openai-search': { requests: 50, verified: 50, ok: 50 } }, pages: [] },
    },
  };
  const stats = summarizeAiAccess(snapshot, new Date('2026-10-31T01:30:00Z'));
  const openai = stats.services.find(service => service.id === 'openai-search')!;
  assert.deepEqual([openai.today, openai.week, openai.month, openai.verifiedMonth, openai.successMonth], [10, 13, 13, 10, 7]);
  assert.equal(stats.services.find(service => service.id === 'claude-bot')?.verifiedMonth, null);
  assert.equal(stats.recent[0].path, '/journal');
  assert.equal(stats.recent[0].verified, true);
  assert.equal(summarizeAiAccess({ schemaVersion: 1 }).available, false);
  console.log('AI access summary: missing/corrupt snapshots, KST day/period boundaries, verification confidence, and successful pages passed');
