// app/admin/crm/proposals/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProposalEditor from '@/Components/CRM/Proposals/ProposalEditor'
import ProposalStatusBadge from '@/Components/CRM/Proposals/ProposalStatusBadge'

export default function ProposalDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendEmail, setSendEmail] = useState('')
  const [customMessage, setCustomMessage] = useState('')

  useEffect(() => {
    fetchProposal()
  }, [id])

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/crm/proposals/${id}`)
      if (!res.ok) throw new Error('Failed to fetch proposal')
      const data = await res.json()
      setProposal(data.proposal)
      setSendEmail(data.proposal.lead?.email || '')
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditorChange = async ({ json, html }) => {
    if (!proposal || proposal.status !== 'draft') return

    setSaving(true)
    try {
      const res = await fetch(`/api/crm/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_json: json,
          content_html: html,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    if (!sendEmail) return

    setSending(true)
    try {
      const res = await fetch(`/api/crm/proposals/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sendEmail,
          custom_message: customMessage || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setShowSendModal(false)
      fetchProposal()
      alert('Proposal sent successfully!')
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const copyPublicLink = () => {
    if (!proposal?.public_token) return
    const url = `${window.location.origin}/proposals/${proposal.public_token}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-400">Proposal not found</p>
        <Link href="/admin/crm" className="text-[#008070] hover:underline">
          Back to CRM
        </Link>
      </div>
    )
  }

  const isEditable = proposal.status === 'draft'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
            <h3 className="text-lg font-semibold text-[#fafafa]">Send Proposal</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-[#fafafa] focus:border-[#008070] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">
                  Custom Message (optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a personal message..."
                  className="w-full rounded-lg border border-[#262626] bg-[#171717] px-3 py-2 text-[#fafafa] placeholder-[#6b7280] focus:border-[#008070] focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="rounded-lg px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!sendEmail || sending}
                className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/admin/crm/leads/${proposal.lead_id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to lead
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#fafafa]">{proposal.title}</h1>
            <ProposalStatusBadge status={proposal.status} size="lg" />
          </div>
          {proposal.proposal_number && (
            <p className="mt-1 text-[#a1a1aa]">{proposal.proposal_number}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {proposal.public_token && (
            <button
              onClick={copyPublicLink}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#262626] px-3 py-2 text-sm text-[#fafafa] hover:bg-[#363636]"
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </button>
          )}
          {proposal.status === 'draft' && (
            <button
              onClick={() => setShowSendModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d]"
            >
              <SendIcon className="h-4 w-4" />
              Send
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {proposal.total_amount && (
            <div>
              <dt className="text-xs text-[#a1a1aa]">Total Amount</dt>
              <dd className="mt-1 text-lg font-semibold text-[#fafafa]">
                {formatCurrency(proposal.total_amount, proposal.currency)}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-[#a1a1aa]">Created</dt>
            <dd className="mt-1 text-[#fafafa]">{formatDate(proposal.created_at)}</dd>
          </div>
          {proposal.sent_at && (
            <div>
              <dt className="text-xs text-[#a1a1aa]">Sent</dt>
              <dd className="mt-1 text-[#fafafa]">{formatDate(proposal.sent_at)}</dd>
            </div>
          )}
          {proposal.viewed_at && (
            <div>
              <dt className="text-xs text-[#a1a1aa]">Viewed</dt>
              <dd className="mt-1 text-[#fafafa]">
                {formatDate(proposal.viewed_at)}
                {proposal.view_count > 1 && ` (${proposal.view_count}x)`}
              </dd>
            </div>
          )}
          {proposal.valid_until && (
            <div>
              <dt className="text-xs text-[#a1a1aa]">Valid Until</dt>
              <dd className={`mt-1 ${new Date(proposal.valid_until) < new Date() ? 'text-red-400' : 'text-[#fafafa]'}`}>
                {formatDate(proposal.valid_until)}
              </dd>
            </div>
          )}
          {proposal.responded_at && (
            <div>
              <dt className="text-xs text-[#a1a1aa]">Responded</dt>
              <dd className="mt-1 text-[#fafafa]">{formatDate(proposal.responded_at)}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      {proposal.line_items && proposal.line_items.length > 0 && (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa] mb-4">
            Line Items
          </h2>
          <div className="space-y-2">
            {proposal.line_items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-[#171717] p-3">
                <div>
                  <p className="text-sm text-[#fafafa]">{item.description}</p>
                  <p className="text-xs text-[#a1a1aa]">
                    {item.quantity} x {formatCurrency(item.unit_price, proposal.currency)}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#fafafa]">
                  {formatCurrency(item.total, proposal.currency)}
                </span>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <span className="text-lg font-semibold text-[#fafafa]">
                Total: {formatCurrency(proposal.total_amount, proposal.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
            Content
          </h2>
          {saving && (
            <span className="text-xs text-[#a1a1aa]">Saving...</span>
          )}
        </div>
        <ProposalEditor
          content={proposal.content_json}
          onChange={handleEditorChange}
          editable={isEditable}
        />
      </div>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  )
}
