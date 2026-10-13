'use client'

// The date picker, time-slot grid and slot loader behind both booking pages:
// the discovery call on /contact and the Domain/Setup call on /setup-call.
// Availability comes from /api/booking/slots (lib/google-calendar.js).

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

export function toYMD(date) {
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

/** Open slots for the selected day: { slots, loading, error }. */
export function useBookingSlots(selectedDate) {
  const [slots, setSlots]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!selectedDate) return
    setSlots(null)
    setError(null)
    setLoading(true)
    fetch(`/api/booking/slots?date=${toYMD(selectedDate)}`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || `Server error ${r.status}`)
        setSlots(data.slots || [])
      })
      .catch((err) => {
        console.error('[slots fetch]', err)
        setError(err.message || 'Failed to load availability')
        setSlots([])
      })
      .finally(() => setLoading(false))
  }, [selectedDate])

  return { slots, loading, error }
}

export function CalendarPicker({ selectedDate, onSelect }) {
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
        <button type="button" onClick={prevMonth} aria-label="Previous month" className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-manrope font-bold text-gray-900 text-base">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} aria-label="Next month" className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
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
              type="button"
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

export function TimeSlots({ slots, loading, error, selectedSlot, onSelect }) {
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
          type="button"
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
