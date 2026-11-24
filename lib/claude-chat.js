// lib/claude-chat.js
// Claude chat (DevOps → Claude). You message Claude from the admin app; each message
// starts a claude-chat-run GitHub Action (Claude Code, Claude Pro OAuth token) that
// reads the repo and replies with an answer, a question or a plan. Approving a plan
// starts an execute run that commits to a branch and opens a PR, which then waits in
// DevOps → Approvals like an SEO Ship PR. Nothing merges without Approve & merge.
//
// Flow: postMessage → claude_runs row (queued) → workflow_dispatch → the Action pulls
// GET /api/devops/claude/runs/[id]/input → POSTs /api/devops/claude/runs/callback
// (SEO_SHIP_CALLBACK_SECRET bearer) → applyRunCallback saves Claude's message.
// One run at a time per thread (unique index). Tables: migrations/012_claude_chat.sql.

import { validateReply, normalizeReply } from './claude-chat-validate';
import { sendPushToAll } from './push';

const WORKFLOW_FILE = 'claude-chat-run.yml';
const IN_FLIGHT = ['queued', 'running'];
// The execute job times out at 45 min; past this a run that never reported back is dead.
const STALE_MS = 75 * 60 * 1000;
const DEFAULT_REPO = 'Visionary-Advance/visionary-advance';
const MAX_MESSAGE = 10000;
const TRANSCRIPT_MESSAGES = 40;
const TRANSCRIPT_BODY = 6000;

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
    );
  }
  return supabaseClient;
}

export class ChatError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const THREAD_SELECT =
  'id, title, title_source, repo, base_branch, status, state, preview, branch, pr_url, pr_number, pr_status, created_by, created_at, updated_at, last_message_at';
const RUN_SELECT =
  'id, thread_id, mode, status, trigger_message_id, plan_message_id, run_url, error, meta, requested_by, created_at, started_at, finished_at';

const now = () => new Date().toISOString();
const preview = (text) => String(text || '').replace(/\s+/g, ' ').trim().slice(0, 160);
const isStale = (run) => IN_FLIGHT.includes(run.status) && Date.now() - new Date(run.created_at).getTime() > STALE_MS;

function workflowRepo() {
  return process.env.CLAUDE_CHAT_WORKFLOW_REPO || DEFAULT_REPO;
}

function dispatchToken() {
  return process.env.GITHUB_CLAUDE_DISPATCH_TOKEN || process.env.GITHUB_SEO_DISPATCH_TOKEN || null;
}

async function push({ title, body, threadId }) {
  try {
    await sendPushToAll({ title, body: preview(body), url: `/admin/devops/claude/${threadId}`, tag: `claude-${threadId}` });
  } catch (err) {
    console.error('Claude chat push failed:', err);
  }
}

/** Where a thread rests once nothing is running. */
function restingState(thread, kind) {
  if (kind === 'plan' || kind === 'question') return 'waiting';
  return thread.pr_status === 'open' ? 'pr_open' : 'idle';
}

async function loadThread(threadId) {
  const { data, error } = await getSupabase().from('claude_threads').select(THREAD_SELECT).eq('id', threadId).maybeSingle();
  if (error) throw error;
  if (!data) throw new ChatError('Chat not found', 404);
  return data;
}

async function loadRun(runId) {
  const { data, error } = await getSupabase().from('claude_runs').select(RUN_SELECT).eq('id', runId).maybeSingle();
  if (error) throw error;
  if (!data) throw new ChatError('Run not found', 404);
  return data;
}

async function addMessage(threadId, { role, kind = 'text', body = '', data = {}, runId = null, by = null }, threadUpdate = {}) {
  const supabase = getSupabase();
  const at = now();
  const { data: message, error } = await supabase
    .from('claude_messages')
    .insert({ thread_id: threadId, role, kind, body, data, run_id: runId, created_by: by, created_at: at })
    .select()
    .single();
  if (error) throw error;

  const update = { updated_at: at, last_message_at: at, ...threadUpdate };
  if (kind !== 'event' && body) update.preview = preview(body);
  const { error: threadError } = await supabase.from('claude_threads').update(update).eq('id', threadId);
  if (threadError) throw threadError;
  return message;
}

