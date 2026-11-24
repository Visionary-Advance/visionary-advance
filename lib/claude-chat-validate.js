// lib/claude-chat-validate.js
// The shape of Claude's reply in a chat plan run (work/reply.json). Shared by the
// validator Claude runs inside the claude-chat-run Action (devops/scripts/validate-reply.mjs)
// and the callback that saves the reply. No imports, so it runs outside the app.
//
//   { kind: 'answer' | 'question', text, thread_title? }
//   { kind: 'plan', title, summary, steps: [{ title, detail?, files? }], files?, risks?,
//     size: 'S' | 'M' | 'L', needs_migration?, thread_title? }

export const REPLY_KINDS = ['answer', 'question', 'plan'];
export const PLAN_SIZES = ['S', 'M', 'L'];

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

function checkStrings(list, name, { max = 50, maxLen = 300 } = {}, errors) {
  if (list == null) return;
  if (!Array.isArray(list)) return errors.push(`${name} must be an array of strings`);
  if (list.length > max) errors.push(`${name} has ${list.length} items (max ${max})`);
  list.forEach((v, i) => {
    if (!isStr(v)) errors.push(`${name}[${i}] must be a non-empty string`);
    else if (v.length > maxLen) errors.push(`${name}[${i}] is longer than ${maxLen} characters`);
  });
}

/** @returns {string[]} problems; empty when the reply is valid */
export function validateReply(reply) {
  const errors = [];
  if (!reply || typeof reply !== 'object' || Array.isArray(reply)) return ['reply must be a JSON object'];
  if (!REPLY_KINDS.includes(reply.kind)) return [`kind must be one of ${REPLY_KINDS.join(', ')}`];

  if (reply.thread_title != null && (!isStr(reply.thread_title) || reply.thread_title.length > 80)) {
    errors.push('thread_title must be a short string (max 80 characters)');
  }

  if (reply.kind !== 'plan') {
    if (!isStr(reply.text)) errors.push('text is required');
    else if (reply.text.length > 20000) errors.push('text is longer than 20000 characters');
    return errors;
  }

  if (!isStr(reply.title)) errors.push('title is required');
  else if (reply.title.length > 100) errors.push('title is longer than 100 characters');
  if (!isStr(reply.summary)) errors.push('summary is required');
  else if (reply.summary.length > 3000) errors.push('summary is longer than 3000 characters');
  if (!PLAN_SIZES.includes(reply.size)) errors.push(`size must be one of ${PLAN_SIZES.join(', ')}`);
  if (reply.needs_migration != null && typeof reply.needs_migration !== 'boolean') {
    errors.push('needs_migration must be true or false');
  }

  if (!Array.isArray(reply.steps) || reply.steps.length === 0) {
    errors.push('steps must be a non-empty array');
  } else {
    if (reply.steps.length > 20) errors.push(`steps has ${reply.steps.length} items (max 20)`);
    reply.steps.forEach((step, i) => {
      if (!step || typeof step !== 'object') return errors.push(`steps[${i}] must be an object`);
      if (!isStr(step.title)) errors.push(`steps[${i}].title is required`);
      else if (step.title.length > 200) errors.push(`steps[${i}].title is longer than 200 characters`);
      if (step.detail != null && (typeof step.detail !== 'string' || step.detail.length > 3000)) {
        errors.push(`steps[${i}].detail must be a string (max 3000 characters)`);
      }
      checkStrings(step.files, `steps[${i}].files`, { max: 30 }, errors);
    });
  }
  checkStrings(reply.files, 'files', { max: 60 }, errors);
  checkStrings(reply.risks, 'risks', { max: 15, maxLen: 600 }, errors);
  return errors;
}

/** Only the fields the app keeps, trimmed. Call after validateReply passes. */
export function normalizeReply(reply) {
  const base = { kind: reply.kind, thread_title: reply.thread_title?.trim() || null };
  if (reply.kind !== 'plan') return { ...base, text: reply.text.trim() };
  return {
    ...base,
    title: reply.title.trim(),
    summary: reply.summary.trim(),
    size: reply.size,
    needs_migration: Boolean(reply.needs_migration),
    steps: reply.steps.map((s) => ({
      title: s.title.trim(),
      detail: s.detail?.trim() || '',
      files: (s.files || []).map((f) => f.trim()),
    })),
    files: (reply.files || []).map((f) => f.trim()),
    risks: (reply.risks || []).map((r) => r.trim()),
  };
}
