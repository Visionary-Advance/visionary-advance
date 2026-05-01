'use client'

import { useEffect, useState } from 'react'
import { PLAN_TIER_LABELS } from '@/lib/seo-tiers'

function Toast({ tone = 'info', message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null
  const palette =
    tone === 'error'
      ? 'bg-red-900/90 border-red-700/60 text-red-100'
      : tone === 'success'
      ? 'bg-teal-900/90 border-teal-700/60 text-teal-100'
      : 'bg-[#171717] border-[#262626] text-gray-100'

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${palette}`}>
      {message}
    </div>
  )
}

function PositionCell({ position }) {
  if (position === null || position === undefined) {
    return <span className="text-gray-600">—</span>
  }
  return <span className="text-white tabular-nums">{position.toFixed(1)}</span>
}

function DeltaCell({ delta }) {
  if (delta === null || delta === undefined) {
    return <span className="text-gray-600">—</span>
  }
  if (Math.abs(delta) < 0.05) {
    return <span className="text-gray-400 tabular-nums">0</span>
  }
  // Positive delta = moved up the rankings (good)
  const up = delta > 0
  return (
    <span className={`tabular-nums ${up ? 'text-teal-400' : 'text-red-400'}`}>
      {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}
    </span>
  )
}

export default function KeywordsTab({ siteId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [toast, setToast] = useState({ message: '', tone: 'info' })

  async function loadKeywords() {
    setLoading(true)
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords`)
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to load keywords')
      setData(body)
    } catch (err) {
      setToast({ message: err.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (siteId) loadKeywords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId])

  const atCap = data ? data.used >= data.limit : false

  async function handleAdd(e) {
    e.preventDefault()
    if (!newKeyword.trim() || atCap || adding) return
    setAdding(true)
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: newKeyword.trim(),
          target_position: newTarget ? Number(newTarget) : null,
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        if (body.code === 'cap_reached') {
          setToast({
            message: `You've hit your ${PLAN_TIER_LABELS[body.tier] || body.tier} plan limit (${body.limit} keywords). Upgrade to track more.`,
            tone: 'error',
          })
        } else {
          setToast({ message: body.error || 'Failed to add keyword', tone: 'error' })
        }
        return
      }
      setNewKeyword('')
      setNewTarget('')
      await loadKeywords()
      setToast({ message: 'Keyword added', tone: 'success' })
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(keywordId) {
    try {
      const res = await fetch(`/api/seo/sites/${siteId}/keywords/${keywordId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to delete keyword')
      }
      await loadKeywords()
    } catch (err) {
      setToast({ message: err.message, tone: 'error' })
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
      setToast({ message: err.message, tone: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    )
  }

  const usedPct = data ? Math.min(100, (data.used / data.limit) * 100) : 0

  return (
    <div className="space-y-6">
      <Toast {...toast} onClose={() => setToast({ message: '', tone: 'info' })} />

      {/* Header: usage + add form */}
      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Tracked Keywords</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {PLAN_TIER_LABELS[data?.tier] || 'Basic'} plan ·{' '}
              <span className="text-white">{data?.used ?? 0}</span> / {data?.limit ?? 0} used
            </p>
          </div>
        </div>

        <div className="h-1.5 w-full bg-[#171717] rounded-full overflow-hidden mb-5">
          <div
            className={`h-full transition-all ${atCap ? 'bg-red-500' : 'bg-teal-500'}`}
            style={{ width: `${usedPct}%` }}
          />
        </div>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="e.g. construction website design"
            disabled={atCap || adding}
            className="flex-1 bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />
          <input
            type="number"
            min="1"
            max="100"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Target rank"
            disabled={atCap || adding}
            className="w-full sm:w-32 bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={atCap || adding || !newKeyword.trim()}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-[#262626] disabled:text-gray-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {adding ? 'Adding…' : 'Add Keyword'}
          </button>
        </form>

        {atCap && (
          <p className="text-xs text-red-400 mt-3">
            You've hit your {PLAN_TIER_LABELS[data?.tier]} plan limit. Remove a keyword or upgrade your plan to add more.
          </p>
        )}

        {data?.gscError && (
          <p className="text-xs text-yellow-500 mt-3">
            Search Console data unavailable: {data.gscError}
          </p>
        )}
      </div>

      {/* Keyword table */}
      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] overflow-hidden">
        {data?.keywords?.length ? (
          <table className="w-full text-sm">
            <thead className="bg-[#171717]">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 font-medium">Keyword</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">Last 28d</th>
                <th className="px-4 py-3 font-medium">Δ</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Clicks</th>
                <th className="px-4 py-3 font-medium">Impr.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.map((kw) => (
                <tr key={kw.id} className="border-t border-[#262626] hover:bg-[#171717]/40">
                  <td className="px-4 py-3 text-gray-100">{kw.keyword}</td>
                  <td className="px-4 py-3"><PositionCell position={kw.current?.position} /></td>
                  <td className="px-4 py-3"><PositionCell position={kw.previous?.position} /></td>
                  <td className="px-4 py-3"><DeltaCell delta={kw.positionDelta} /></td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      defaultValue={kw.target_position ?? ''}
                      onBlur={(e) => {
                        const val = e.target.value === '' ? null : Number(e.target.value)
                        if (val !== kw.target_position) handleUpdateTarget(kw.id, val)
                      }}
                      className="w-16 bg-[#171717] border border-[#262626] rounded px-2 py-1 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{kw.current?.clicks ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{kw.current?.impressions ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(kw.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      aria-label="Delete keyword"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            No keywords tracked yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  )
}
