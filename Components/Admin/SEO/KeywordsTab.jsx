'use client'

import { useEffect, useState } from 'react'
import { KeyRound, Plus, Trash2 } from 'lucide-react'
import { PLAN_TIER_LABELS } from '@/lib/seo-tiers'
import {
  Alert, Button, Card, CardHeader, Delta, EmptyState, IconButton, ProgressBar, Skeleton, Table, Th, Td,
  inputClass, cx, useSort, useToast,
} from './ui'
import { fmtInt, fmtPos } from './format'

export default function KeywordsTab({ siteId }) {
  const notify = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newTarget, setNewTarget] = useState('')

  async function loadKeywords() {
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords`)
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to load keywords')
      setData(body)
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (siteId) loadKeywords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId])

  const keywords = data?.keywords || []
  const [sorted, sortProps] = useSort(keywords, { key: null, dir: 'asc' }, {
    keyword: k => k.keyword?.toLowerCase(),
    position: k => k.current?.position ?? null,
    delta: k => k.positionDelta ?? null,
    clicks: k => k.current?.clicks ?? null,
    impressions: k => k.current?.impressions ?? null,
  })

  const atCap = data ? data.used >= data.limit : false
  const tierLabel = PLAN_TIER_LABELS[data?.tier] || 'Basic'

  async function handleAdd(e) {
    e.preventDefault()
    if (!newKeyword.trim() || atCap || adding) return
    setAdding(true)
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim(), target_position: newTarget ? Number(newTarget) : null }),
      })
      const body = await res.json()
      if (!res.ok) {
        notify(
          body.code === 'cap_reached'
            ? `You've hit the ${PLAN_TIER_LABELS[body.tier] || body.tier} plan limit (${body.limit} keywords). Upgrade to track more.`
            : body.error || 'Failed to add keyword',
          'error'
        )
        return
      }
      setNewKeyword('')
      setNewTarget('')
      await loadKeywords()
      notify('Keyword added', 'success')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(kw) {
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords/${kw.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to delete keyword')
      }
      await loadKeywords()
      notify(`Stopped tracking “${kw.keyword}”`, 'info')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function handleUpdateTarget(keywordId, target_position) {
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords/${keywordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_position }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to update target')
      }
      await loadKeywords()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Tracked keywords"
          description="Rankings for the terms you're targeting, from Search Console."
        />
        <div className="space-y-4 p-5">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-adm-muted">{tierLabel} plan</span>
                  <span className="tabular-nums text-adm-text">{data?.used ?? 0} of {data?.limit ?? 0} used</span>
                </div>
                <ProgressBar value={data?.used ?? 0} max={data?.limit || 1} label="Keyword slots used" />
              </div>
              <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="kw-new" className="mb-1.5 block text-sm font-medium">Keyword</label>
                  <input
                    id="kw-new"
                    type="text"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    placeholder="e.g. construction website design"
                    disabled={atCap || adding}
                    className={inputClass}
                  />
                </div>
                <div className="sm:w-36">
                  <label htmlFor="kw-target" className="mb-1.5 block text-sm font-medium">Target rank <span className="font-normal text-adm-subtle">(optional)</span></label>
                  <input
                    id="kw-target"
                    type="number"
                    min="1"
                    max="100"
                    value={newTarget}
                    onChange={e => setNewTarget(e.target.value)}
                    placeholder="3"
                    disabled={atCap || adding}
                    className={inputClass}
                  />
                </div>
                <Button type="submit" variant="primary" icon={Plus} loading={adding} disabled={atCap || !newKeyword.trim()}>
                  Add keyword
                </Button>
              </form>
            </>
          )}
          {atCap && (
            <Alert tone="warn" title="Keyword limit reached">
              Remove a keyword or upgrade the {tierLabel} plan to track more.
            </Alert>
          )}
          {data?.gscError && <Alert tone="warn" title="Search Console data unavailable">{data.gscError}</Alert>}
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="space-y-3 p-5">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-6 w-full" />)}</div>
        ) : keywords.length === 0 ? (
          <EmptyState icon={KeyRound} title="No keywords tracked yet" description="Add the searches you want this site to rank for." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th {...sortProps('keyword', 'asc')}>Keyword</Th>
                <Th align="right" {...sortProps('position', 'asc')}>Position</Th>
                <Th align="right">Prev. 28d</Th>
                <Th align="right" {...sortProps('delta')}>Change</Th>
                <Th align="right">Target</Th>
                <Th align="right" {...sortProps('clicks')}>Clicks</Th>
                <Th align="right" {...sortProps('impressions')}>Impr.</Th>
                <Th><span className="sr-only">Actions</span></Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(kw => {
                const pos = kw.current?.position
                const hitTarget = pos && kw.target_position && pos <= kw.target_position
                return (
                  <tr key={kw.id} className="border-t border-adm-border first:border-t-0 hover:bg-adm-raised/50">
                    <Td className="font-medium text-adm-text">{kw.keyword}</Td>
                    <Td align="right" numeric className={cx('font-medium', hitTarget ? 'text-adm-good' : 'text-adm-text')}>
                      {fmtPos(pos)}
                      {hitTarget && <span className="sr-only"> (target met)</span>}
                    </Td>
                    <Td align="right" numeric className="text-adm-muted">{fmtPos(kw.previous?.position)}</Td>
                    <Td align="right">
                      {/* Positive delta = moved up the rankings, so it's not inverted here. */}
                      <Delta value={kw.positionDelta} suffix="" label="places vs previous 28 days" />
                    </Td>
                    <Td align="right">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        aria-label={`Target rank for ${kw.keyword}`}
                        defaultValue={kw.target_position ?? ''}
                        onBlur={e => {
                          const val = e.target.value === '' ? null : Number(e.target.value)
                          if (val !== kw.target_position) handleUpdateTarget(kw.id, val)
                        }}
                        className={cx(inputClass, 'ml-auto w-16 px-2 py-1 text-right tabular-nums')}
                      />
                    </Td>
                    <Td align="right" numeric className="text-adm-muted">{fmtInt(kw.current?.clicks)}</Td>
                    <Td align="right" numeric className="text-adm-muted">{fmtInt(kw.current?.impressions)}</Td>
                    <Td align="right">
                      <IconButton icon={Trash2} label={`Stop tracking ${kw.keyword}`} size="sm" onClick={() => handleDelete(kw)} className="hover:text-adm-bad" />
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
