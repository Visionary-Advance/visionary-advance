'use client';

import { ArrowLeft, ArrowDown, ArrowUp, Check, CircleCheck, FolderKanban, Mail, Minus, Send, Sparkles, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, ConfirmButton, Delta, SectionLabel, Table, Th, Td, cx, useToast } from '../ui';
import { fmtDateTime, fmtInt, fmtPct, fmtPos, reportPeriod } from '../format';

const PRIORITY = {
  high: { label: 'High', tone: 'bad', icon: ArrowUp },
  medium: { label: 'Medium', tone: 'warn', icon: Minus },
  low: { label: 'Low', tone: 'info', icon: ArrowDown },
};
const EFFORT = { small: 'Quick win', medium: 'Medium effort', large: 'Large effort' };

export default function ReportView({ report, onBack, onSend, onDeleted }) {
  const notify = useToast();
  const seoPlan = report.seo_plan;
  const currentMonth = report.month_comparison?.currentMonth;
  const previousMonth = report.month_comparison?.previousMonth;
  const cur = currentMonth?.metrics || {};
  const prev = previousMonth?.metrics || {};
  const trackedKeywords = report.tracked_keywords || [];
  const ga4 = report.ga4;
  const curName = currentMonth?.name || 'Current';
  const prevName = previousMonth?.name || 'Previous';

  async function handleDelete() {
    try {
      const res = await fetch(`/api/seo/reports?reportId=${report.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      notify('Report deleted', 'info');
      onDeleted(report.id);
    } catch (err) {
      notify(`Failed to delete report: ${err.message}`, 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack} className="-ml-2 mb-2">All reports</Button>
          <h2 className="text-xl font-semibold">{reportPeriod(report)}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-adm-muted">
            Generated {fmtDateTime(report.created_at)}
            {report.status === 'sent' ? <Badge tone="good" icon={Send}>Sent</Badge> : <Badge>Draft</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <ConfirmButton icon={Trash2} onConfirm={handleDelete} confirmLabel="Delete permanently">Delete</ConfirmButton>
          <Button variant="primary" icon={Mail} onClick={onSend}>Send report</Button>
        </div>
      </div>

      {report.ai_summary && (
        <Card className="p-5">
          <SectionLabel className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" aria-hidden />Summary</SectionLabel>
          <p className="mt-2 text-sm leading-relaxed text-adm-text">{report.ai_summary}</p>
        </Card>
      )}

      <Card>
        <CardHeader title="Month over month" description={`${curName} compared with ${prevName}`} />
        <Table>
          <thead>
            <tr>
              <Th>Metric</Th>
              <Th align="right">{curName}</Th>
              <Th align="right">{prevName}</Th>
              <Th align="right">Change</Th>
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Clicks" cur={fmtInt(cur.totalClicks)} prev={fmtInt(prev.totalClicks)} delta={<Delta value={report.clicks_change} />} />
            <CompareRow label="Impressions" cur={fmtInt(cur.totalImpressions)} prev={fmtInt(prev.totalImpressions)} delta={<Delta value={report.impressions_change} />} />
            <CompareRow
              label="CTR"
              cur={fmtPct(cur.avgCtr)}
              prev={fmtPct(prev.avgCtr)}
              delta={<Delta value={report.ctr_change != null ? report.ctr_change * 100 : null} suffix=" pts" precision={2} />}
            />
            <CompareRow
              label="Avg. position"
              cur={fmtPos(cur.avgPosition)}
              prev={fmtPos(prev.avgPosition)}
              // position_change is already "positive = moved up", so not inverted.
              delta={<Delta value={report.position_change} suffix="" label="places (positive = moved up)" />}
            />
            {ga4 && (
              <>
                <CompareRow label="Sessions" sub="GA4" cur={fmtInt(ga4.current.sessions)} prev={fmtInt(ga4.previous.sessions)} delta={<Delta value={ga4.changes.sessionsChange} />} />
                <CompareRow label="Users" sub="GA4" cur={fmtInt(ga4.current.totalUsers)} prev={fmtInt(ga4.previous.totalUsers)} delta={<Delta value={ga4.changes.usersChange} />} />
                <CompareRow label="Key events" sub="GA4 conversions" cur={fmtInt(ga4.current.keyEvents)} prev={fmtInt(ga4.previous.keyEvents)} delta={<Delta value={ga4.changes.keyEventsChange} />} />
              </>
            )}
          </tbody>
        </Table>
      </Card>

      {ga4 && (ga4.channels.length > 0 || ga4.landingPages.length > 0 || ga4.keyEvents.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-3">
          <BreakdownTable title="Sessions by channel" rows={ga4.channels} metric="sessions" curName={curName} prevName={prevName} />
          <BreakdownTable title="Top landing pages" rows={ga4.landingPages} metric="sessions" curName={curName} prevName={prevName} />
          <BreakdownTable title="Key events" rows={ga4.keyEvents} metric="keyEvents" curName={curName} prevName={prevName} />
        </div>
      )}

      {trackedKeywords.length > 0 && (
        <Card>
          <CardHeader title="Tracked keywords" description="Rankings for the keywords we're targeting" />
          <Table>
            <thead>
              <tr>
                <Th>Keyword</Th>
                <Th align="right">{curName}</Th>
                <Th align="right">{prevName}</Th>
                <Th align="right">Change</Th>
                <Th align="right">Target</Th>
                <Th align="right">Clicks</Th>
                <Th align="right">Impr.</Th>
              </tr>
            </thead>
            <tbody>
              {trackedKeywords.map(kw => (
                <tr key={kw.id || kw.keyword} className="border-t border-adm-border first:border-t-0">
                  <Td className="text-adm-text">{kw.keyword}</Td>
                  <Td align="right" numeric className="font-medium text-adm-text">{fmtPos(kw.current?.position)}</Td>
                  <Td align="right" numeric className="text-adm-muted">{fmtPos(kw.previous?.position)}</Td>
                  <Td align="right"><Delta value={kw.positionDelta} suffix="" label="places (positive = moved up)" /></Td>
                  <Td align="right" numeric className="text-adm-muted">{kw.target_position ?? '—'}</Td>
                  <Td align="right" numeric className="text-adm-muted">{fmtInt(kw.current?.clicks)}</Td>
                  <Td align="right" numeric className="text-adm-muted">{fmtInt(kw.current?.impressions)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {seoPlan ? (
        <Card>
          <CardHeader
            title={`SEO plan${seoPlan.month ? ` · ${seoPlan.month}` : ''}`}
            description="The plan included with this report"
            actions={report.project_id && (
              <Button size="sm" variant="ghost" icon={FolderKanban} href={`/admin/crm/projects/${report.project_id}`}>View project</Button>
            )}
          />
          <div className="space-y-5 p-5">
            {seoPlan.summary && <p className="text-sm leading-relaxed text-adm-muted">{seoPlan.summary}</p>}
            {seoPlan.goals?.length > 0 && (
              <div>
                <SectionLabel>Goals</SectionLabel>
                <ul className="mt-2 space-y-1.5">
                  {seoPlan.goals.map((goal, i) => (
                    <li key={i} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-adm-accent" aria-hidden />{goal}</li>
                  ))}
                </ul>
              </div>
            )}
            {seoPlan.tasks?.length > 0 && (
              <div>
                <SectionLabel>Tasks ({seoPlan.tasks.length})</SectionLabel>
                <ul className="mt-2 divide-y divide-adm-border rounded-xl border border-adm-border">
                  {seoPlan.tasks.map((task, i) => <ReportTask key={task.id || i} task={task} />)}
                </ul>
              </div>
            )}
            {seoPlan.metrics_to_track?.length > 0 && (
              <div>
                <SectionLabel>Metrics to track</SectionLabel>
                <div className="mt-2 overflow-hidden rounded-xl border border-adm-border">
                  <Table>
                    <thead><tr><Th>Metric</Th><Th align="right">Current</Th><Th align="right">Target</Th></tr></thead>
                    <tbody>
                      {seoPlan.metrics_to_track.map((m, i) => (
                        <tr key={i} className="border-t border-adm-border first:border-t-0">
                          <Td className="text-adm-muted">{m.metric}</Td>
                          <Td align="right" numeric className="text-adm-muted">{m.current_value}</Td>
                          <Td align="right" numeric className="font-medium text-adm-text">{m.target_value}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center text-sm text-adm-muted">No SEO plan was included with this report.</Card>
      )}
    </div>
  );
}

function CompareRow({ label, sub, cur, prev, delta }) {
  return (
    <tr className="border-t border-adm-border first:border-t-0">
      <Td>
        <span className="text-adm-text">{label}</span>
        {sub && <span className="ml-2 text-xs text-adm-subtle">{sub}</span>}
      </Td>
      <Td align="right" numeric className="font-semibold text-adm-text">{cur}</Td>
      <Td align="right" numeric className="text-adm-muted">{prev}</Td>
      <Td align="right">{delta}</Td>
    </tr>
  );
}

function BreakdownTable({ title, rows, metric, curName, prevName }) {
  return (
    <Card>
      <CardHeader title={title} as="h3" />
      {rows.length === 0 ? (
        <p className="p-5 text-sm text-adm-muted">No data</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th><span className="sr-only">Name</span></Th>
              <Th align="right"><span title={curName}>{curName.split(' ')[0]}</span></Th>
              <Th align="right"><span title={prevName}>{prevName.split(' ')[0]}</span></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name} className="border-t border-adm-border first:border-t-0">
                <Td className="max-w-0 w-full"><span className="block truncate text-adm-text" title={row.name}>{row.name}</span></Td>
                <Td align="right" numeric className="text-adm-text">{fmtInt(row.current[metric])}</Td>
                <Td align="right" numeric className="text-adm-muted">{fmtInt(row.previous[metric])}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

function ReportTask({ task }) {
  const p = PRIORITY[task.priority];
  const hasMore = task.files_to_modify?.length > 0 || task.acceptance_criteria?.length > 0;
  return (
    <li className="p-4">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        {p && <Badge tone={p.tone} icon={p.icon}>{p.label}</Badge>}
        {task.category && <Badge>{task.category}</Badge>}
        {task.estimated_effort && <Badge>{EFFORT[task.estimated_effort] || task.estimated_effort}</Badge>}
      </div>
      <p className="text-sm font-medium text-adm-text">{task.title}</p>
      {task.description && <p className="mt-1 text-sm text-adm-muted">{task.description}</p>}
      {hasMore && (
        <details className="group mt-2">
          <summary className={cx('cursor-pointer select-none text-xs font-medium text-adm-accent hover:underline')}>Details</summary>
          <div className="mt-2 space-y-3">
            {task.acceptance_criteria?.length > 0 && (
              <ul className="space-y-1.5">
                {task.acceptance_criteria.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-adm-muted"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />{c}</li>
                ))}
              </ul>
            )}
            {task.files_to_modify?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.files_to_modify.map((f, i) => (
                  <code key={i} className="rounded bg-adm-raised px-1.5 py-0.5 font-mono text-xs text-adm-muted">{f}</code>
                ))}
              </div>
            )}
          </div>
        </details>
      )}
    </li>
  );
}
