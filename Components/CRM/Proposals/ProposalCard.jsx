'use client'

import ProposalStatusBadge from './ProposalStatusBadge'

export default function ProposalCard({ proposal, compact = false, onSend, onDelete }) {
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isExpired = proposal.valid_until && new Date(proposal.valid_until) < new Date()

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 min-w-0">
          <ProposalStatusBadge status={proposal.status} />
          <div className="min-w-0">
            <span className="text-sm text-[#fafafa] truncate block">{proposal.title}</span>
            {proposal.proposal_number && (
              <span className="text-xs text-[#a1a1aa]">{proposal.proposal_number}</span>
            )}
          </div>
        </div>
        {proposal.total_amount && (
          <span className="flex-shrink-0 text-sm font-medium text-[#fafafa]">
            {formatCurrency(proposal.total_amount, proposal.currency)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#262626] bg-[#171717] p-4 hover:border-[#363636] transition-colors">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ProposalStatusBadge status={proposal.status} />
            {proposal.proposal_number && (
              <span className="text-xs text-[#a1a1aa]">{proposal.proposal_number}</span>
            )}
          </div>
          <h3 className="mt-2 text-base font-medium text-[#fafafa]">{proposal.title}</h3>
        </div>
        {proposal.total_amount && (
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-lg font-semibold text-[#fafafa]">
              {formatCurrency(proposal.total_amount, proposal.currency)}
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#a1a1aa]">
        <span>Created: {formatDate(proposal.created_at)}</span>
        {proposal.sent_at && <span>Sent: {formatDate(proposal.sent_at)}</span>}
        {proposal.viewed_at && (
          <span className="flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            Viewed: {formatDate(proposal.viewed_at)}
            {proposal.view_count > 1 && ` (${proposal.view_count}x)`}
          </span>
        )}
        {proposal.valid_until && (
          <span className={isExpired ? 'text-red-400' : ''}>
            {isExpired ? 'Expired:' : 'Valid until:'} {formatDate(proposal.valid_until)}
          </span>
        )}
      </div>

      {/* Line items preview */}
      {proposal.line_items && proposal.line_items.length > 0 && (
        <div className="mt-3 text-xs text-[#a1a1aa]">
          {proposal.line_items.length} line item{proposal.line_items.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {proposal.status === 'draft' && onSend && (
          <button
            onClick={() => onSend(proposal)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#008070] px-3 py-1.5 text-sm text-white hover:bg-[#006b5d] transition-colors"
          >
            <SendIcon className="h-4 w-4" />
            Send
          </button>
        )}
        {['draft', 'sent', 'viewed'].includes(proposal.status) && (
          <a
            href={`/admin/crm/proposals/${proposal.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#363636] transition-colors"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </a>
        )}
        {proposal.public_token && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/proposals/${proposal.public_token}`)
              alert('Link copied to clipboard!')
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#363636] transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            Copy Link
          </button>
        )}
        {proposal.status === 'draft' && onDelete && (
          <button
            onClick={() => onDelete(proposal)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors ml-auto"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  )
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  )
}

function LinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
