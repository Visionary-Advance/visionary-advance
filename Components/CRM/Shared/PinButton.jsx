'use client'

import { useState } from 'react'

export default function PinButton({ activityId, isPinned, onToggle, disabled = false }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (loading || disabled) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/activities/${activityId}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: !isPinned }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to toggle pin')
      }

      const data = await res.json()
      if (onToggle) {
        onToggle(data.activity)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || disabled}
      className={`p-1 rounded transition-colors ${
        isPinned
          ? 'text-[#008070] hover:text-[#006b5d]'
          : 'text-[#a1a1aa] hover:text-[#fafafa]'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isPinned ? 'Unpin' : 'Pin'}
    >
      {loading ? (
        <LoadingIcon className="h-4 w-4 animate-spin" />
      ) : (
        <PinIcon className="h-4 w-4" filled={isPinned} />
      )}
    </button>
  )
}

function PinIcon({ className, filled }) {
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4a1 1 0 0 1 .117 1.993L16 6v4.293l1.854 1.854a.5.5 0 0 1 .146.353V14a.5.5 0 0 1-.5.5H13v5.5a.5.5 0 0 1-.41.492L12.5 20.5a.5.5 0 0 1-.492-.41L12 20v-5.5H6.5a.5.5 0 0 1-.492-.41L6 14v-1.5a.5.5 0 0 1 .146-.354L8 10.293V6a1 1 0 0 1-.117-1.993L8 4h8z"/>
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v6l2 2v2H6v-2l2-2V4m4 16v-6" />
    </svg>
  )
}

function LoadingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  )
}
