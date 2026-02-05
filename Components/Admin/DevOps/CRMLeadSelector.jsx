'use client'

import { useState, useEffect, useRef } from 'react'

export default function CRMLeadSelector({ value, onChange, ownerEmail }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const dropdownRef = useRef(null)

  // Fetch leads on mount and when ownerEmail changes
  useEffect(() => {
    fetchLeads()
  }, [ownerEmail])

  // Find selected lead when value changes
  useEffect(() => {
    if (value && leads.length > 0) {
      const found = leads.find(l => l.id === value)
      setSelectedLead(found || null)
    } else {
      setSelectedLead(null)
    }
  }, [value, leads])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchLeads() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (ownerEmail) params.set('owner_email', ownerEmail)

      const res = await fetch(`/api/devops/crm-leads?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads || [])
      }
    } catch (err) {
      console.error('Error fetching CRM leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.full_name?.toLowerCase().includes(searchLower) ||
      lead.company?.toLowerCase().includes(searchLower)
    )
  })

  function handleSelect(lead) {
    setSelectedLead(lead)
    onChange(lead ? lead.id : null)
    setIsOpen(false)
    setSearch('')
  }

  function handleClear() {
    setSelectedLead(null)
    onChange(null)
    setSearch('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Link to CRM Lead
      </label>

      {/* Selected value display / trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-[#171717] border border-[#262626] rounded-lg text-left flex items-center justify-between hover:border-[#404040] focus:outline-none focus:border-purple-500 transition-colors"
      >
        {selectedLead ? (
          <div className="flex-1 min-w-0">
            <div className="text-white truncate">
              {selectedLead.full_name || selectedLead.email}
            </div>
            {selectedLead.company && (
              <div className="text-gray-400 text-sm truncate">{selectedLead.company}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-500">Select a CRM lead...</span>
        )}
        <ChevronIcon className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Clear button if selected */}
      {selectedLead && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-9 text-gray-400 hover:text-white"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#171717] border border-[#262626] rounded-lg shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[#262626]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                {search ? 'No leads found' : 'No CRM leads available'}
              </div>
            ) : (
              <>
                {/* Option to unlink */}
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className="w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors border-b border-[#262626]"
                >
                  <span className="text-gray-400">None (unlinked)</span>
                </button>

                {filteredLeads.map((lead) => {
                  const isMatch = ownerEmail && lead.email?.toLowerCase() === ownerEmail.toLowerCase()
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => handleSelect(lead)}
                      className={`w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors ${
                        lead.id === value ? 'bg-purple-600/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-white truncate flex items-center gap-2">
                            {lead.full_name || lead.email}
                            {isMatch && (
                              <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                                Match
                              </span>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm truncate">
                            {lead.email}
                            {lead.company && ` - ${lead.company}`}
                          </div>
                        </div>
                        {lead.id === value && (
                          <CheckIcon className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>
      )}

      <p className="text-gray-500 text-xs mt-1">
        Link this site to a CRM lead to sync status changes and incidents
      </p>
    </div>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
