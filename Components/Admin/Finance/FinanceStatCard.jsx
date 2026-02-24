'use client'

export default function FinanceStatCard({ label, value, icon: Icon, color = 'text-[#fafafa]', subtext }) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#a1a1aa]">{label}</p>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#171717]">
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        )}
      </div>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>{value}</p>
      {subtext && <p className="mt-1 text-sm text-[#525252]">{subtext}</p>}
    </div>
  )
}
