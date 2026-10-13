'use client'

// Booking flow for the Domain/Setup call: the call a WaaS customer books after
// buying their site, to connect (or pick) a domain and get their account set
// up. Posts to /api/booking/create with callType 'setup', which files it on
// the calendar as "Domain/Setup — <name>".

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react'
import { useRecaptcha } from '@/lib/useRecaptcha'
import { trackEvent } from '@/lib/analytics'
import { CalendarPicker, TimeSlots, useBookingSlots } from '@/Components/Booking/BookingCalendar'

const DOMAIN_OPTIONS = [
  { value: 'have',   label: 'I already own one' },
  { value: 'need',   label: 'I need a new one' },
  { value: 'unsure', label: 'Not sure yet' },
]

const inputClass = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors font-manrope'
const labelClass = 'block text-sm font-manrope font-semibold text-gray-600 mb-2'

const EMPTY = { name: '', email: '', phone: '', businessName: '', domainStatus: 'have', domain: '', message: '' }

export default function SetupCallBooking() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [step, setStep]       = useState('calendar') // 'calendar' | 'details' | 'success'
  const [data, setData]       = useState(EMPTY)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { slots, loading: slotsLoading, error: slotsError } = useBookingSlots(selectedDate)
  const { executeRecaptcha } = useRecaptcha()

  // A new day means a new set of slots: drop the old pick
  useEffect(() => { setSelectedSlot(null) }, [selectedDate])

  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const recaptchaToken = await executeRecaptcha('booking')
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          domain: data.domainStatus === 'have' ? data.domain : '',
          callType: 'setup',
          slotIso: selectedSlot.iso,
          recaptchaToken,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Something went wrong')
      setResult(body.booking)
      setStep('success')
      trackEvent('book_call_submit', { page_path: '/setup-call', meeting_type: 'setup' })
    } catch (err) {
      setError(err.message)
      trackEvent('book_call_error', { page_path: '/setup-call', error_message: err?.message || 'network_error' })
    } finally {
      setLoading(false)
    }
  }

  const dayLabel = selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (step === 'success' && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-6"
      >
        <div className="w-16 h-16 bg-[#008070]/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-[#008070]" />
        </div>
        <div>
          <h2 className="font-inter-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            Your setup call is booked
          </h2>
          <p className="font-manrope text-gray-500">A calendar invite with the Google Meet link is on its way to {data.email}.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-3 max-w-sm mx-auto">
          <p className="font-manrope text-sm text-gray-600">
            <span className="text-gray-900 font-semibold">Date:</span> {result.formattedDate}
          </p>
          <p className="font-manrope text-sm text-gray-600">
            <span className="text-gray-900 font-semibold">Time:</span> {result.formattedTime} Pacific
          </p>
          {result.meetLink && (
            <a
              href={result.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#008070] font-manrope font-semibold text-sm hover:underline"
            >
              Join Google Meet
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
        <p className="font-manrope text-sm text-gray-500 max-w-md mx-auto">
          {data.domainStatus === 'have'
            ? 'Have the login for wherever your domain is registered (GoDaddy, Namecheap, Squarespace…) handy, and we\'ll connect it together.'
            : 'Bring a few name ideas and we\'ll find a domain that fits and get it set up.'}
        </p>
      </motion.div>
    )
  }

  if (step === 'details') {
    return (
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div className="flex items-center gap-3 bg-[#008070]/8 border border-[#008070]/20 rounded-lg px-4 py-3">
          <Calendar className="w-4 h-4 text-[#008070] flex-shrink-0" />
          <span className="font-manrope text-sm text-gray-900">{dayLabel} · {selectedSlot?.label} PT</span>
          <button
            type="button"
            onClick={() => { setStep('calendar'); setSelectedSlot(null) }}
            className="ml-auto text-gray-400 hover:text-gray-700 text-xs font-manrope cursor-pointer"
          >
            Change
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="sc-name" className={labelClass}>Your Name *</label>
              <input id="sc-name" type="text" required maxLength={100} autoComplete="name" value={data.name} onChange={set('name')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="sc-business" className={labelClass}>Business Name</label>
              <input id="sc-business" type="text" maxLength={120} autoComplete="organization" value={data.businessName} onChange={set('businessName')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="sc-email" className={labelClass}>Email *</label>
              <input id="sc-email" type="email" required maxLength={200} autoComplete="email" value={data.email} onChange={set('email')} className={inputClass} placeholder="The one you used to sign up" />
            </div>
            <div>
              <label htmlFor="sc-phone" className={labelClass}>Phone</label>
              <input id="sc-phone" type="tel" maxLength={40} autoComplete="tel" value={data.phone} onChange={set('phone')} className={inputClass} />
            </div>
          </div>

          <fieldset>
            <legend className={labelClass}>Do you have a domain name?</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={data.domainStatus === opt.value}
                  onClick={() => setData((d) => ({ ...d, domainStatus: opt.value }))}
                  className={`py-3 px-2 rounded-lg border font-manrope font-semibold text-sm transition-all duration-150 cursor-pointer
                    ${data.domainStatus === opt.value
                      ? 'bg-[#008070]/10 border-[#008070] text-[#008070]'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {data.domainStatus === 'have' && (
            <div>
              <label htmlFor="sc-domain" className={labelClass}>Your domain <span className="text-gray-400 font-normal">(optional)</span></label>
              <input id="sc-domain" type="text" maxLength={120} value={data.domain} onChange={set('domain')} className={inputClass} placeholder="yourbusiness.com" />
            </div>
          )}

          <div>
            <label htmlFor="sc-notes" className={labelClass}>Anything we should know? <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea id="sc-notes" rows={3} maxLength={2000} value={data.message} onChange={set('message')} className={`${inputClass} resize-none`} placeholder="Questions, where your domain is registered, email setup…" />
          </div>

          {error && <p className="text-red-500 font-manrope text-sm">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#008070] hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-manrope font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              {loading ? 'Booking...' : 'Book Setup Call'}
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep('calendar')}
              className="text-gray-400 hover:text-gray-700 font-manrope text-sm transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </form>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <CalendarPicker selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>
        <div>
          {selectedDate ? (
            <>
              <p className="font-manrope font-semibold text-gray-600 text-sm mb-1">{dayLabel}</p>
              <p className="font-manrope text-xs text-gray-400 mb-3">All times Pacific (PT)</p>
              <TimeSlots
                slots={slots}
                loading={slotsLoading}
                error={slotsError}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
            </>
          ) : (
            <div className="h-full min-h-24 flex items-center justify-center text-gray-300 font-manrope text-sm">
              Select a date
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            type="button"
            onClick={() => setStep('details')}
            className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
