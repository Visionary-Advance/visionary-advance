// Components/Admin/SystemForge/ModuleCard.jsx
'use client'

import Link from 'next/link'
import TypeBadge from './TypeBadge'
import CategoryBadge from './CategoryBadge'

export default function ModuleCard({ module, onDelete }) {
  return (
    <div className="group relative rounded-xl border border-[#262626] bg-[#0a0a0a] p-5 transition-colors hover:border-[#008070]">
      <Link href={`/admin/system-forge/vault/${module.id}`} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon type={module.type} className="h-5 w-5 text-[#a1a1aa]" />
          <TypeBadge type={module.type} />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete?.()
          }}
          className="relative z-10 rounded p-1 text-[#525252] opacity-0 transition-opacity hover:bg-[#171717] hover:text-red-400 group-hover:opacity-100"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Name & Description */}
      <div className="mt-4">
        <h3 className="font-medium text-[#fafafa] truncate">{module.name}</h3>
        <p className="mt-1 text-sm text-[#a1a1aa] line-clamp-2">
          {module.description || 'No description'}
        </p>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-center gap-3">
        {module.category && <CategoryBadge category={module.category} />}
        <span className="text-xs text-[#525252]">
          {module.file_count || 0} file{(module.file_count || 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Industry Tags */}
      {module.industry_tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {module.industry_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded bg-[#171717] px-1.5 py-0.5 text-xs text-[#525252]"
            >
              {tag}
            </span>
          ))}
          {module.industry_tags.length > 3 && (
            <span className="text-xs text-[#525252]">
              +{module.industry_tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function TypeIcon({ type, className }) {
  if (type === 'component') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    )
  }
  if (type === 'snippet') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    )
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
