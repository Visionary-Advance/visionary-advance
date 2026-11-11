'use client';

// Home of the SEO dashboard: every site in one sortable table with its last-28-day
// numbers and plan progress, plus portfolio totals and the latest reports.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, FileText, Globe, LoaderCircle, Plus, Search, Send, Sparkles, TriangleAlert } from 'lucide-react';
import { useSEO } from '@/Components/Admin/SEO/SEOContext';
import { isRunInFlight, usePlanRuns } from '@/Components/Admin/SEO/planRuns';
import { usePersistedState } from '@/lib/usePersistedState';
import AddSiteModal from '@/Components/Admin/SEO/AddSiteModal';
import {
  Alert, Badge, Button, Card, CardHeader, Delta, EmptyState, PageHeader, PageLoader, ProgressBar, SearchInput,
  Skeleton, StatTile, Table, Th, Td, cx, focusRing, useSort, useToast,
} from '@/Components/Admin/SEO/ui';
import { fmtCompact, fmtDate, fmtInt, fmtPos, hostOf, pctChange, reportPeriod, timeAgo } from '@/Components/Admin/SEO/format';

export default function SEOSitesHome() {
  const router = useRouter();
  const notify = useToast();
  const {
    user, googleConnected, sites, availableSites, sitesLoading, sitesError, refreshSites,
    analyticsBySite, loadAnalytics, planBySite, loadPlanSummary,
  } = useSEO();
  const [search, setSearch] = usePersistedState('search', '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [recentReports, setRecentReports] = useState(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [startingAll, setStartingAll] = useState(false);

  // Background Claude plan runs (GitHub Action, 2 sites at a time).
  const { runs, start: startRuns } = usePlanRuns(null, {
    onFinish: run => {
      loadPlanSummary(run.site_id, { force: true });
      const name = sites.find(s => s.id === run.site_id)?.display_name || 'A site';
      if (run.status === 'completed') notify(`${name}: draft plan ready to review`, 'success');
      else notify(`${name}: plan generation failed`, 'error');
    },
  });
  const generatingCount = runs ? Object.values(runs).filter(isRunInFlight).length : 0;

  useEffect(() => {
    if (!confirmAll) return;
    const t = setTimeout(() => setConfirmAll(false), 5000);
    return () => clearTimeout(t);
  }, [confirmAll]);

  async function handleGenerateAll() {
    if (!confirmAll) { setConfirmAll(true); return; }
    setConfirmAll(false);
    setStartingAll(true);
    try {
      const { started, skipped } = await startRuns('all');
      const extra = skipped?.length ? ` (${skipped.length} already running)` : '';
      notify(started ? `Generating ${started} plan${started === 1 ? '' : 's'}, 2 at a time${extra}. You can leave this page.` : `All sites are already generating${extra}.`, 'success');
    } catch (err) {
      notify(`Couldn't start plan generation: ${err.message}`, 'error');
    } finally {
      setStartingAll(false);
    }
  }

  useEffect(() => {
    sites.forEach(s => { loadAnalytics(s.id); loadPlanSummary(s.id); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites.map(s => s.id).join(',')]);

  useEffect(() => {
    if (!googleConnected) return;
    fetch('/api/seo/reports?limit=5')
      .then(r => r.json())
      .then(d => setRecentReports(d.reports || []))
      .catch(() => setRecentReports([]));
  }, [googleConnected]);

  const rows = useMemo(() => sites.map(site => {
    const a = analyticsBySite[site.id];
    const ok = a && !a.error;
    return {
      site,
      loading: a === undefined,
      error: a?.error,
      clicks: ok ? a.totalClicks : null,
      clicksDelta: ok ? pctChange(a.totalClicks, a.previous?.totalClicks) : null,
      impressions: ok ? a.totalImpressions : null,
      position: ok && a.avgPosition ? a.avgPosition : null,
      plan: planBySite[site.id],
      name: (site.display_name || site.site_url || '').toLowerCase(),
      lastSync: site.last_sync_at ? new Date(site.last_sync_at).getTime() : null,
    };
  }), [sites, analyticsBySite, planBySite]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.includes(q) || r.site.site_url?.toLowerCase().includes(q));
  }, [rows, search]);

  const [sorted, sortProps] = useSort(filtered, { key: 'clicks', dir: 'desc' }, {
    planPct: r => (r.plan?.active?.total ? r.plan.active.done / r.plan.active.total : null),
  });

  const totals = useMemo(() => {
    let clicks = 0, impressions = 0, prevClicks = 0, prevImpr = 0, withPrev = 0, loaded = 0, openTasks = 0, drafts = 0;
    sites.forEach(s => {
      const a = analyticsBySite[s.id];
      if (a && !a.error) {
        loaded++;
        clicks += a.totalClicks || 0;
        impressions += a.totalImpressions || 0;
        if (a.previous) { withPrev++; prevClicks += a.previous.totalClicks || 0; prevImpr += a.previous.totalImpressions || 0; }
      }
      const p = planBySite[s.id];
      if (p?.active) openTasks += p.active.total - p.active.done;
      if (p?.hasDraft) drafts++;
    });
    return {
      clicks, impressions, openTasks, drafts,
      loading: sites.length > 0 && loaded < sites.filter(s => !analyticsBySite[s.id]?.error).length,
      clicksDelta: withPrev ? pctChange(clicks, prevClicks) : null,
      imprDelta: withPrev ? pctChange(impressions, prevImpr) : null,
    };
  }, [sites, analyticsBySite, planBySite]);

  async function handleAddSite(siteUrl, displayName) {
    const res = await fetch('/api/seo/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteUrl, googleEmail: user.email, displayName }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await refreshSites();
    setShowAddModal(false);
    notify('Site added. Sync it to pull its Search Console data.', 'success');
    if (data.site?.id) router.push(`/admin/seo/sites/${data.site.id}`);
  }

  if (googleConnected === null || (googleConnected && sitesLoading && sites.length === 0)) return <PageLoader />;

  if (googleConnected === false) {
    return (
      <>
        <PageHeader title="All sites" />
        <Card>
          <EmptyState
            icon={Globe}
            title="Connect your Google account"
            description="Search Console access is how this dashboard gets clicks, impressions and rankings."
            action={<Button variant="primary" href="/admin">Connect Google account</Button>}
          />
        </Card>
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="All sites"
        description="Search performance over the last 28 days, compared with the 28 days before."
        actions={
          <>
            {sites.length > 0 && (
              <Button
                variant={confirmAll ? 'primary' : 'secondary'}
                icon={Sparkles}
                onClick={handleGenerateAll}
                loading={startingAll}
                disabled={startingAll || generatingCount >= sites.length}
                title="Claude writes a draft plan for every site in the background, 2 at a time. Uses your Claude Pro usage."
              >
                {generatingCount > 0
                  ? `Generating ${generatingCount} plan${generatingCount === 1 ? '' : 's'}…`
                  : confirmAll ? `Generate ${sites.length} plans?` : 'Generate all plans'}
              </Button>
            )}
            <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>Add site</Button>
          </>
        }
      />

      {sitesError && <Alert tone="bad" title="Couldn't load sites" className="mb-6">{sitesError}</Alert>}

      {sites.length === 0 ? (
        <Card>
          <EmptyState
            icon={Globe}
            title="Add your first site"
            description="Pick a Search Console property to start tracking its traffic and rankings."
            action={<Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>Add site</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <section aria-label="Portfolio totals" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="Sites" value={fmtInt(sites.length)} hint={totals.drafts ? `${totals.drafts} draft plan${totals.drafts === 1 ? '' : 's'} to review` : 'tracked'} />
            <StatTile label="Clicks" loading={totals.loading} value={fmtCompact(totals.clicks)} delta={<Delta value={totals.clicksDelta} label="vs previous 28 days" />} />
            <StatTile label="Impressions" loading={totals.loading} value={fmtCompact(totals.impressions)} delta={<Delta value={totals.imprDelta} label="vs previous 28 days" />} />
            <StatTile label="Open plan tasks" value={fmtInt(totals.openTasks)} hint="across active plans" />
          </section>

          <Card>
            <div className="flex flex-col gap-3 border-b border-adm-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold">Sites <span className="font-normal text-adm-subtle">{filtered.length}</span></h2>
              <SearchInput value={search} onChange={setSearch} placeholder="Search sites" icon={Search} className="sm:w-64" />
            </div>
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-adm-muted">No sites match “{search}”.</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th {...sortProps('name', 'asc')}>Site</Th>
                    <Th align="right" {...sortProps('clicks')}>Clicks</Th>
                    <Th align="right" {...sortProps('clicksDelta')}>Change</Th>
                    <Th align="right" className="hidden md:table-cell" {...sortProps('impressions')}>Impr.</Th>
                    <Th align="right" className="hidden md:table-cell" {...sortProps('position', 'asc')}>Avg. pos.</Th>
                    <Th className="hidden lg:table-cell" {...sortProps('planPct')}>Plan</Th>
                    <Th className="hidden xl:table-cell" {...sortProps('lastSync')}>Synced</Th>
                    <Th><span className="sr-only">Open</span></Th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(r => <SiteRow key={r.site.id} row={r} run={runs?.[r.site.id]} />)}
                </tbody>
              </Table>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Recent reports"
              actions={<Button size="sm" variant="ghost" href="/admin/seo/reports">View all</Button>}
            />
            {recentReports === null ? (
              <div className="space-y-3 p-5">{[0, 1, 2].map(i => <Skeleton key={i} className="h-5 w-full" />)}</div>
            ) : recentReports.length === 0 ? (
              <EmptyState icon={FileText} title="No reports yet" description="Generate one from a site's Reports section." />
            ) : (
              <ul className="divide-y divide-adm-border">
                {recentReports.map(report => (
                  <li key={report.id}>
                    <Link
                      href={`/admin/seo/sites/${report.site_id}/reports?report=${report.id}`}
                      className={cx('flex items-center gap-4 px-5 py-3 hover:bg-adm-raised/50', focusRing)}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-adm-text">{report.site?.display_name || hostOf(report.site?.site_url) || 'Unknown site'}</span>
                        <span className="block text-xs text-adm-subtle">{reportPeriod(report)}</span>
                      </span>
                      <span className="hidden text-sm tabular-nums text-adm-muted sm:inline">{fmtInt(report.total_clicks)} clicks</span>
                      {report.status === 'sent' ? <Badge tone="good" icon={Send}>Sent</Badge> : <Badge>Draft</Badge>}
                      <ChevronRight className="h-4 w-4 text-adm-subtle" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      {showAddModal && (
        <AddSiteModal availableSites={availableSites} onAdd={handleAddSite} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function SiteRow({ row, run }) {
  const { site, loading, error, plan } = row;
  const href = `/admin/seo/sites/${site.id}`;
  const cell = (content, cls) => (loading ? <Skeleton className={cx('ml-auto h-4', cls || 'w-12')} /> : content);
  return (
    <tr className="border-t border-adm-border first:border-t-0 hover:bg-adm-raised/50">
      <Td className="max-w-0 w-full">
        <Link href={href} className={cx('block rounded', focusRing)}>
          <span className="block truncate font-medium text-adm-text hover:underline">{site.display_name || hostOf(site.site_url)}</span>
          <span className="block truncate text-xs text-adm-subtle">{hostOf(site.site_url)}</span>
        </Link>
      </Td>
      <Td align="right" numeric className="text-adm-text">
        {error ? <span title={error} className="inline-flex items-center gap-1 text-adm-warn"><TriangleAlert className="h-3.5 w-3.5" aria-hidden />Error</span> : cell(fmtInt(row.clicks))}
      </Td>
      <Td align="right">{cell(<Delta value={row.clicksDelta} label="vs previous 28 days" />)}</Td>
      <Td align="right" numeric className="hidden text-adm-muted md:table-cell">{cell(fmtInt(row.impressions))}</Td>
      <Td align="right" numeric className="hidden text-adm-muted md:table-cell">{cell(fmtPos(row.position), 'w-8')}</Td>
      <Td className="hidden lg:table-cell">
        {!plan ? <Skeleton className="h-4 w-24" /> : (
          <div className="flex min-w-[9rem] items-center gap-2">
            {plan.active ? (
              <>
                <ProgressBar value={plan.active.done} max={plan.active.total} className="w-16" label={`${site.display_name} plan progress`} />
                <span className="whitespace-nowrap text-xs tabular-nums text-adm-muted">{plan.active.done}/{plan.active.total}</span>
              </>
            ) : (
              <span className="text-xs text-adm-subtle">No plan</span>
            )}
            {isRunInFlight(run) ? (
              <Badge tone="info" icon={LoaderCircle} className="[&>svg]:animate-spin" title="Claude is writing a draft plan">
                {run.status === 'queued' ? 'Queued' : 'Generating'}
              </Badge>
            ) : run?.status === 'failed' && !plan.hasDraft ? (
              <Badge tone="bad" icon={TriangleAlert} title={run.error || 'Plan generation failed'}>Failed</Badge>
            ) : plan.hasDraft ? (
              <Badge tone="warn">Draft</Badge>
            ) : null}
          </div>
        )}
      </Td>
      <Td className="hidden whitespace-nowrap text-xs text-adm-muted xl:table-cell" title={site.last_sync_at ? fmtDate(site.last_sync_at) : undefined}>
        {site.last_sync_at ? timeAgo(site.last_sync_at) : <span className="text-adm-warn">Never</span>}
      </Td>
      <Td align="right">
        <Link href={href} aria-label={`Open ${site.display_name || site.site_url}`} className={cx('inline-flex rounded p-1 text-adm-subtle hover:text-adm-text', focusRing)}>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </Td>
    </tr>
  );
}
