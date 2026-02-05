'use client'

export default function InvoiceCard({ invoice, compact = false }) {
  const statusConfig = {
    paid: { label: 'Paid', bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    open: { label: 'Open', bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
    draft: { label: 'Draft', bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' },
    void: { label: 'Void', bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
    uncollectible: { label: 'Uncollectible', bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' },
  }

  const config = statusConfig[invoice.status] || statusConfig.draft

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
            {config.label}
          </span>
          <span className="text-sm text-[#fafafa]">
            {invoice.number || invoice.stripeId?.slice(-8)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#fafafa]">
            {invoice.amountDue}
          </span>
          {invoice.hostedUrl && (
            <a
              href={invoice.hostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008070] hover:text-[#006b5d]"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#262626] bg-[#171717] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
              {config.label}
            </span>
            <span className="text-sm text-[#a1a1aa]">
              {invoice.number || invoice.stripeId?.slice(-8)}
            </span>
          </div>
          {invoice.description && (
            <p className="mt-2 text-sm text-[#fafafa]">{invoice.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-[#a1a1aa]">
            <span>Created: {invoice.createdAt}</span>
            {invoice.dueDate && <span>Due: {invoice.dueDate}</span>}
            {invoice.paidAt && <span>Paid: {invoice.paidAt}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-[#fafafa]">{invoice.amountDue}</div>
          {invoice.status === 'paid' && invoice.amountPaidRaw > 0 && (
            <div className="text-sm text-emerald-400">Paid: {invoice.amountPaid}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {invoice.hostedUrl && (
          <a
            href={invoice.hostedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#363636] transition-colors"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            View
          </a>
        )}
        {invoice.pdfUrl && (
          <a
            href={invoice.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#363636] transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            PDF
          </a>
        )}
      </div>
    </div>
  )
}

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}