async function setThread(threadId, update) {
  const { error } = await getSupabase().from('claude_threads').update({ ...update, updated_at: now() }).eq('id', threadId);
  if (error) throw error;
}

/** Fail in-flight runs that never reported back, so the thread isn't stuck "working". */
async function reapStale(threadId) {
  const supabase = getSupabase();
  const { data: runs, error } = await supabase
    .from('claude_runs').select(RUN_SELECT).eq('thread_id', threadId).in('status', IN_FLIGHT);
  if (error) throw error;
  for (const run of (runs || []).filter(isStale)) {
    const { data: updated } = await supabase
      .from('claude_runs')
      .update({ status: 'failed', error: 'No word from GitHub for over an hour', finished_at: now(), updated_at: now() })
      .eq('id', run.id).in('status', IN_FLIGHT).select('id');
    if (updated?.length) {
      await addMessage(threadId, {
        role: 'system', kind: 'error', runId: run.id,
        body: 'No word from GitHub for over an hour, so this run was stopped. Open the run for details, then retry.',
        data: { run_url: run.run_url, mode: run.mode },
      }, { state: 'failed' });
    }
  }
}

// ---------------------------------------------------------------------------
// Threads

export async function listThreads({ status = 'open', limit = 60 } = {}) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('claude_threads').select(THREAD_SELECT)
    .eq('status', status)
    .order('last_message_at', { ascending: false })
    .limit(limit);
  if (error) throw error;

  const working = (data || []).filter((t) => t.state === 'working').map((t) => t.id);
  if (!working.length) return data || [];

  const { data: runs, error: runsError } = await supabase
    .from('claude_runs').select('thread_id, status, created_at').in('thread_id', working).in('status', IN_FLIGHT);
  if (runsError) throw runsError;
  const stale = new Set((runs || []).filter(isStale).map((r) => r.thread_id));
  // A thread marked working with no run in flight (lost callback) reads as failed too.
  const live = new Set((runs || []).filter((r) => !isStale(r)).map((r) => r.thread_id));
  for (const id of working) if (!live.has(id)) stale.add(id);
  await Promise.all([...stale].map((id) => reapStale(id).catch(() => {})));
  return (data || []).map((t) => (stale.has(t.id) ? { ...t, state: 'failed' } : t));
}

/** Chats waiting on you (a plan to approve or a question to answer), for the nav badge. */
export async function countWaiting() {
  const { count, error } = await getSupabase()
    .from('claude_threads').select('id', { count: 'exact', head: true })
    .eq('status', 'open').eq('state', 'waiting');
  if (error) throw error;
  return count || 0;
}

export async function getThread(threadId) {
  await reapStale(threadId);
  const supabase = getSupabase();
  const thread = await loadThread(threadId);
  const [{ data: messages, error: mError }, { data: runs, error: rError }] = await Promise.all([
    supabase.from('claude_messages').select('*').eq('thread_id', threadId).order('created_at', { ascending: true }).limit(500),
    supabase.from('claude_runs').select(RUN_SELECT).eq('thread_id', threadId).order('created_at', { ascending: false }).limit(1),
  ]);
  if (mError) throw mError;
  if (rError) throw rError;
  return { thread, messages: messages || [], latestRun: runs?.[0] || null, canDispatch: Boolean(dispatchToken()) };
}

export async function createThread({ text, user }) {
  const body = cleanText(text);
  const by = user?.email || null;
  const { data: thread, error } = await getSupabase()
    .from('claude_threads')
    .insert({ title: titleFrom(body), repo: DEFAULT_REPO, created_by: by, preview: preview(body) })
    .select(THREAD_SELECT)
    .single();
  if (error) throw error;
  await postMessage(thread.id, body, user);
  return loadThread(thread.id);
}

export async function updateThread(threadId, { title, status }) {
  const update = {};
  if (title !== undefined) {
    const t = String(title || '').trim();
    if (!t || t.length > 80) throw new ChatError('Title must be 1–80 characters');
    update.title = t;
    update.title_source = 'user';
  }
  if (status !== undefined) {
    if (!['open', 'archived'].includes(status)) throw new ChatError('Invalid status');
    update.status = status;
  }
  if (!Object.keys(update).length) throw new ChatError('Nothing to update');
  await loadThread(threadId);
  await setThread(threadId, update);
  return loadThread(threadId);
}

