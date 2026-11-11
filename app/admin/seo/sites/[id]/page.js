'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { RefreshCw, ListChecks, ArrowRight, ChartLine } from 'lucide-react'
import { useSite } from '@/Components/Admin/SEO/SiteContext'
import { useSEO } from '@/Components/Admin/SEO/SEOContext'
import SEOAnalyticsChart from '@/Components/Admin/SEO/SEOAnalyticsChart'
import {
  Alert, Button, Card, CardHeader, Delta, EmptyState, ProgressBar, Skeleton, StatTile, Table, Th, Td, cx, focusRing,
} from '@/Components/Admin/SEO/ui'
import { fmtCompact, fmtInt, fmtPct, fmtPos, pagePath, pctChange } from '@/Components/Admin/SEO/format'
import { sectionHref } from '@/Components/Admin/SEO/sections'

const LEGACY_TABS = ['keywords', 'plan', 'reports', 'settings']

export default function SiteOverviewPage() {
  const { site, analytics, analyticsLoading, sync, syncing } = useSite()
  const { planBySite } = useSEO()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Old links used ?tab=plan etc. Send them to the section's own URL.
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && LEGACY_TABS.includes(tab)) router.replace(sectionHref(site.id, tab))
  }, [searchParams, router, site.id])

  const plan = planBySite[site.id]
  const a = analytics && !analytics.error ? analytics : null
  const prev = a?.previous
  const daily = a?.dailyData || []
  const hasData = a && (daily.length > 0 || a.totalImpressions > 0)

  return (
    <div className="space-y-6">
      {plan?.hasDraft && (
        <Alert
          tone="warn"
          title="A draft plan is waiting for your approval"
          action={<Button size="sm" variant="secondary" href={sectionHref(site.id, 'plan')}>Review draft</Button>}
        >
          Nothing changes on the site until you approve it and ship each task.
        </Alert>
      )}

      {analytics?.error && (
        <Alert tone="bad" title="Couldn’t load analytics">{analytics.error}</Alert>
      )}

      <section aria-label="Last 28 days" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Clicks"
          loading={analyticsLoading}
          value={fmtCompact(a?.totalClicks)}
          delta={<Delta value={pctChange(a?.totalClicks, prev?.totalClicks)} label="vs previous 28 days" />}
          spark={daily.map(d => d.clicks)}
        />
        <StatTile
          label="Impressions"
          loading={analyticsLoading}
          value={fmtCompact(a?.totalImpressions)}
          delta={<Delta value={pctChange(a?.totalImpressions, prev?.totalImpressions)} label="vs previous 28 days" />}
          spark={daily.map(d => d.impressions)}
        />
        <StatTile
          label="Avg. CTR"
          loading={analyticsLoading}
          value={fmtPct(a?.avgCtr)}
          delta={<Delta value={prev ? (a.avgCtr - prev.avgCtr) * 100 : null} suffix=" pts" precision={2} label="vs previous 28 days" />}
          spark={daily.map(d => d.ctr)}
        />
        <StatTile
          label="Avg. position"
          loading={analyticsLoading}
          value={fmtPos(a?.avgPosition)}
          delta={<Delta value={prev && a.avgPosition ? a.avgPosition - prev.avgPosition : null} inverted suffix="" label="vs previous 28 days (lower is better)" />}
          spark={daily.map(d => d.position)}
          sparkInverted
        />
      </section>

      {!analyticsLoading && !hasData && !analytics?.error ? (
        <Card>
          <EmptyState
            icon={ChartLine}
            title="No Search Console data yet"
            description="Pull the last 28 days from Google to see traffic, queries and pages."
            action={<Button variant="primary" icon={RefreshCw} onClick={sync} loading={syncing}>Sync now</Button>}
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Traffic" description="Last 28 days, by day" />
              <div className="p-5">
                {analyticsLoading ? <Skeleton className="h-[260px] w-full" /> : <SEOAnalyticsChart data={daily} />}
              </div>
            </Card>
            <PlanCard site={site} plan={plan} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <TopTable
              title="Top queries"
              loading={analyticsLoading}
              rows={a?.topQueries || []}
              labelKey="query"
              labelHeader="Query"
            />
            <TopTable
              title="Top pages"
              loading={analyticsLoading}
              rows={(a?.topPages || []).map(p => ({ ...p, label: pagePath(p.page) }))}
              labelKey="label"
              labelHeader="Page"
              titleKey="page"
            />
          </div>
        </>
      )}
    </div>
  )
}

function PlanCard({ site, plan }) {
  const href = sectionHref(site.id, 'plan')
  return (
    <Card className="flex flex-col">
      <CardHeader title="SEO plan" />
      <div className="flex flex-1 flex-col p-5">
        {!plan ? (
          <div className="space-y-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-2 w-full" /></div>
        ) : plan.active ? (
          <>
            <p className="text-sm text-adm-muted">{plan.active.month}</p>
            <p className="mt-1 text-2xl font-semibold">
              {plan.active.done}<span className="text-base font-normal text-adm-muted"> of {plan.active.total} tasks done</span>
            </p>
            <ProgressBar value={plan.active.done} max={plan.active.total} className="mt-3" label="Plan progress" />
          </>
        ) : (
          <p className="text-sm text-adm-muted">No active plan. Generate one from the latest Search Console data.</p>
        )}
        <Link href={href} className={cx('mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-adm-accent hover:underline', focusRing, 'rounded')}>
          <ListChecks className="h-4 w-4" aria-hidden />
          {plan?.active ? 'Open plan' : 'Go to plan'}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </Card>
  )
}

function TopTable({ title, rows, labelKey, labelHeader, titleKey, loading }) {
  return (
    <Card>
      <CardHeader title={title} description="Last 28 days" />
      {loading ? (
        <div className="space-y-3 p-5">{[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-5 w-full" />)}</div>
      ) : rows.length === 0 ? (
        <p className="p-5 text-sm text-adm-muted">No data for this period.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>{labelHeader}</Th>
              <Th align="right">Clicks</Th>
              <Th align="right">Impr.</Th>
              <Th align="right">CTR</Th>
              <Th align="right">Pos.</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[titleKey || labelKey]} className="border-t border-adm-border first:border-t-0 hover:bg-adm-raised/50">
                <Td className="max-w-0 w-full">
                  <span className="block truncate text-adm-text" title={r[titleKey || labelKey]}>{r[labelKey]}</span>
                </Td>
                <Td align="right" numeric className="text-adm-text">{fmtInt(r.clicks)}</Td>
                <Td align="right" numeric className="text-adm-muted">{fmtInt(r.impressions)}</Td>
                <Td align="right" numeric className="text-adm-muted">{r.ctr !== undefined ? fmtPct(r.ctr, 1) : '—'}</Td>
                <Td align="right" numeric className="text-adm-muted">{fmtPos(r.position)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
