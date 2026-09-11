'use client'

import { useState } from 'react'
import PinButton from './PinButton'

// Only long entries get a toggle — a two-line note doesn't need one, and a
// "Show more" on every row is just noise. Call summaries from Pocket are the
// main thing this exists for.
const COLLAPSE_CHARS = 220
const COLLAPSE_LINES = 4

export function isCollapsible(description) {
  if (!description) return false
  return description.length > COLLAPSE_CHARS || description.split('\n').length > COLLAPSE_LINES
}

export default function ActivityRow({
  activity,
  icon,
  pinnable = false,
  onPinToggle,
  formatDate,
  highlighted = false,
  defaultExpanded = false,
}) {
  const description = activity.description || ''
  const collapsible = isCollapsible(description)
  const [expanded, setExpanded] = useState(defaultExpanded)

  // A row that can't collapse is always fully shown.
  const showFull = expanded || !collapsible

  return (
    <div
      className={
        highlighted
          ? 'flex gap-4 rounded-lg border border-[#008070]/20 bg-[#008070]/5 p-3'
          : 'flex gap-4'
      }
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#171717] text-[#a1a1aa]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#fafafa]">{activity.title}</p>

            {description && (
              <p
                className={`mt-1 whitespace-pre-wrap text-sm text-[#a1a1aa] ${
                  showFull ? '' : 'line-clamp-3'
                }`}
              >
                {description}
              </p>
            )}

            {collapsible && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="mt-1 text-xs font-medium text-[#008070] transition-colors hover:text-[#00a68f]"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <time className="text-xs text-[#a1a1aa]">
              {formatDate(activity.created_at)}
            </time>
            {pinnable && (
              <PinButton
                activityId={activity.id}
                isPinned={activity.is_pinned}
                onToggle={onPinToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