function cleanText(text) {
  const body = String(text || '').trim();
  if (!body) throw new ChatError('Write a message first');
  if (body.length > MAX_MESSAGE) throw new ChatError(`Keep messages under ${MAX_MESSAGE} characters`);
  return body;
}

function titleFrom(text) {
  const line = text.split('\n').find((l) => l.trim()) || 'New chat';
  return line.length > 60 ? `${line.slice(0, 57).trimEnd()}…` : line;
}

// ---------------------------------------------------------------------------
// Runs

/** Your message → a plan-mode run. */
export async function postMessage(threadId, text, user) {
  const body = cleanText(text);
  await reapStale(threadId);
  const thread = await loadThread(threadId);
  if (thread.status !== 'open') throw new ChatError('This chat is archived. Reopen it to keep going.', 409);
  await assertIdle(threadId);

  const message = await addMessage(threadId, { role: 'user', body, by: user?.email || null });
  const run = await startRun(thread, { mode: 'plan', triggerMessageId: message.id, user });
  return { message, run };
}

async function assertIdle(threadId) {
  const { data, error } = await getSupabase()
    .from('claude_runs').select('id').eq('thread_id', threadId).in('status', IN_FLIGHT).limit(1);
  if (error) throw error;
  if (data?.length) throw new ChatError('Claude is still working on this chat. Wait for it, or cancel the run.', 409);
}

async function startRun(thread, { mode, triggerMessageId = null, planMessageId = null, user }) {
  const supabase = getSupabase();
  const token = dispatchToken();
  if (!token) throw new ChatError('GITHUB_SEO_DISPATCH_TOKEN is not configured, so Claude can\'t be started', 500);

  const { data: run, error } = await supabase
    .from('claude_runs')
    .insert({
      thread_id: thread.id, mode, status: 'queued', trigger_message_id: triggerMessageId,
      plan_message_id: planMessageId, requested_by: user?.email || null, meta: { stage: 'queued', stage_at: now() },
    })
    .select(RUN_SELECT)
    .single();
  if (error) {
    if (error.code === '23505') throw new ChatError('Claude is already working on this chat', 409);
    throw error;
  }
  await setThread(thread.id, { state: 'working' });

  const repo = workflowRepo();
  const ref = process.env.CLAUDE_CHAT_WORKFLOW_REF || 'main';
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref, inputs: { run_id: run.id, thread_id: thread.id, mode } }),
  });

  if (!res.ok) {
    const text = await res.text();
    const hint = res.status === 404
      ? ` (is .github/workflows/${WORKFLOW_FILE} pushed to ${ref} in ${repo}, and can the token see it?)`
      : '';
    const message = `GitHub dispatch failed: ${res.status} ${text.slice(0, 200)}${hint}`;
    await supabase.from('claude_runs')
      .update({ status: 'failed', error: message, finished_at: now(), updated_at: now() }).eq('id', run.id);
    await addMessage(thread.id, {
      role: 'system', kind: 'error', runId: run.id, body: `Couldn't start Claude. ${message}`, data: { mode },
    }, { state: 'failed' });
    throw new ChatError(message, 502);
  }
  return run;
}

