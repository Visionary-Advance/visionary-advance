// Check work/reply.json before it's submitted. Used by Claude inside the claude-chat-run
// GitHub Action (plan mode), run from a read-only copy outside the workspace.
//
// Usage: node devops/scripts/validate-reply.mjs <reply.json>

import { readFileSync } from 'node:fs';
import { validateReply } from '../../lib/claude-chat-validate.js';

const [replyFile] = process.argv.slice(2);
try {
  if (!replyFile) throw new Error('Usage: validate-reply.mjs <reply.json>');
  const reply = JSON.parse(readFileSync(replyFile, 'utf8'));
  const errors = validateReply(reply);
  if (errors.length) throw new Error(`Reply is invalid:\n  - ${errors.join('\n  - ')}`);
  console.log(`✓ Valid ${reply.kind}${reply.kind === 'plan' ? `: ${reply.steps.length} steps, size ${reply.size}` : ''}`);
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exitCode = 1;
}
