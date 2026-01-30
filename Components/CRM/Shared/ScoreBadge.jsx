'use client'

export default function ScoreBadge({ score, size = 'md' }) {
  const getScoreColor = (score) => {
    if (score >= 70) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' }
    if (score >= 40) return { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' }
    return { bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' }
  }

  const colors = getScoreColor(score)

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ring-1 ${colors.bg} ${colors.text} ${colors.ring} ${sizeClasses[size]}`}
    >
      {score}
    </div>
  )
}
