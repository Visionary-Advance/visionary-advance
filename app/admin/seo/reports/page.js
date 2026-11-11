'use client';

// Every report across sites. Each row opens the report inside its site's Reports section.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Globe, Send } from 'lucide-react';
import { usePersistedState } from '@/lib/usePersistedState';
import { useSEO } from '@/Components/Admin/SEO/SEOContext';
import {
  Badge, Button, Card, Delta, EmptyState, PageHeader, PageLoader, SegmentedControl, Table, Th, Td,
  cx, focusRing, inputClass, useSort,
} from '@/Components/Admin/SEO/ui';
import { fmtDate, fmtInt, fmtPct, hostOf, reportPeriod } from '@/Components/Admin/SEO/format';

export default function SEOReportsPage() {
  const { googleConnected, sites } = useSEO();
  const [reports, setReports] = useState(null);
  const [siteFilter, setSiteFilter] = usePersistedState('siteFilter', 'all');
  const [statusFilter, setStatusFilter] = usePersistedState('statusFilter', 'all');

  useEffect(() => {
    if (!googleConnected) return;
    fetch('/api/seo/reports?limit=50')
      .then(r => r.json())
      .then(d => setReports(d.reports || []))
      .catch(() => setReports([]));
  }, [googleConnected]);

  const filtered = useMemo(() => (reports || []).filter(r =>
    (siteFilter === 'all' || r.site_id === siteFilter) &&
    (statusFilter === 'all' || (statusFilter === 'sent' ? r.status === 'sent' : r.status !== 'sent'))
  ), [reports, siteFilter, statusFilter]);

  const [sorted, sortProps] = useSort(filtered, { key: 'created_at', dir: 'desc' }, {
    site: r => (r.site?.display_name || r.site?.site_url || '').toLowerCase(),
    created_at: r => new Date(r.created_at).getTime(),
  });

  if (googleConnected === null) return <PageLoader />;

  if (googleConnected === false) {
    return (
      <>
        <PageHeader title="Reports" />
        <Card>
          <EmptyState icon={Globe} title="Connect your Google account" description="Reports are built from Search Console data." action={<Button variant="primary" href="/admin">Connect Google account</Button>} />
        </Card>
      </>
    );
  }

  const sentCount = (reports || []).filter(r => r.status === 'sent').length;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'All sites', href: '/admin/seo' }, { label: 'Reports' }]}
        title="Reports"
        description="Monthly reports across every site. Generate new ones from a site's Reports section."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {sites.length > 1 && (
          <select
            value={siteFilter}
            onChange={e => setSiteFilter(e.target.value)}
            aria-label="Filter by site"
            className={cx(inputClass, 'w-auto min-w-[12rem]')}
          >
            <option value="all">All sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.display_name || hostOf(s.site_url)}</option>)}
          </select>
        )}
        <SegmentedControl
          label="Filter by status"
          size="sm"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All', count: reports?.length ?? 0 },
            { value: 'sent', label: 'Sent', count: sentCount },
            { value: 'draft', label: 'Not sent', count: (reports?.length ?? 0) - sentCount },
          ]}
        />
      </div>

      <Card>
        {reports === null ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={reports.length === 0 ? 'No reports yet' : 'No reports match these filters'}
            description={reports.length === 0 ? "Open a site and generate its first report from the Reports section." : undefined}
            action={reports.length === 0 ? <Button href="/admin/seo">Go to sites</Button> : undefined}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th {...sortProps('site', 'asc')}>Site</Th>
                <Th>Period</Th>
                <Th align="right" {...sortProps('total_clicks')}>Clicks</Th>
                <Th align="right" className="hidden md:table-cell" {...sortProps('total_impressions')}>Impr.</Th>
                <Th align="right" className="hidden lg:table-cell">CTR</Th>
                <Th>Status</Th>
                <Th className="hidden sm:table-cell" {...sortProps('created_at')}>Created</Th>
                <Th><span className="sr-only">Open</span></Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(report => {
                const href = `/admin/seo/sites/${report.site_id}/reports?report=${report.id}`;
                return (
                  <tr key={report.id} className="border-t border-adm-border first:border-t-0 hover:bg-adm-raised/50">
                    <Td>
                      <Link href={href} className={cx('rounded font-medium text-adm-text hover:underline', focusRing)}>
                        {report.site?.display_name || hostOf(report.site?.site_url) || 'Unknown'}
                      </Link>
                    </Td>
                    <Td className="whitespace-nowrap text-adm-muted">{reportPeriod(report)}</Td>
                    <Td align="right" numeric>
                      <span className="text-adm-text">{fmtInt(report.total_clicks)}</span>
                      <Delta value={report.clicks_change} className="ml-2" />
                    </Td>
                    <Td align="right" numeric className="hidden md:table-cell">
                      <span className="text-adm-muted">{fmtInt(report.total_impressions)}</span>
                      <Delta value={report.impressions_change} className="ml-2" />
                    </Td>
                    <Td align="right" numeric className="hidden text-adm-muted lg:table-cell">{fmtPct(report.avg_ctr)}</Td>
                    <Td>{report.status === 'sent' ? <Badge tone="good" icon={Send}>Sent</Badge> : <Badge>Draft</Badge>}</Td>
                    <Td className="hidden whitespace-nowrap text-adm-muted sm:table-cell">{fmtDate(report.created_at)}</Td>
                    <Td align="right">
                      <Link href={href} aria-label="Open report" className={cx('inline-flex rounded p-1 text-adm-subtle hover:text-adm-text', focusRing)}>
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
