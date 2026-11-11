'use client';

// A site's reports: the list, one report's detail (kept in ?report= so refreshes and
// links from the global Reports page land on it), scheduling and sending.

import { useEffect, useState } from 'react';
import { CalendarClock, ChevronRight, FileText, FolderKanban, Send, Sparkles } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Delta, EmptyState, PageLoader, Table, Th, Td, cx, focusRing, useToast } from './ui';
import { fmtDate, fmtInt, reportPeriod } from './format';
import ReportView from './reports/ReportView';
import ScheduleModal from './reports/ScheduleModal';
import SendReportModal from './reports/SendReportModal';

function readReportParam() {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('report');
}

function writeReportParam(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('report', id);
  else url.searchParams.delete('report');
  window.history.replaceState(window.history.state, '', url);
}

export default function SEOReportPanel({ site, userEmail }) {
  const notify = useToast();
  const [reports, setReports] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState(readReportParam);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  function select(id) {
    setSelectedId(id);
    writeReportParam(id);
    window.scrollTo({ top: 0 });
  }

  async function loadReports() {
    const res = await fetch(`/api/seo/reports?siteId=${site.id}`);
    const data = await res.json();
    setReports(data.reports || []);
  }

  useEffect(() => {
    if (!site?.id) return;
    (async () => {
      try {
        const [reportsRes, scheduleRes] = await Promise.all([
          fetch(`/api/seo/reports?siteId=${site.id}`),
          fetch(`/api/seo/schedules?siteId=${site.id}`),
        ]);
        const reportsData = await reportsRes.json();
        const scheduleData = await scheduleRes.json();
        setReports(reportsData.reports || []);
        setSchedule(scheduleData.schedule);
      } catch (err) {
        notify(`Couldn't load reports: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [site?.id, notify]);

  async function handleGenerateReport() {
    setGenerating(true);
    try {
      await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, type: 'analytics', days: 60 }),
      });
      const res = await fetch('/api/seo/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReports(r => [data.report, ...r]);
      select(data.report.id);
      notify('Report generated', 'success');
    } catch (err) {
      notify(`Failed to generate report: ${err.message}`, 'error');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <PageLoader />;

  const selected = selectedId ? reports.find(r => r.id === selectedId) : null;

  return (
    <div className="space-y-6">
      {selected ? (
        <ReportView
          report={selected}
          onBack={() => select(null)}
          onSend={() => setShowSendModal(true)}
          onDeleted={id => { setReports(r => r.filter(x => x.id !== id)); select(null); }}
        />
      ) : (
        <>
          <Card>
            <CardHeader
              title="Reports"
              description="Monthly Search Console reports with a plan for the month ahead."
              actions={
                <>
                  <Button size="sm" icon={CalendarClock} onClick={() => setShowScheduleModal(true)}>
                    {schedule ? 'Edit schedule' : 'Schedule'}
                  </Button>
                  <Button size="sm" variant="primary" icon={Sparkles} onClick={handleGenerateReport} loading={generating}>
                    {generating ? 'Syncing & generating…' : 'Generate report'}
                  </Button>
                </>
              }
            />
            {schedule && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-adm-border px-5 py-3 text-sm">
                <CalendarClock className="h-4 w-4 text-adm-accent" aria-hidden />
                <span className="text-adm-text">
                  {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} to {schedule.recipients?.join(', ')}
                </span>
                {schedule.next_run_at && <span className="text-adm-subtle sm:ml-auto">Next run {fmtDate(schedule.next_run_at)}</span>}
              </div>
            )}
            {reports.length === 0 ? (
              <EmptyState icon={FileText} title="No reports yet" description="Generate the first report to see month-over-month results and next steps." />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Period</Th>
                    <Th align="right">Clicks</Th>
                    <Th align="right">Change</Th>
                    <Th align="right" className="hidden sm:table-cell">Tasks</Th>
                    <Th>Status</Th>
                    <Th className="hidden md:table-cell">Created</Th>
                    <Th><span className="sr-only">Open</span></Th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} className="border-t border-adm-border first:border-t-0 hover:bg-adm-raised/50">
                      <Td>
                        <button type="button" onClick={() => select(r.id)} className={cx('rounded text-left font-medium text-adm-text hover:underline cursor-pointer', focusRing)}>
                          {reportPeriod(r)}
                        </button>
                      </Td>
                      <Td align="right" numeric className="text-adm-text">{fmtInt(r.total_clicks)}</Td>
                      <Td align="right"><Delta value={r.clicks_change} /></Td>
                      <Td align="right" numeric className="hidden text-adm-muted sm:table-cell">{r.seo_plan?.tasks?.length || 0}</Td>
                      <Td>
                        <div className="flex gap-1.5">
                          {r.status === 'sent' ? <Badge tone="good" icon={Send}>Sent</Badge> : <Badge>Draft</Badge>}
                          {r.project_id && <Badge tone="accent" icon={FolderKanban}>Project</Badge>}
                        </div>
                      </Td>
                      <Td className="hidden text-adm-muted md:table-cell">{fmtDate(r.created_at)}</Td>
                      <Td align="right">
                        <button type="button" onClick={() => select(r.id)} aria-label={`Open ${reportPeriod(r)}`} className={cx('rounded p-1 text-adm-subtle hover:text-adm-text cursor-pointer', focusRing)}>
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}

      {showScheduleModal && (
        <ScheduleModal
          site={site}
          schedule={schedule}
          userEmail={userEmail}
          onSave={s => { setSchedule(s); setShowScheduleModal(false); notify('Schedule saved', 'success'); }}
          onDelete={() => { setSchedule(null); setShowScheduleModal(false); notify('Schedule deleted', 'info'); }}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

      {showSendModal && selected && (
        <SendReportModal
          report={selected}
          userEmail={userEmail}
          onClose={() => setShowSendModal(false)}
          onSent={() => { setShowSendModal(false); loadReports(); }}
        />
      )}
    </div>
  );
}
