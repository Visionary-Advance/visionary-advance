'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, ArrowRight, Calendar, MessageSquare, Clock, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRecaptcha } from '@/lib/useRecaptcha'
import SplitText from '@/Components/SplitText'
import FAQ from '@/Components/FAQ'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function toYMD(date) {
  // Use local date components — avoids UTC-vs-local shift on the client
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CalendarPicker({ selectedDate, onSelect, disabledDates = [] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))

  return (
    <div className="w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-manrope font-bold text-gray-900 text-base">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-manrope font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />

          const isPast    = date < today
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const disabled  = isPast || isWeekend
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isToday    = isSameDay(date, today)

          return (
            <button
              key={date.toISOString()}
              disabled={disabled}
              onClick={() => !disabled && onSelect(date)}
              className={`
                aspect-square rounded-lg text-sm font-manrope font-medium transition-all duration-150 cursor-pointer
                ${isSelected  ? 'bg-[#008070] text-white'                         : ''}
                ${!isSelected && !disabled ? 'text-gray-900 hover:bg-gray-100'    : ''}
                ${disabled    ? 'text-gray-300 cursor-not-allowed'                : ''}
                ${isToday && !isSelected ? 'ring-1 ring-[#008070] text-gray-900'  : ''}
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TimeSlots({ slots, loading, error, selectedSlot, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-500 font-manrope text-xs mt-4 text-center py-4 bg-red-50 rounded-lg px-3 border border-red-100">
        {error}
      </p>
    )
  }

  if (!slots) return null

  if (slots.length === 0) {
    return (
      <p className="text-gray-400 font-manrope text-sm mt-4 text-center py-4">
        No availability on this day.
      </p>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-2 mt-4"
    >
      {slots.map((slot, i) => (
        <motion.button
          key={slot.iso}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => onSelect(slot)}
          className={`
            py-2 px-1 rounded-lg text-sm font-manrope font-medium transition-all duration-150 cursor-pointer
            ${selectedSlot?.iso === slot.iso
              ? 'bg-[#008070] text-white'
              : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'}
          `}
        >
          {slot.label}
        </motion.button>
      ))}
    </motion.div>
  )
}


// ── Main page ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('book')
  const [tabDirection, setTabDirection] = useState(1)

  // ── Booking state ──────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots]               = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError]     = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingStep, setBookingStep]   = useState('calendar') // 'calendar' | 'details' | 'success'
  const [bookingData, setBookingData]   = useState({ name: '', email: '', message: '', meetingType: 'meet' })
  const [bookingResult, setBookingResult] = useState(null)
  const [bookingError, setBookingError]   = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)


  // ── Contact form state ─────────────────────────────────────────────────────
  const [formData, setFormData]     = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', projectType: '', timeline: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

  const { executeRecaptcha } = useRecaptcha()

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return
    setSelectedSlot(null)
    setSlots(null)
    setSlotsError(null)
    setSlotsLoading(true)
    fetch(`/api/booking/slots?date=${toYMD(selectedDate)}`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || `Server error ${r.status}`)
        setSlots(data.slots || [])
      })
      .catch((err) => {
        console.error('[slots fetch]', err)
        setSlotsError(err.message || 'Failed to load availability')
        setSlots([])
      })
      .finally(() => setSlotsLoading(false))
  }, [selectedDate])

  function switchTab(tab) {
    setTabDirection(tab === 'message' ? 1 : -1)
    setActiveTab(tab)
  }

  async function handleBookingSubmit(e) {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError('')
    try {
      const recaptchaToken = await executeRecaptcha('booking')
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingData, slotIso: selectedSlot.iso, recaptchaToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setBookingResult(data.booking)
      setBookingStep('success')
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingLoading(false)
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const recaptchaToken = await executeRecaptcha('contact_form')
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })
      setSubmitStatus(res.ok ? 'success' : 'error')
      if (res.ok) setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', projectType: '', timeline: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectTypes = ['New Website','Website Redesign','Custom Dashboard / Analytics','Inventory / Warehouse System','Job Tracking / Contractor System','Custom CMS','SEO & Visibility','Maintenance & Support','Other']
  const timelines    = ['ASAP','Within 1 month','1–3 months','3–6 months','6+ months','Just exploring']

  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors font-manrope'
  const labelClass = 'block text-sm font-manrope font-semibold text-gray-600 mb-2'

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="px-4 md:px-16 pt-32 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 font-manrope font-bold text-sm text-gray-500 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#008070]" />
            Contact
          </motion.div>

          <div className="mb-6">
            <SplitText
              text="Let's Talk About What You Need"
              tag="h1"
              splitType="chars"
              duration={0.4}
              delay={18}
              ease="power3.out"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="left"
              className="font-inter-display font-bold text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight tracking-tight"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-manrope text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed"
          >
            Whether it's a new website, a custom dashboard, or a system to streamline your operations — we'll start by understanding how your business actually works.
          </motion.p>
        </div>
      </section>

      {/* ═══ TAB TOGGLE + CONTENT ════════════════════════════════════════════ */}
      <section className="px-4 md:px-16 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto">

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="inline-flex gap-3 p-1.5 bg-gray-100 border border-gray-200 rounded-xl mb-12"
          >
            <button
              onClick={() => switchTab('book')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-manrope font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'book' ? 'bg-[#008070] text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Book a Call
            </button>
            <button
              onClick={() => switchTab('message')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-manrope font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'message' ? 'bg-[#008070] text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Send a Message
            </button>
          </motion.div>

          {/* Tab panels */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

            {/* ── Main panel ── */}
            <div className="lg:col-span-2 overflow-hidden">
              <AnimatePresence mode="wait" custom={tabDirection}>
                <motion.div
                  key={activeTab}
                  custom={tabDirection}
                  initial={{ opacity: 0, x: tabDirection * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tabDirection * -40 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >

                  {/* ── BOOK TAB ──────────────────────────────────────────── */}
                  {activeTab === 'book' && (
                    <div>
                      {bookingStep !== 'success' && (
                        <div className="mb-8">
                          <h2 className="font-inter-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                            Book a Discovery Call
                          </h2>
                          <p className="font-manrope text-gray-500">
                            30 minutes · {bookingData.meetingType === 'meet' ? 'Google Meet' : 'In-Person'} · No obligation
                          </p>
                        </div>
                      )}

                      {/* Step: calendar + slots */}
                      {bookingStep === 'calendar' && (
                        <div className="space-y-6">
                          {/* How it works */}
                          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-gray-200">
                            {[
                              { n: '01', label: 'Pick a time' },
                              { n: '02', label: 'Tell us about your project' },
                              { n: '03', label: bookingData.meetingType === 'meet' ? 'We\'ll send a Meet link' : 'We\'ll confirm location' },
                            ].map(step => (
                              <div key={step.n} className="text-center">
                                <span className="font-inter-display font-bold text-2xl text-[#008070]">{step.n}</span>
                                <p className="font-manrope text-xs text-gray-500 mt-1 leading-snug">{step.label}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Calendar */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                              <CalendarPicker
                                selectedDate={selectedDate}
                                onSelect={setSelectedDate}
                              />
                            </div>

                            {/* Time slots */}
                            <div>
                              {selectedDate ? (
                                <>
                                  <p className="font-manrope font-semibold text-gray-600 text-sm mb-1">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                  </p>
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
                                <div className="h-full flex items-center justify-center text-gray-300 font-manrope text-sm">
                                  ← Select a date
                                </div>
                              )}
                            </div>
                          </div>

                          {selectedSlot && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <button
                                onClick={() => setBookingStep('details')}
                                className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Step: details form */}
                      {bookingStep === 'details' && (
                        <motion.div
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          {/* Selected slot summary */}
                          <div className="flex items-center gap-3 bg-[#008070]/8 border border-[#008070]/20 rounded-lg px-4 py-3">
                            <Calendar className="w-4 h-4 text-[#008070] flex-shrink-0" />
                            <span className="font-manrope text-sm text-gray-900">
                              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {selectedSlot?.label} PT
                            </span>
                            <button
                              onClick={() => { setBookingStep('calendar'); setSelectedSlot(null) }}
                              className="ml-auto text-gray-400 hover:text-gray-700 text-xs font-manrope cursor-pointer"
                            >
                              Change
                            </button>
                          </div>

                          <form onSubmit={handleBookingSubmit} className="space-y-5">
                            {/* Meeting type toggle */}
                            <div>
                              <label className={labelClass}>Meeting Type</label>
                              <div className="flex gap-3">
                                {[
                                  { value: 'meet',      label: 'Google Meet',  icon: '🎥' },
                                  { value: 'in-person', label: 'In-Person',    icon: '📍' },
                                ].map(opt => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setBookingData(d => ({ ...d, meetingType: opt.value }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-manrope font-semibold text-sm transition-all duration-150 cursor-pointer
                                      ${bookingData.meetingType === opt.value
                                        ? 'bg-[#008070]/10 border-[#008070] text-[#008070]'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                                      }`}
                                  >
                                    <span>{opt.icon}</span>
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className={labelClass}>Your Name *</label>
                              <input
                                type="text"
                                required
                                value={bookingData.name}
                                onChange={e => setBookingData(d => ({ ...d, name: e.target.value }))}
                                className={inputClass}
                                placeholder="Brandon Smith"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Email Address *</label>
                              <input
                                type="email"
                                required
                                value={bookingData.email}
                                onChange={e => setBookingData(d => ({ ...d, email: e.target.value }))}
                                className={inputClass}
                                placeholder="you@company.com"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>What are you looking to build? <span className="text-gray-400 font-normal">(optional)</span></label>
                              <textarea
                                rows={4}
                                value={bookingData.message}
                                onChange={e => setBookingData(d => ({ ...d, message: e.target.value }))}
                                className={`${inputClass} resize-none`}
                                placeholder="Brief description of your project or goals..."
                              />
                            </div>

                            {bookingError && (
                              <p className="text-red-500 font-manrope text-sm">{bookingError}</p>
                            )}

                            <div className="flex items-center gap-4">
                              <button
                                type="submit"
                                disabled={bookingLoading}
                                className="bg-[#008070] hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-manrope font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                <Calendar className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setBookingStep('calendar')}
                                className="text-gray-400 hover:text-gray-700 font-manrope text-sm transition-colors cursor-pointer"
                              >
                                ← Back
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* Step: success */}
                      {bookingStep === 'success' && bookingResult && (
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
                              You're booked!
                            </h2>
                            <p className="font-manrope text-gray-500">Check your calendar — you should receive a confirmation shortly.</p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-3 max-w-sm mx-auto">
                            <p className="font-manrope text-sm text-gray-600">
                              <span className="text-gray-900 font-semibold">Date:</span> {bookingResult.formattedDate}
                            </p>
                            <p className="font-manrope text-sm text-gray-600">
                              <span className="text-gray-900 font-semibold">Time:</span> {bookingResult.formattedTime} Pacific
                            </p>
                            {bookingData.meetingType === 'meet' && bookingResult.meetLink && (
                              <a
                                href={bookingResult.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#008070] font-manrope font-semibold text-sm hover:underline"
                              >
                                Join Google Meet
                                <ArrowRight className="w-3 h-3" />
                              </a>
                            )}
                            {bookingData.meetingType === 'in-person' && (
                              <p className="font-manrope text-sm text-gray-500">
                                📍 We'll follow up with location details
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── MESSAGE TAB ────────────────────────────────────────── */}
                  {activeTab === 'message' && (
                    <div>
                      <div className="mb-8">
                        <h2 className="font-inter-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                          Tell Us What You're Working On
                        </h2>
                        <p className="font-manrope text-gray-500">
                          We'll follow up within 24 hours — no sales pitch, just a straightforward conversation.
                        </p>
                      </div>

                      <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>First Name *</label>
                            <input type="text" name="firstName" required value={formData.firstName} onChange={e => setFormData(d => ({...d, firstName: e.target.value}))} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Last Name *</label>
                            <input type="text" name="lastName" required value={formData.lastName} onChange={e => setFormData(d => ({...d, lastName: e.target.value}))} className={inputClass} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>Email *</label>
                            <input type="email" name="email" required value={formData.email} onChange={e => setFormData(d => ({...d, email: e.target.value}))} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={e => setFormData(d => ({...d, phone: e.target.value}))} className={inputClass} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Company / Organization</label>
                          <input type="text" name="company" value={formData.company} onChange={e => setFormData(d => ({...d, company: e.target.value}))} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>Project Type</label>
                            <select name="projectType" value={formData.projectType} onChange={e => setFormData(d => ({...d, projectType: e.target.value}))} className={inputClass}>
                              <option value="">Select...</option>
                              {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Timeline</label>
                            <select name="timeline" value={formData.timeline} onChange={e => setFormData(d => ({...d, timeline: e.target.value}))} className={inputClass}>
                              <option value="">Select...</option>
                              {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>What are you looking to build? *</label>
                          <textarea name="message" rows={5} required value={formData.message} onChange={e => setFormData(d => ({...d, message: e.target.value}))} placeholder="Describe the problem you're solving or the system you need..." className={`${inputClass} resize-none`} />
                        </div>

                        {submitStatus === 'success' && (
                          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 font-manrope text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            Message sent! We'll be in touch within 24 hours.
                          </div>
                        )}
                        {submitStatus === 'error' && (
                          <p className="text-red-500 font-manrope text-sm">Something went wrong. Please email us at info@visionaryadvance.com</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#008070] hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-manrope font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">
              <a href="mailto:info@visionaryadvance.com" className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#008070]/40 transition-colors group">
                <div className="w-10 h-10 bg-[#008070]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#008070]" />
                </div>
                <div>
                  <p className="font-manrope font-bold text-gray-900 text-sm group-hover:text-[#008070] transition-colors">Email Us</p>
                  <p className="font-manrope text-gray-500 text-xs mt-0.5">info@visionaryadvance.com</p>
                </div>
              </a>

              <a href="tel:+15413210468" className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#008070]/40 transition-colors group">
                <div className="w-10 h-10 bg-[#008070]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#008070]" />
                </div>
                <div>
                  <p className="font-manrope font-bold text-gray-900 text-sm group-hover:text-[#008070] transition-colors">Call Us</p>
                  <p className="font-manrope text-gray-500 text-xs mt-0.5">541-321-0468 · Mon–Fri, 9am–6pm PT</p>
                </div>
              </a>

              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-4 h-4 text-[#008070]" />
                  <p className="font-manrope font-bold text-gray-900 text-sm">What to expect</p>
                </div>
                <div className="space-y-3">
                  {['Direct communication — no account managers', 'No obligation or sales pressure', 'Honest guidance, even if we\'re not the right fit'].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#008070] mt-0.5 flex-shrink-0" />
                      <span className="font-manrope text-xs text-gray-500 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FAQ ═════════════════════════════════════════════════════════════ */}
      <FAQ />

    </div>
  )
}