/** Approve or dismiss a proposed plan. Approving starts an execute run pinned to it. */
export async function resolvePlan(messageId, action, user) {
  if (!['approve', 'dismiss'].includes(action)) throw new ChatError('Invalid action');
  const supabase = getSupabase();
  const { data: message, error } = await supabase
    .from('claude_messages').select('*').eq('id', messageId).maybeSingle();
  if (error) throw error;
  if (!message || message.kind !== 'plan') throw new ChatError('Plan not found', 404);
  if (message.data?.status !== 'proposed') {
    throw new ChatError(`This plan is already ${message.data?.status || 'resolved'}`, 409);
  }

  await reapStale(message.thread_id);
  const thread = await loadThread(message.thread_id);
  if (thread.status !== 'open') throw new ChatError('This chat is archived', 409);
  if (action === 'approve') await assertIdle(thread.id);

  const status = action === 'approve' ? 'approved' : 'dismissed';
  const { data: claimed, error: claimError } = await supabase
    .from('claude_messages')
    .update({ data: { ...message.data, status, resolved_at: now(), resolved_by: user?.email || null } })
    .eq('id', messageId)
    .eq('data->>status', 'proposed')
    .select('id');
  if (claimError) throw claimError;
  if (!claimed?.length) throw new ChatError('This plan was just resolved somewhere else', 409);

  if (action === 'dismiss') {
    await addMessage(thread.id, { role: 'system', kind: 'event', body: 'Plan dismissed.', by: user?.email || null },
      { state: thread.pr_status === 'open' ? 'pr_open' : 'idle' });
    return { status };
  }

  await addMessage(thread.id, {
    role: 'system', kind: 'event', by: user?.email || null,
    body: thread.pr_status === 'open' ? 'Plan approved. Claude is updating the open PR.' : 'Plan approved. Claude is making the changes.',
  });
  try {
    const run = await startRun(thread, { mode: 'execute', planMessageId: messageId, triggerMessageId: messageId, user });
    return { status, run };
  } catch (err) {
    // Couldn't start: put the plan back so it can be approved again.
    await supabase.from('claude_messages').update({ data: { ...message.data, status: 'proposed' } }).eq('id', messageId);
    throw err;
  }
}

/** Cancel an in-flight run, or retry the latest failed/cancelled one. */
export async function runAction(runId, action, user) {
  const supabase = getSupabase();
  const run = await loadRun(runId);
  const thread = await loadThread(run.thread_id);

  if (action === 'cancel') {
    if (!IN_FLIGHT.includes(run.status)) throw new ChatError(`This run is already ${run.status}`, 409);
    const { data: updated, error } = await supabase
      .from('claude_runs')
      .update({ status: 'cancelled', error: `Cancelled by ${user?.email || 'admin'}`, finished_at: now(), updated_at: now() })
      .eq('id', run.id).in('status', IN_FLIGHT).select('id');
    if (error) throw error;
    if (!updated?.length) throw new ChatError('This run just finished', 409);
    await cancelGitHubRun(run.run_url);
    if (run.mode === 'execute' && run.plan_message_id) await reproposePlan(run.plan_message_id);
    await addMessage(thread.id, { role: 'system', kind: 'event', runId: run.id, body: 'Run cancelled.', by: user?.email || null },
      { state: run.mode === 'execute' ? 'waiting' : thread.pr_status === 'open' ? 'pr_open' : 'idle' });
    return { status: 'cancelled' };
  }

  if (action === 'retry') {
    if (!['failed', 'cancelled'].includes(run.status)) throw new ChatError('Only a failed or cancelled run can be retried', 409);
    const { data: latest } = await supabase
      .from('claude_runs').select('id').eq('thread_id', thread.id).order('created_at', { ascending: false }).limit(1);
    if (latest?.[0]?.id !== run.id) throw new ChatError('A newer run exists. Retry that one instead.', 409);
    if (thread.status !== 'open') throw new ChatError('This chat is archived', 409);
    await assertIdle(thread.id);

    if (run.mode === 'execute' && run.plan_message_id) {
      const { data: plan } = await supabase.from('claude_messages').select('data').eq('id', run.plan_message_id).maybeSingle();
      if (!['approved', 'proposed'].includes(plan?.data?.status)) throw new ChatError('That plan is no longer current', 409);
      if (plan.data.status === 'proposed') {
        await supabase.from('claude_messages').update({ data: { ...plan.data, status: 'approved' } }).eq('id', run.plan_message_id);
      }
    }
    await addMessage(thread.id, { role: 'system', kind: 'event', body: 'Retrying.', by: user?.email || null });
    const next = await startRun(thread, {
      mode: run.mode, triggerMessageId: run.trigger_message_id, planMessageId: run.plan_message_id, user,
    });
    return { status: 'queued', run: next };
  }

  throw new ChatError('Invalid action');
}

