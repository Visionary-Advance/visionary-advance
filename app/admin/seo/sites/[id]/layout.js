'use client'

// Workspace for one site: loads it once and shares it with every section page.

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ChevronsUpDown, Clock, ExternalLink, RefreshCw, Building2, Check, Globe } from 'lucide-react'
import { useSEO, patchSite } from '@/Components/Admin/SEO/SEOContext'
import { SiteContext } from '@/Components/Admin/SEO/SiteContext'
import { SITE_SECTIONS, sectionHref, currentSection } from '@/Components/Admin/SEO/sections'
import { Badge, Breadcrumbs, Button, EmptyState, PageLoader, cx, focusRing, useToast } from '@/Components/Admin/SEO/ui'
import { hostOf, siteHref, timeAgo, fmtDateTime } from '@/Components/Admin/SEO/format'
import { PLAN_TIER_LABELS } from '@/lib/seo-tiers'

export default function SiteLayout({ children }) {
  const { id } = useParams()
  const pathname = usePathname()
  const notify = useToast()
  const {
    sites, sitesLoading, googleConnected, analyticsBySite, loadAnalytics, loadPlanSummary, updateSiteLocal,
  } = useSEO()
  const site = sites.find(s => s.id === id) || null

  const [syncing, setSyncing] = useState(false)
  const [linkedBusiness, setLinkedBusiness] = useState(null)

  useEffect(() => {
    if (!site?.id) return
    loadAnalytics(site.id)
    loadPlanSummary(site.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id])

  useEffect(() => {
    if (!site?.business_id) { setLinkedBusiness(null); return }
    fetch(`/api/crm/businesses/${site.business_id}`)
      .then(r => r.json())
      .then(data => { if (data.business) setLinkedBusiness(data.business) })
      .catch(() => {})
  }, [site?.business_id])

  const sync = useCallback(async () => {
    if (!site?.id) return
    setSyncing(true)
    try {
      const res = await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, type: 'all', days: 28 }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await loadAnalytics(site.id, { force: true })
      updateSiteLocal(site.id, { last_sync_at: new Date().toISOString() })
      notify('Search Console data synced', 'success')
    } catch (err) {
      notify(`Sync failed: ${err.message}`, 'error')
    } finally {
      setSyncing(false)
    }
  }, [site?.id, loadAnalytics, updateSiteLocal, notify])

  const updateSite = useCallback(async patch => {
    const updated = await patchSite(site.id, patch)
    updateSiteLocal(site.id, { ...patch, ...(updated || {}) })
    return updated
  }, [site?.id, updateSiteLocal])

  const refreshPlanSummary = useCallback(() => site?.id && loadPlanSummary(site.id, { force: true }), [site?.id, loadPlanSummary])

  if (googleConnected === false) {
    return (
      <EmptyState
        icon={Globe}
        title="Connect Google first"
        description="Search Console access is needed to load this site."
        action={<Button variant="primary" href="/admin">Connect Google account</Button>}
      />
    )
  }
  if (!site && (sitesLoading || googleConnected === null)) return <PageLoader />
  if (!site) {
    return (
      <EmptyState
        icon={Globe}
        title="Site not found"
        description="It may have been removed, or it belongs to another Google account."
        action={<Button href="/admin/seo">Back to all sites</Button>}
      />
    )
  }

  const analytics = analyticsBySite[site.id]
  const section = currentSection(pathname, site.id)
  const sectionLabel = SITE_SECTIONS.find(s => s.slug === section)?.label
  const href = siteHref(site.site_url)

  return (
    <SiteContext.Provider
      value={{
        site, analytics, analyticsLoading: analytics === undefined, syncing, sync, updateSite,
        linkedBusiness, setLinkedBusiness, refreshPlanSummary,
      }}
    >
      <header className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'All sites', href: '/admin/seo' },
            { label: site.display_name || hostOf(site.site_url), href: sectionHref(site.id, '') },
            ...(section ? [{ label: sectionLabel }] : []),
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <SiteSwitcher site={site} sites={sites} section={section} />
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-adm-muted">
              {href && (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 rounded hover:text-adm-text', focusRing)}>
                  {hostOf(site.site_url)} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              )}
              <span className="inline-flex items-center gap-1" title={(site.last_sync_at ? `Last synced ${fmtDateTime(site.last_sync_at)}. ` : '') + 'Syncs automatically twice a day.'}>
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {site.last_sync_at ? `Synced ${timeAgo(site.last_sync_at)}` : 'Never synced'}
              </span>
              <Badge tone="neutral">{PLAN_TIER_LABELS[site.plan_tier || 'basic'] || 'Basic'} plan</Badge>
              {linkedBusiness && (
                <Link href={`/admin/crm/businesses/${linkedBusiness.id}`} className={cx('inline-flex items-center gap-1 rounded hover:text-adm-text', focusRing)}>
                  <Building2 className="h-3.5 w-3.5" aria-hidden /> {linkedBusiness.name}
                </Link>
              )}
            </div>
          </div>
          <Button icon={RefreshCw} onClick={sync} loading={syncing}>
            {syncing ? 'Syncing…' : 'Sync data'}
          </Button>
        </div>

        {/* Section tabs on small screens; the sidebar does this job on desktop. */}
        <nav aria-label="Site sections" className="-mx-4 mt-5 overflow-x-auto border-b border-adm-border px-4 lg:hidden">
          <ul className="flex gap-1">
            {SITE_SECTIONS.map(s => {
              const active = s.slug === section
              return (
                <li key={s.slug}>
                  <Link
                    href={sectionHref(site.id, s.slug)}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium',
                      active ? 'text-adm-text' : 'text-adm-muted hover:text-adm-text',
                      focusRing
                    )}
                  >
                    <s.icon className="h-4 w-4" aria-hidden />
                    {s.label}
                    {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-adm-accent" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {children}
    </SiteContext.Provider>
  )
}

// The site name doubles as a switcher that keeps you on the same section.
function SiteSwitcher({ site, sites, section }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const name = site.display_name || hostOf(site.site_url)

  if (sites.length < 2) {
    return <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
  }

  return (
    <div className="relative">
      <h1 className="text-2xl font-semibold tracking-tight">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cx('-ml-1.5 inline-flex max-w-full items-center gap-2 rounded-lg px-1.5 hover:bg-adm-raised cursor-pointer', focusRing)}
        >
          <span className="truncate">{name}</span>
          <ChevronsUpDown className="h-5 w-5 shrink-0 text-adm-subtle" aria-hidden />
          <span className="sr-only">Switch site</span>
        </button>
      </h1>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <ul role="listbox" aria-label="Switch site" className="absolute left-0 top-full z-40 mt-1 max-h-80 w-72 overflow-y-auto rounded-xl border border-adm-border bg-adm-raised p-1 shadow-xl">
            {sites.map(s => (
              <li key={s.id} role="option" aria-selected={s.id === site.id}>
                <button
                  type="button"
                  onClick={() => { setOpen(false); router.push(sectionHref(s.id, section)) }}
                  className={cx('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-adm-hover cursor-pointer', focusRing)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-adm-text">{s.display_name || hostOf(s.site_url)}</span>
                    <span className="block truncate text-xs text-adm-subtle">{hostOf(s.site_url)}</span>
                  </span>
                  {s.id === site.id && <Check className="h-4 w-4 text-adm-accent" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
