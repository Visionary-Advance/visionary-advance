// app/proposals/[token]/page.js
// Public proposal view - no authentication required

'use client'

import { useState, useEffect, use } from 'react'

export default function PublicProposalPage({ params }) {
  const { token } = use(params)

  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [responding, setResponding] = useState(false)
  const [responded, setResponded] = useState(false)

  useEffect(() => {
    fetchProposal()
  }, [token])

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposals/${token}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Proposal not found')
        }
        throw new Error('Failed to load proposal')
      }
      const data = await res.json()
      setProposal(data.proposal)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (response) => {
    if (!confirm(`Are you sure you want to ${response} this proposal?`)) return

    setResponding(true)
    try {
      const res = await fetch(`/api/proposals/${token}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to respond')
      }

      setResponded(true)
      fetchProposal()
    } catch (err) {
      alert(err.message)
    } finally {
      setResponding(false)
    }
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#fafafa]">Proposal Not Found</h1>
          <p className="mt-2 text-[#a1a1aa]">{error}</p>
        </div>
      </div>
    )
  }

  const isExpired = proposal.is_expired
  const hasResponded = ['accepted', 'rejected'].includes(proposal.status)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#262626] bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a1a1aa]">Proposal from</p>
              <h1 className="text-xl font-semibold text-[#008070]">Visionary Advance</h1>
            </div>
            {proposal.proposal_number && (
              <span className="text-sm text-[#a1a1aa]">{proposal.proposal_number}</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Banner */}
        {(isExpired || hasResponded) && (
          <div className={`rounded-lg p-4 mb-8 ${
            proposal.status === 'accepted'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : proposal.status === 'rejected'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-amber-500/10 border border-amber-500/20'
          }`}>
            <p className={`text-center font-medium ${
              proposal.status === 'accepted'
                ? 'text-emerald-400'
                : proposal.status === 'rejected'
                ? 'text-red-400'
                : 'text-amber-400'
            }`}>
              {proposal.status === 'accepted' && 'This proposal has been accepted'}
              {proposal.status === 'rejected' && 'This proposal has been declined'}
              {isExpired && !hasResponded && 'This proposal has expired'}
            </p>
          </div>
        )}

        {/* Title & Amount */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#fafafa]">{proposal.title}</h2>
          {proposal.lead?.company && (
            <p className="mt-2 text-lg text-[#a1a1aa]">For {proposal.lead.company}</p>
          )}
          {proposal.total_amount && (
            <p className="mt-4 text-4xl font-bold text-[#008070]">
              {formatCurrency(proposal.total_amount, proposal.currency)}
            </p>
          )}
          {proposal.valid_until && !hasResponded && (
            <p className={`mt-2 text-sm ${isExpired ? 'text-red-400' : 'text-[#a1a1aa]'}`}>
              {isExpired ? 'Expired on' : 'Valid until'} {formatDate(proposal.valid_until)}
            </p>
          )}
        </div>

        {/* Line Items */}
        {proposal.line_items && proposal.line_items.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Pricing</h3>
            <div className="rounded-lg border border-[#262626] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#171717]">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-[#a1a1aa]">Description</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[#a1a1aa]">Qty</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[#a1a1aa]">Price</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[#a1a1aa]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {proposal.line_items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-[#fafafa]">{item.description}</td>
                      <td className="px-4 py-3 text-right text-[#a1a1aa]">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-[#a1a1aa]">
                        {formatCurrency(item.unit_price, proposal.currency)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#fafafa]">
                        {formatCurrency(item.total, proposal.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#171717]">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-semibold text-[#fafafa]">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-xl font-bold text-[#008070]">
                      {formatCurrency(proposal.total_amount, proposal.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Content */}
        {proposal.content_html && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Details</h3>
            <div
              className="prose prose-invert prose-sm max-w-none bg-[#171717] rounded-lg p-6 border border-[#262626]"
              dangerouslySetInnerHTML={{ __html: proposal.content_html }}
            />
          </div>
        )}

        {/* Response Actions */}
        {!hasResponded && !isExpired && (
          <div className="border-t border-[#262626] pt-8 mt-12">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Your Response</h3>
            <p className="text-[#a1a1aa] mb-6">
              Please review the proposal above and let us know your decision.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleRespond('accepted')}
                disabled={responding}
                className="flex-1 rounded-lg bg-[#008070] px-6 py-3 text-lg font-semibold text-white hover:bg-[#006b5d] disabled:opacity-50 transition-colors"
              >
                {responding ? 'Processing...' : 'Accept Proposal'}
              </button>
              <button
                onClick={() => handleRespond('rejected')}
                disabled={responding}
                className="flex-1 rounded-lg border border-[#262626] bg-[#171717] px-6 py-3 text-lg font-semibold text-[#fafafa] hover:bg-[#262626] disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Thank You Message */}
        {responded && (
          <div className="border-t border-[#262626] pt-8 mt-12 text-center">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Thank You!</h3>
            <p className="text-[#a1a1aa]">
              Your response has been recorded. We'll be in touch shortly.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-[#a1a1aa]">
            Visionary Advance - Premium Web Design & Development
          </p>
        </div>
      </footer>
    </div>
  )
}
