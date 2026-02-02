// Components/Admin/SystemForge/CategoryBadge.jsx
'use client'

export default function CategoryBadge({ category }) {
  if (!category) return null

  return (
    <span className="inline-flex items-center rounded-full bg-[#262626] px-2.5 py-0.5 text-xs font-medium text-[#a1a1aa]">
      {category}
    </span>
  )
}
