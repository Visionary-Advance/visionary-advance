'use client';

// Progress for a background plan run: full card on the Plan tab, compact bar elsewhere.

import { ExternalLink, LoaderCircle } from 'lucide-react';
import { isRunInFlight, runProgress, usePlanRuns, useTicker } from './planRuns';
import { ProgressBar, cx, focusRing } from './ui';

export function usePlanRunProgress(run) {
  const { typicalMs } = usePlanRuns();
  const now = useTicker(isRunInFlight(run));
  return runProgress(run, typicalMs, now);
}

export function RunLink({ run, className }) {
  if (!run?.run_url) return null;
  return (
    <a
      href={run.run_url}
      target="_blank"
      rel="noreferrer"
      className={cx('inline-flex items-center gap-1 underline hover:text-adm-text', focusRing, className)}
    >
      GitHub run <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
}

/** Small inline bar + percent (site table, sidebar). */
export function CompactRunProgress({ run, name, className }) {
  const p = usePlanRunProgress(run);
  if (!p) return null;
  return (
    <span className={cx('flex min-w-0 items-center gap-2', className)} title={`${p.label}. ${p.detail}`}>
      <LoaderCircle className="h-3 w-3 shrink-0 animate-spin text-adm-info" aria-hidden />
      <ProgressBar value={p.pct} className="w-14" label={`${name || 'Plan'} generation progress`} />
      <span className="whitespace-nowrap text-xs tabular-nums text-adm-muted">{p.pct}%</span>
    </span>
  );
}

/** Full progress card for the Plan tab. */
export function RunProgressCard({ run, replacesDraft }) {
  const p = usePlanRunProgress(run);
  if (!p) return null;
  return (
    <div className="rounded-xl border border-blue-500/30 bg-adm-surface p-5" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-adm-info" aria-hidden />
        <div className="min-w-0 flex-1 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-medium text-adm-text">
              Step {p.step} of {p.steps}: {p.label}
            </p>
            <span className="tabular-nums text-adm-muted">{p.pct}%</span>
          </div>
          <ProgressBar value={p.pct} className="mt-3 h-2" label="Plan generation progress" />
          <p className="mt-3 text-adm-muted">
            {p.detail}. It keeps running if you leave this page or switch sites. The result lands here as a
            draft{replacesDraft ? ' and replaces the current draft' : ''}. <RunLink run={run} />
          </p>
        </div>
      </div>
    </div>
  );
}