async function reproposePlan(planMessageId) {
  const supabase = getSupabase();
  const { data } = await supabase.from('claude_messages').select('data').eq('id', planMessageId).maybeSingle();
  if (data?.data?.status === 'approved') {
    await supabase.from('claude_messages').update({ data: { ...data.data, status: 'proposed' } }).eq('id', planMessageId);
  }
}

async function cancelGitHubRun(runUrl) {
  const m = String(runUrl || '').match(/github\.com\/([^/]+\/[^/]+)\/actions\/runs\/(\d+)/);
  const token = dispatchToken();
  if (!m || !token) return; // Not started yet: the Action's input fetch sees "cancelled" and stops.
  try {
    await fetch(`https://api.github.com/repos/${m[1]}/actions/runs/${m[2]}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    });
  } catch (err) {
    console.error('Cancelling the GitHub run failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Runner endpoints (claude-chat-run Action)

function slugify(text) {
  return String(text || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'change';
}

function transcriptLine(m) {
  const body = String(m.body || '').slice(0, TRANSCRIPT_BODY);
  if (m.kind === 'plan') {
    const p = m.data || {};
    const steps = (p.steps || []).map((s, i) => `  ${i + 1}. ${s.title}`).join('\n');
    return { role: 'assistant', kind: 'plan', status: p.status, text: `Plan: ${p.title}\n${p.summary}\nSteps:\n${steps}` };
  }
  if (m.kind === 'pr') {
    const d = m.data || {};
    return { role: 'assistant', kind: 'pr', text: `${d.updated ? 'Updated' : 'Opened'} PR #${d.pr_number} on ${d.branch}. Summary: ${body}` };
  }
  return { role: m.role, kind: m.kind, text: body };
}

/** The packet the Action works from. Only served while the run is in flight. */
export async function getRunInput(runId) {
  const supabase = getSupabase();
  const run = await loadRun(runId);
  if (!IN_FLIGHT.includes(run.status)) throw new ChatError(`Run is ${run.status}`, 409);
  const thread = await loadThread(run.thread_id);

  const { data: recent, error } = await supabase
    .from('claude_messages').select('id, role, kind, body, data, created_at')
    .eq('thread_id', thread.id).order('created_at', { ascending: false }).limit(TRANSCRIPT_MESSAGES);
  if (error) throw error;
  const transcript = (recent || []).reverse().map((m) => ({ ...transcriptLine(m), at: m.created_at }));

  const prOpen = thread.pr_status === 'open' && thread.branch;
  const input = {
    run_id: run.id,
    mode: run.mode,
    thread: { id: thread.id, title: thread.title, repo: thread.repo, base_branch: thread.base_branch },
    checkout_ref: prOpen ? thread.branch : thread.base_branch,
    existing_pr: prOpen ? { url: thread.pr_url, number: thread.pr_number, branch: thread.branch } : null,
    transcript,
  };

  if (run.mode === 'execute') {
    const { data: plan, error: planError } = await supabase
      .from('claude_messages').select('id, data').eq('id', run.plan_message_id).maybeSingle();
    if (planError) throw planError;
    if (!plan || plan.data?.status !== 'approved') throw new ChatError('The approved plan is missing', 409);
    let branch = run.meta?.branch;
    if (!branch) {
      branch = prOpen ? thread.branch : `claude/${slugify(plan.data.title)}-${run.id.slice(0, 6)}`;
      await supabase.from('claude_runs').update({ meta: { ...(run.meta || {}), branch } }).eq('id', run.id);
    }
    const { status: _s, resolved_at: _a, resolved_by: _b, ...approved } = plan.data;
    input.plan = approved;
    input.branch = branch;
  }
  return input;
}

/**
 * Reports from the Action: running (with meta.stage) | completed | failed.
 * Plan mode completes with `reply`; execute mode completes with `result` (the PR).
 */
export async function applyRunCallback({ run_id, status, run_url, meta, reply, result, error: errorText }) {
  if (!run_id) throw new ChatError('run_id is required');
  if (!['running', 'completed', 'failed'].includes(status)) throw new ChatError('Invalid status');

  const supabase = getSupabase();
  const run = await loadRun(run_id);
  const at = now();
  const update = { updated_at: at };
  if (run_url) update.run_url = run_url;
  if (meta && typeof meta === 'object') {
    update.meta = { ...(run.meta || {}), ...meta };
    if (meta.stage && meta.stage !== run.meta?.stage) update.meta.stage_at = at;
  }

  // Never move a finished or cancelled run (late reports, retries of the callback).
  if (!IN_FLIGHT.includes(run.status)) return { ...run, ignored: true };

  if (status === 'running') {
    update.status = 'running';
    update.started_at = run.started_at || at;
    const { error } = await supabase.from('claude_runs').update(update).eq('id', run.id).in('status', IN_FLIGHT);
    if (error) throw error;
    return { ...run, ...update };
  }

  const thread = await loadThread(run.thread_id);

  // Claim the finish first so a duplicate callback can't post the reply twice.
  const finish = async (fields) => {
    const { data, error } = await supabase
      .from('claude_runs').update({ ...update, ...fields, finished_at: at }).eq('id', run.id).in('status', IN_FLIGHT).select('id');
    if (error) throw error;
    return Boolean(data?.length);
  };

  if (status === 'failed') {
    const message = String(errorText || 'Run failed').slice(0, 1500);
    if (!(await finish({ status: 'failed', error: message }))) return { ...run, ignored: true };
    if (run.mode === 'execute' && run.plan_message_id) await reproposePlan(run.plan_message_id);
    await addMessage(thread.id, {
      role: 'system', kind: 'error', runId: run.id, body: message, data: { run_url: run_url || run.run_url, mode: run.mode },
    }, { state: 'failed' });
    await push({ title: `Claude hit a problem: ${thread.title}`, body: message, threadId: thread.id });
    return { ...run, status: 'failed' };
  }

  if (run.mode === 'plan') {
    const problems = validateReply(reply);
    if (problems.length) throw new ChatError(`Reply is invalid: ${problems.join('; ')}`, 422);
    const r = normalizeReply(reply);
    if (!(await finish({ status: 'completed', error: null }))) return { ...run, ignored: true };

    const threadUpdate = { state: restingState(thread, r.kind) };
    // Claude names the chat once; a title you set yourself is never replaced.
    if (r.thread_title && thread.title_source === 'auto') Object.assign(threadUpdate, { title: r.thread_title, title_source: 'claude' });
    if (r.kind === 'plan') {
      // A new plan replaces any still-open one.
      const { data: open } = await supabase
        .from('claude_messages').select('id, data').eq('thread_id', thread.id).eq('kind', 'plan').eq('data->>status', 'proposed');
      await Promise.all((open || []).map((m) =>
        supabase.from('claude_messages').update({ data: { ...m.data, status: 'superseded' } }).eq('id', m.id)));
    }
    const { kind, thread_title: _t, text, ...plan } = r;
    await addMessage(thread.id, {
      role: 'assistant', kind, runId: run.id,
      body: kind === 'plan' ? plan.summary : text,
      data: kind === 'plan' ? { ...plan, status: 'proposed', run_url: run_url || run.run_url } : { run_url: run_url || run.run_url },
    }, threadUpdate);

    const title = kind === 'plan' ? `Plan ready: ${plan.title}` : kind === 'question' ? 'Claude has a question' : 'Claude replied';
    await push({ title, body: kind === 'plan' ? plan.summary : text, threadId: thread.id });
    return { ...run, status: 'completed' };
  }

  // Execute mode: the Action pushed a branch and opened (or updated) the PR.
  const prUrl = result?.pr_url;
  const m = String(prUrl || '').match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
  if (!m) throw new ChatError('result.pr_url is required', 422);
  if (!(await finish({ status: 'completed', error: null }))) return { ...run, ignored: true };

  const files = Array.isArray(result.files) ? result.files.slice(0, 200).map(String) : [];
  const summary = String(result.summary || '').slice(0, 8000) || 'See the diff.';
  const updated = Boolean(result.updated);
  if (run.plan_message_id) {
    const { data: plan } = await supabase.from('claude_messages').select('data').eq('id', run.plan_message_id).maybeSingle();
    if (plan) {
      await supabase.from('claude_messages')
        .update({ data: { ...plan.data, status: 'shipped', pr_url: prUrl } }).eq('id', run.plan_message_id);
    }
  }
  await addMessage(thread.id, {
    role: 'assistant', kind: 'pr', runId: run.id, body: summary,
    data: {
      pr_url: prUrl, pr_number: Number(m[1]), branch: result.branch || run.meta?.branch || null, files, updated,
      needs_migration: Boolean(result.needs_migration), run_url: run_url || run.run_url,
    },
  }, {
    state: 'pr_open', pr_status: 'open', pr_url: prUrl, pr_number: Number(m[1]),
    branch: result.branch || run.meta?.branch || thread.branch,
  });
  await push({ title: `${updated ? 'PR updated' : 'PR ready'}: ${thread.title}`, body: summary, threadId: thread.id });
  return { ...run, status: 'completed' };
}

// ---------------------------------------------------------------------------
// Approvals (lib/devops-approvals.js lists chat PRs next to SEO Ship PRs)

/** Threads with an open PR, each with its latest PR message. */
export async function listOpenPrThreads() {
  const supabase = getSupabase();
  const { data: threads, error } = await supabase
    .from('claude_threads').select(THREAD_SELECT).eq('pr_status', 'open').order('updated_at', { ascending: true });
  if (error) throw error;
  if (!threads?.length) return [];
  return Promise.all(threads.map(async (t) => ({
    thread: t, prMessage: await latestPrMessage(t.id), plan: await latestShippedPlan(t.id),
  })));
}

export async function countOpenPrThreads() {
  const { count, error } = await getSupabase()
    .from('claude_threads').select('id', { count: 'exact', head: true }).eq('pr_status', 'open');
  if (error) throw error;
  return count || 0;
}

export async function getPrThread(threadId) {
  const thread = await loadThread(threadId);
  return { thread, prMessage: await latestPrMessage(threadId), plan: await latestShippedPlan(threadId) };
}

async function latestPrMessage(threadId) {
  const { data } = await getSupabase()
    .from('claude_messages').select('id, body, data, created_at')
    .eq('thread_id', threadId).eq('kind', 'pr').order('created_at', { ascending: false }).limit(1);
  return data?.[0] || null;
}

async function latestShippedPlan(threadId) {
  const { data } = await getSupabase()
    .from('claude_messages').select('id, data')
    .eq('thread_id', threadId).eq('kind', 'plan').eq('data->>status', 'shipped')
    .order('created_at', { ascending: false }).limit(1);
  return data?.[0]?.data || null;
}

export async function findOpenPrThreadByUrl(prUrl) {
  const { data, error } = await getSupabase()
    .from('claude_threads').select(THREAD_SELECT).eq('pr_url', prUrl).eq('pr_status', 'open').maybeSingle();
  if (error) throw error;
  return data;
}

/** A chat PR was merged or closed (Approvals, the list sync, or the GitHub webhook). Idempotent. */
export async function recordPrOutcome(threadId, outcome, { by } = {}) {
  if (!['merged', 'closed'].includes(outcome)) throw new ChatError('Invalid outcome');
  const supabase = getSupabase();
  const { data: claimed, error } = await supabase
    .from('claude_threads')
    .update({ pr_status: outcome, state: 'idle', updated_at: now() })
    .eq('id', threadId).eq('pr_status', 'open')
    .select('id, pr_number');
  if (error) throw error;
  if (!claimed?.length) return { recorded: false };
  const n = claimed[0].pr_number;
  await addMessage(threadId, {
    role: 'system', kind: 'event', by: by || null,
    body: outcome === 'merged'
      ? `PR #${n} merged${by ? ` by ${by}` : ''}. Deploying to production.`
      : `PR #${n} was closed without merging.`,
  });
  return { recorded: true };
}

/** "Send back" from Approvals on a chat PR: your note becomes the next message, so Claude re-plans. */
export async function sendBackToClaude(threadId, note, user) {
  return postMessage(threadId, `Changes requested on the PR:\n\n${note}`, user);
}
