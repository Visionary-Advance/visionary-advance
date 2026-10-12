'use client'

import { Check } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecaptcha } from '@/lib/useRecaptcha'
import { trackEvent } from '@/lib/analytics'
import { SMS_CONSENT_TEXT } from '@/lib/instant-site-copy'
import { metaBrowserIds, trackPixel } from './MetaPixel'

// The /get-your-site funnel:
//   business match ("is this you?") contact building (countdown)
//   unlock (code we sent) revealed (their site + claim)
// with side doors for "not on Google" (manual) and a build that can't start
// right now (handoff). Progress survives a refresh or a closed tab.

const STORAGE_KEY = 'va-instant-site-v1'
const BUILD_SECONDS = 150 // typical end-to-end build; the countdown is honest-ish
const POLL_MS = 4000

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
]

// Common mobile-keyboard misspellings of the big mail providers.
const EMAIL_FIXES = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmal.com': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yhoo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'iclod.com': 'icloud.com',
  'icloud.con': 'icloud.com', 'aol.con': 'aol.com', 'comcast.ner': 'comcast.net',
}

const BUILD_STEPS = [
  { stage: 'queued', label: 'Pulling your Google listing' },
  { stage: 'writing', label: 'Writing your pages' },
  { stage: 'photos', label: 'Adding your photos' },
  { stage: 'deploying', label: 'Publishing your site' },
]
const STAGE_INDEX = { queued: 0, writing: 1, photos: 2, deploying: 3, ready: 4 }

// ── small helpers ────────────────────────────────────────────────────────────

const newEventId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`

function formatPhone(value) {
  const d = value.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

function emailSuggestion(email) {
  const at = email.lastIndexOf('@')
  if (at < 1) return null
  const fix = EMAIL_FIXES[email.slice(at + 1).toLowerCase()]
  return fix ? `${email.slice(0, at + 1)}${fix}` : null
}

function maskEmail(email) {
  const [user, domain] = (email || '').split('@')
  if (!domain) return email
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`
}

/** UTMs, click ids and landing page — captured once, on first load. */
function collectMeta() {
  const params = new URLSearchParams(window.location.search)
  const pick = (k) => params.get(k) || null
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_term: pick('utm_term'),
    utm_content: pick('utm_content'),
    landingUrl: window.location.href,
    referrer: document.referrer || null,
    ...metaBrowserIds(),
  }
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

// ── shared UI ────────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-[#062A26] placeholder:text-gray-400 outline-none transition focus:border-[#008070] focus:ring-4 focus:ring-[#008070]/15'
const labelClass = 'block text-sm font-bold text-gray-700 mb-1.5'

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full rounded-xl bg-[#008070] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#008070]/25 transition hover:bg-[#006b5d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Working…
        </span>
      ) : children}
    </button>
  )
}

function TextLink({ children, ...props }) {
  return (
    <button type="button" {...props} className="text-sm font-bold text-[#008070] underline-offset-4 hover:underline">
      {children}
    </button>
  )
}

function ErrorText({ children }) {
  if (!children) return null
  return <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{children}</p>
}

function Stars({ rating }) {
  if (rating == null) return null
  const full = Math.round(rating)
  return (
    <span className="text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}<span className="text-gray-300">{'★'.repeat(5 - full)}</span>
    </span>
  )
}

function Progress({ step }) {
  const steps = ['Your business', 'Confirm', 'Style', 'Your info', 'Your site']
  const current = { business: 0, match: 1, manual: 1, style: 2, contact: 3, building: 4, unlock: 4, revealed: 4 }[step] ?? 0
  return (
    <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => (
        <li key={label} className="flex flex-1 flex-col gap-1.5">
          <span className={`h-1.5 rounded-full transition-colors ${i <= current ? 'bg-[#008070]' : 'bg-gray-200'}`} />
          <span className={`hidden text-xs font-bold sm:block ${i <= current ? 'text-[#008070]' : 'text-gray-400'}`}>{label}</span>
        </li>
      ))}
    </ol>
  )
}

// ── the flow ─────────────────────────────────────────────────────────────────

export default function InstantSiteFlow({ defaultCity = '', defaultState = '' }) {
  const { executeRecaptcha } = useRecaptcha()
  const [hydrated, setHydrated] = useState(false)
  const [s, setS] = useState({
    step: 'business',
    businessName: '',
    city: defaultCity,
    state: defaultState,
    results: [],
    selected: null,
    industries: [],
    template: null,
    name: '',
    phone: '',
    email: '',
    token: null,
    startedAt: null,
    reveal: null,
    meta: null,
  })
  const update = useCallback((patch) => setS((prev) => ({ ...prev, ...patch })), [])

  // Restore an in-progress visit; capture attribution on the first one.
  useEffect(() => {
    let saved = null
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch {}
    setS((prev) => ({
      ...prev,
      ...(saved || {}),
      // Don't resume onto a list of search results — they're stale-able and cheap to redo.
      step: saved?.step === 'match' ? 'business' : (saved?.step || prev.step),
      meta: saved?.meta || collectMeta(),
    }))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const { results, ...persist } = s // results are re-fetched, not stored
    void results
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
  }, [s, hydrated])

  const startOver = () => {
    localStorage.removeItem(STORAGE_KEY)
    setS((prev) => ({
      ...prev,
      step: 'business', businessName: '', results: [], selected: null, industries: [], template: null,
      triedStyles: [], previous: null, token: null, startedAt: null, reveal: null,
    }))
  }

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white/90" />
  }

  return (
    <div className="relative rounded-3xl bg-white p-5 shadow-[0_30px_80px_-30px_rgba(6,42,38,0.45)] ring-1 ring-[#062A26]/5 sm:p-8">
      {!['revealed'].includes(s.step) && <Progress step={s.step} />}
      {s.step === 'business' && <BusinessStep s={s} update={update} executeRecaptcha={executeRecaptcha} />}
      {s.step === 'match' && <MatchStep s={s} update={update} />}
      {s.step === 'manual' && <ManualStep s={s} update={update} executeRecaptcha={executeRecaptcha} />}
      {s.step === 'style' && <StyleStep s={s} update={update} />}
      {s.step === 'contact' && <ContactStep s={s} update={update} executeRecaptcha={executeRecaptcha} />}
      {s.step === 'building' && <BuildingStep s={s} update={update} />}
      {s.step === 'unlock' && <UnlockStep s={s} update={update} />}
      {s.step === 'revealed' && <RevealedStep s={s} update={update} onStartOver={startOver} />}
      {s.step === 'handoff' && <HandoffStep s={s} />}
      {s.step === 'manual_done' && <HandoffStep s={s} manual />}

      {['match', 'style', 'contact', 'manual', 'unlock', 'handoff', 'manual_done'].includes(s.step) && (
        <div className="mt-6 text-center">
          <TextLink onClick={startOver}>Start over</TextLink>
        </div>
      )}
    </div>
  )
}

// ── Step 1: business + location ──────────────────────────────────────────────

function BusinessStep({ s, update, executeRecaptcha }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!s.businessName.trim() || !s.city.trim() || !s.state) {
      setError('Fill in your business name, city and state.')
      return
    }
    setLoading(true)
    trackEvent('instant_site_search', { state: s.state })
    trackPixel('Search', { search_string: s.businessName })
    try {
      const recaptchaToken = await executeRecaptcha('instant_search')
      const { ok, data } = await postJson('/api/instant-site/search', {
        name: s.businessName, city: s.city, state: s.state, recaptchaToken,
      })
      if (!ok) { setError(data.error || 'Search failed. Try again.'); return }
      update({ results: data.results || [], step: 'match' })
    } catch {
      setError('Search failed. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">Let&apos;s find your business</h2>
        <p className="mt-1 text-gray-600">We&apos;ll build your site from your Google listing. Takes about 2 minutes.</p>
      </div>
      <div>
        <label htmlFor="is-business" className={labelClass}>Business name</label>
        <input
          id="is-business" className={inputClass} autoComplete="organization" placeholder="e.g. Rivera Plumbing"
          value={s.businessName} onChange={(e) => update({ businessName: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3">
          <label htmlFor="is-city" className={labelClass}>City</label>
          <input
            id="is-city" className={inputClass} autoComplete="address-level2" placeholder="Eugene"
            value={s.city} onChange={(e) => update({ city: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="is-state" className={labelClass}>State</label>
          <select
            id="is-state" className={inputClass} autoComplete="address-level1"
            value={s.state} onChange={(e) => update({ state: e.target.value })}
          >
            <option value="">Choose</option>
            {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
      </div>
      <ErrorText>{error}</ErrorText>
      <PrimaryButton type="submit" loading={loading}>Find my business</PrimaryButton>
      <p className="text-center text-xs text-gray-500">Free to build. No credit card.</p>
    </form>
  )
}

// ── Step 2: "is this you?" ───────────────────────────────────────────────────

function BusinessCard({ place, onPick, children }) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${children ? 'border-[#008070] shadow-md' : 'border-gray-200 hover:border-[#008070] hover:shadow-md'}`}>
      <div className="flex gap-4 p-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
          {place.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={place.photo} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
            : <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300">🏪</div>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight text-[#062A26]">{place.name}</p>
          {place.category && <p className="text-sm text-gray-500">{place.category}</p>}
          {place.rating != null && (
            <p className="mt-1 text-sm text-gray-700">
              <Stars rating={place.rating} /> <span className="font-bold">{place.rating.toFixed(1)}</span>
              {place.reviewCount != null && <span className="text-gray-500"> ({place.reviewCount} reviews)</span>}
            </p>
          )}
          <p className="mt-1 truncate text-sm text-gray-600">{place.address}</p>
          {place.phone && <p className="text-sm text-gray-600">{place.phone}</p>}
        </div>
      </div>
      {children || (
        <button
          type="button" onClick={() => onPick(place)}
          className="w-full border-t border-gray-100 bg-[#008070]/5 py-3 font-bold text-[#008070] transition hover:bg-[#008070] hover:text-white"
        >
          Yes, this is my business
        </button>
      )}
    </div>
  )
}

// Google gives most trades one generic category (landscapers come back as
// "General Contractor", cleaners as "Services"), so the owner says what they
// do. WaaS suggests kinds from the listing's categories and name; the best
// guess starts selected and they can pick more than one.
function KindsPicker({ place, onContinue }) {
  const [state, setState] = useState({ loading: true, error: '', kinds: [] })
  const [picked, setPicked] = useState([])

  useEffect(() => {
    let cancelled = false
    const qs = new URLSearchParams({ types: (place.types || []).join(','), label: place.category || '', name: place.name || '' })
    fetch(`/api/instant-site/styles?${qs}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          setState({ loading: false, error: data.error || "We couldn't load this step.", kinds: [] })
          return
        }
        const kinds = data.kinds || []
        setState({ loading: false, error: '', kinds })
        const best = kinds.find((k) => k.suggested)
        setPicked(best ? [best.value] : [])
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: "We couldn't load this step. Check your connection.", kinds: [] })
      })
    return () => { cancelled = true }
  }, [place])

  // "Something else" stands alone: it means none of the listed kinds.
  const toggle = (value) => setPicked((prev) => {
    if (value === 'other') return prev.includes('other') ? [] : ['other']
    const rest = prev.filter((v) => v !== 'other')
    return rest.includes(value) ? rest.filter((v) => v !== value) : [...rest, value]
  })

  const chips = [...state.kinds, { value: 'other', label: 'Something else' }]

  return (
    <div className="space-y-4 border-t border-gray-100 bg-[#008070]/5 p-4">
      <div>
        <p className="font-bold text-[#062A26]">What kind of work do you do?</p>
        <p className="text-sm text-gray-600">Pick all that fit. We&apos;ll show you styles made for it.</p>
      </div>

      {state.loading && (
        <div className="flex flex-wrap gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => <div key={i} className="h-10 w-32 animate-pulse rounded-full bg-white" />)}
        </div>
      )}
      <ErrorText>{state.error}</ErrorText>

      {!state.loading && !state.error && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kinds of work">
          {chips.map((k) => {
            const on = picked.includes(k.value)
            return (
              <button
                key={k.value} type="button" aria-pressed={on} onClick={() => toggle(k.value)}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition ${on ? 'border-[#008070] bg-[#008070] text-white' : 'border-gray-300 bg-white text-[#062A26] hover:border-[#008070]'}`}
              >
                {on && <Check size={16} strokeWidth={2.5} aria-hidden="true" />}
                {k.label}
              </button>
            )
          })}
        </div>
      )}

      <PrimaryButton type="button" disabled={state.loading || picked.length === 0} onClick={() => onContinue(picked)}>
        See my styles
      </PrimaryButton>
    </div>
  )
}

function MatchStep({ s, update }) {
  const results = s.results || []
  const [confirming, setConfirming] = useState(null)

  function pick(place) {
    trackEvent('instant_site_confirm', { category: place.category || 'unknown' })
    trackPixel('ViewContent', { content_name: 'business_confirmed', content_category: place.category || '' })
    setConfirming(place)
  }

  function proceed(industries) {
    trackEvent('instant_site_kinds', { kinds: industries.join(',') })
    // A listing phone is often the owner's cell — offer it, don't impose it.
    update({ selected: confirming, industries, template: null, step: 'style', phone: s.phone || '' })
  }

  if (confirming) {
    return (
      <div className="space-y-5">
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">Great, that&apos;s you.</h2>
        <BusinessCard place={confirming}>
          <KindsPicker place={confirming} onContinue={proceed} />
        </BusinessCard>
        <div className="text-center">
          <TextLink onClick={() => setConfirming(null)}>{results.length > 1 ? 'Not this one' : 'Back'}</TextLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">
          {results.length === 1 ? 'Is this you?' : results.length ? 'Which one is yours?' : 'We couldn’t find it'}
        </h2>
        {results.length === 0 && (
          <p className="mt-1 text-gray-600">
            No Google listing matched &ldquo;{s.businessName}&rdquo; in {s.city}, {s.state}. Try the name exactly as it
            appears on Google Maps, or a nearby city.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {results.map((place) => <BusinessCard key={place.placeId} place={place} onPick={pick} />)}
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <TextLink onClick={() => update({ step: 'business' })}>Search again</TextLink>
        <TextLink onClick={() => update({ step: 'manual' })}>My business isn&apos;t on Google</TextLink>
      </div>
    </div>
  )
}

// ── Step 3: style ────────────────────────────────────────────────────────────

function StyleStep({ s, update }) {
  const [state, setState] = useState({ loading: true, error: '', options: [], matched: false })
  const place = s.selected
  // Styles already built for this business, from "Try a different style".
  const tried = s.triedStyles || []
  const typesKey = (place?.types || []).join(',')
  const industriesKey = (s.industries || []).join(',')

  useEffect(() => {
    let cancelled = false
    const qs = new URLSearchParams({ types: typesKey, label: place?.category || '', name: place?.name || '' })
    // A visit resumed from before the kinds picker has no pick: let WaaS guess.
    if (industriesKey) qs.set('industries', industriesKey)
    fetch(`/api/instant-site/styles?${qs}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) setState({ loading: false, error: data.error || "We couldn't load the styles.", options: [], matched: false })
        else setState({ loading: false, error: '', options: data.options || [], matched: Boolean(data.matched) })
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: "We couldn't load the styles. Check your connection.", options: [], matched: false })
      })
    return () => { cancelled = true }
  }, [typesKey, place?.category, place?.name, industriesKey])

  function choose(option) {
    trackEvent('instant_site_style', { style: option.tone })
    trackPixel('CustomizeProduct', { content_name: option.tone })
    update({ template: { id: option.id, tone: option.tone }, step: 'contact' })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">
          {tried.length ? 'Pick a different style' : 'How should your site feel?'}
        </h2>
        <p className="mt-1 text-gray-600">
          {tried.length
            ? "We'll build it again in the style you choose and send you a new code."
            : state.matched
            ? 'Styles made for your kind of work. Pick the one that sounds like you.'
            : 'Pick the one that sounds most like your business. Your photos, reviews and details go in either way.'}
        </p>
      </div>

      {state.loading && (
        <div className="grid gap-3">
          {[0, 1].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100 sm:h-40" />)}
        </div>
      )}
      <ErrorText>{state.error}</ErrorText>

      {!state.loading && !state.error && state.options.length > 0 && (
        <div className="grid gap-3">
          {state.options.map((o) => (
            <div key={o.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-[#008070] hover:shadow-md sm:flex-row">
              <div className="aspect-[16/10] bg-[#E7EDE8] sm:w-[45%] sm:flex-shrink-0 sm:self-stretch sm:aspect-auto sm:min-h-44">
                {o.previewImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={o.previewImage} alt={`${o.tone} style example`} className="h-full w-full object-cover object-left-top" loading="lazy" />
                  : <div className="flex h-full items-center justify-center px-4 text-center font-inter-display text-xl font-semibold text-[#062A26]/60">{o.tone}</div>}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="flex flex-wrap items-center gap-2 text-lg font-bold text-[#062A26]">
                  {o.tone}
                  {tried.includes(o.id) && (
                    <span className="rounded-full bg-[#E7EDE8] px-2.5 py-0.5 text-xs font-bold text-[#062A26]/70">You saw this one</span>
                  )}
                </p>
                {o.description && <p className="mt-1 text-sm leading-relaxed text-gray-600">{o.description}</p>}
                <div className="mt-auto flex flex-col items-center gap-3 pt-4">
                  <button
                    type="button" onClick={() => choose(o)}
                    className="w-full rounded-xl bg-[#008070] px-4 py-3 font-bold text-white transition hover:bg-[#006b5d]"
                  >
                    Use this style
                  </button>
                  {o.exampleUrl && (
                    <a href={o.exampleUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#008070] underline-offset-4 hover:underline">
                      See an example
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!state.loading && !state.error && state.options.length === 0 && (
        <div className="space-y-3 text-center">
          <p className="text-gray-600">We&apos;re adding styles right now. Leave your details and we&apos;ll build yours by hand.</p>
          <TextLink onClick={() => update({ step: 'manual', businessName: place?.name || s.businessName })}>Leave my details</TextLink>
        </div>
      )}

      <div className="text-center">
        {s.previous?.reveal ? (
          <TextLink onClick={() => update({ ...s.previous, step: 'revealed', previous: null })}>Keep the site I have</TextLink>
        ) : (
          <TextLink onClick={() => update({ step: 'match' })}>Back to your listing</TextLink>
        )}
      </div>
    </div>
  )
}

// ── Step 4: contact ──────────────────────────────────────────────────────────

function ContactStep({ s, update, executeRecaptcha }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const place = s.selected
  const suggestion = emailSuggestion(s.email)
  const listingPhone = place?.phone && place.phone.replace(/\D/g, '') !== s.phone.replace(/\D/g, '') ? place.phone : null

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!s.name.trim()) return setError('What should we call you?')
    if (s.phone.replace(/\D/g, '').length !== 10) return setError('Enter a 10-digit mobile number.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email.trim())) return setError('Enter a valid email address.')

    setLoading(true)
    const eventId = newEventId()
    trackEvent('instant_site_lead', { category: place?.category || 'unknown' })
    trackPixel('Lead', { content_name: 'instant_site' }, eventId)
    try {
      const recaptchaToken = await executeRecaptcha('instant_start')
      const { ok, data } = await postJson('/api/instant-site/start', {
        name: s.name.trim(),
        phone: s.phone,
        email: s.email.trim(),
        city: s.city,
        state: s.state,
        business: place,
        templateId: s.template?.id,
        industry: (s.industries || []).find((i) => i !== 'other') || null,
        styleName: s.template?.tone,
        meta: s.meta,
        eventId,
        recaptchaToken,
      })
      if (!ok && data.reason === 'template') {
        // Their style was switched off since they picked it — choose again.
        update({ template: null, step: 'style' })
        return
      }
      if (!ok) { setError(data.error || 'Something went wrong. Try again.'); return }
      if (data.handoff) { update({ step: 'handoff' }); return }
      update({ token: data.token, startedAt: Date.now(), step: 'building', previous: null })
    } catch {
      setError('Something went wrong. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">Where should we send it?</h2>
        <p className="mt-1 text-gray-600">
          We&apos;ll send a code to unlock <span className="font-bold text-[#062A26]">{place?.name}</span>&apos;s new site
          {s.template?.tone ? <> in the <span className="font-bold text-[#062A26]">{s.template.tone}</span> style</> : null} the
          moment it&apos;s ready.
        </p>
      </div>

      <div>
        <label htmlFor="is-name" className={labelClass}>Your name</label>
        <input id="is-name" className={inputClass} autoComplete="name" placeholder="Maria Rivera"
          value={s.name} onChange={(e) => update({ name: e.target.value })} autoFocus />
      </div>

      <div>
        <label htmlFor="is-phone" className={labelClass}>Mobile number</label>
        <input id="is-phone" className={inputClass} type="tel" inputMode="tel" autoComplete="tel-national"
          placeholder="(541) 555-0100" value={s.phone} onChange={(e) => update({ phone: formatPhone(e.target.value) })} />
        {listingPhone && (
          <button type="button" onClick={() => update({ phone: formatPhone(listingPhone) })}
            className="mt-2 rounded-full border border-[#008070]/30 bg-[#008070]/5 px-3 py-1 text-sm font-bold text-[#008070]">
            Use {listingPhone} from your listing
          </button>
        )}
      </div>

      <div>
        <label htmlFor="is-email" className={labelClass}>Email</label>
        <input id="is-email" className={inputClass} type="email" inputMode="email" autoComplete="email" spellCheck={false}
          placeholder="you@example.com" value={s.email} onChange={(e) => update({ email: e.target.value.trim() })} />
        {suggestion && (
          <p className="mt-2 text-sm text-gray-600">
            Did you mean{' '}
            <button type="button" className="font-bold text-[#008070] underline" onClick={() => update({ email: suggestion })}>
              {suggestion}
            </button>?
          </p>
        )}
      </div>

      <ErrorText>{error}</ErrorText>
      <PrimaryButton type="submit" loading={loading}>Build my site</PrimaryButton>
      <p className="text-xs leading-relaxed text-gray-500">{SMS_CONSENT_TEXT}</p>
    </form>
  )
}

// ── Not on Google ────────────────────────────────────────────────────────────

function ManualStep({ s, update, executeRecaptcha }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [industry, setIndustry] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!s.name.trim() || s.phone.replace(/\D/g, '').length !== 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email)) {
      return setError('Fill in your name, a 10-digit mobile number and your email.')
    }
    setLoading(true)
    const eventId = newEventId()
    trackEvent('instant_site_manual_lead', {})
    trackPixel('Lead', { content_name: 'instant_site_manual' }, eventId)
    try {
      const recaptchaToken = await executeRecaptcha('instant_manual')
      const { ok, data } = await postJson('/api/instant-site/manual', {
        businessName: s.businessName, industry, city: s.city, state: s.state,
        name: s.name.trim(), phone: s.phone, email: s.email, meta: s.meta, eventId, recaptchaToken,
      })
      if (!ok) { setError(data.error || 'Something went wrong. Try again.'); return }
      update({ step: 'manual_done' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">No problem. We&apos;ll build it by hand</h2>
        <p className="mt-1 text-gray-600">Leave your details and we&apos;ll put together a preview for {s.businessName || 'your business'} and send it over.</p>
      </div>
      <div>
        <label htmlFor="m-industry" className={labelClass}>What does your business do?</label>
        <input id="m-industry" className={inputClass} placeholder="e.g. House cleaning" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      </div>
      <div>
        <label htmlFor="m-name" className={labelClass}>Your name</label>
        <input id="m-name" className={inputClass} autoComplete="name" value={s.name} onChange={(e) => update({ name: e.target.value })} />
      </div>
      <div>
        <label htmlFor="m-phone" className={labelClass}>Mobile number</label>
        <input id="m-phone" className={inputClass} type="tel" inputMode="tel" autoComplete="tel-national"
          value={s.phone} onChange={(e) => update({ phone: formatPhone(e.target.value) })} />
      </div>
      <div>
        <label htmlFor="m-email" className={labelClass}>Email</label>
        <input id="m-email" className={inputClass} type="email" inputMode="email" autoComplete="email" spellCheck={false}
          value={s.email} onChange={(e) => update({ email: e.target.value.trim() })} />
      </div>
      <ErrorText>{error}</ErrorText>
      <PrimaryButton type="submit" loading={loading}>Send it to me</PrimaryButton>
      <p className="text-xs leading-relaxed text-gray-500">{SMS_CONSENT_TEXT.replace('Build my site', 'Send it to me')}</p>
    </form>
  )
}

// ── Step 4: building ─────────────────────────────────────────────────────────

function BuildingStep({ s, update }) {
  const [status, setStatus] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [reviewIndex, setReviewIndex] = useState(0)
  const failedRef = useRef(false)

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const res = await fetch(`/api/instant-site/status?token=${s.token}`, { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (res.ok) {
          setStatus(data)
          if (data.stage === 'ready') {
            trackEvent('instant_site_built', {})
            update({ step: 'unlock' })
            return
          }
          if (data.stage === 'failed') {
            failedRef.current = true
            update({ step: 'handoff' })
            return
          }
        }
      } catch { /* transient — keep polling */ }
      if (!cancelled) timer = setTimeout(poll, POLL_MS)
    }
    let timer = setTimeout(poll, 1200)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [s.token, update])

  const reviews = status?.reviews || []
  useEffect(() => {
    if (reviews.length < 2) return
    const t = setInterval(() => setReviewIndex((i) => (i + 1) % reviews.length), 5000)
    return () => clearInterval(t)
  }, [reviews.length])

  const elapsed = Math.floor((now - (s.startedAt || now)) / 1000)
  const remaining = Math.max(0, BUILD_SECONDS - elapsed)
  const mm = String(Math.floor(remaining / 60))
  const ss = String(remaining % 60).padStart(2, '0')
  const stageIdx = STAGE_INDEX[status?.stage] ?? 0
  const review = reviews[reviewIndex % Math.max(reviews.length, 1)]

  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-base font-bold text-[#008070]">Building {s.selected?.name}</p>
        <p className="mt-2 font-inter-display text-6xl font-semibold tabular-nums text-[#062A26]" aria-live="polite">
          {remaining > 0 ? `${mm}:${ss}` : 'Almost…'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {remaining > 0 ? 'Stay on this page. Your code arrives the moment it’s live.' : 'Final touches. Hang tight, this can take another minute.'}
        </p>
      </div>

      <ul className="mx-auto max-w-sm space-y-3 text-left">
        {BUILD_STEPS.map((step, i) => {
          const done = i < stageIdx
          const active = i === stageIdx
          return (
            <li key={step.stage} className="flex items-center gap-3">
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done ? 'bg-[#008070] text-white' : active ? 'border-2 border-[#008070] text-[#008070]' : 'border-2 border-gray-200 text-gray-300'
              }`}>
                {done ? '✓' : active ? <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#008070]" /> : i + 1}
              </span>
              <span className={`font-bold ${done || active ? 'text-[#062A26]' : 'text-gray-400'}`}>{step.label}</span>
            </li>
          )
        })}
      </ul>

      {(status?.rating != null || review) && (
        <div className="rounded-2xl bg-gray-50 p-5 text-left">
          {status?.rating != null && (
            <p className="text-sm text-gray-700">
              Pulling in your <span className="font-bold"><Stars rating={status.rating} /> {status.rating.toFixed(1)}</span>
              {status.reviewCount ? <> from <span className="font-bold">{status.reviewCount} reviews</span></> : null}
            </p>
          )}
          {review && (
            <figure key={reviewIndex} className="mt-3 animate-[fadeIn_.5s_ease]">
              <blockquote className="text-gray-800">&ldquo;{review.text}&rdquo;</blockquote>
              <figcaption className="mt-1 text-sm text-gray-500">{review.author}, Google review</figcaption>
            </figure>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 5: unlock ───────────────────────────────────────────────────────────

function UnlockStep({ s, update }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const inputRef = useRef(null)

  const verify = useCallback(async (code) => {
    setError('')
    setLoading(true)
    const eventId = newEventId()
    try {
      const { ok, data } = await postJson('/api/instant-site/verify', {
        token: s.token, pin: code, eventId, meta: s.meta,
        email: s.email, phone: s.phone, name: s.name, businessName: s.selected?.name,
      })
      if (!ok) {
        setError(data.error || "That code doesn't match.")
        setPin('')
        inputRef.current?.focus()
        return
      }
      trackEvent('instant_site_unlocked', {})
      trackPixel('CompleteRegistration', { content_name: 'instant_site_unlocked' }, eventId)
      update({ reveal: data, step: 'revealed' })
    } finally {
      setLoading(false)
    }
  }, [s.token, s.meta, s.email, s.phone, s.name, s.selected, update])

  function onChange(e) {
    const code = e.target.value.replace(/\D/g, '').slice(0, 5)
    setPin(code)
    if (code.length === 5) verify(code)
  }

  async function resend() {
    setNote('')
    setError('')
    const { ok, data } = await postJson('/api/instant-site/resend', { token: s.token })
    if (ok) setNote('Sent again. Check your inbox (and spam folder).')
    else setError(data.error || 'Could not resend right now.')
  }

  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#008070]/10 text-3xl">🎉</div>
      <div>
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">Your site is ready!</h2>
        <p className="mt-1 text-gray-600">
          We sent a 5-digit code to <span className="font-bold text-[#062A26]">{maskEmail(s.email)}</span>. Enter it to see your site.
        </p>
      </div>
      <input
        ref={inputRef}
        aria-label="5-digit code"
        className="mx-auto block w-56 rounded-2xl border-2 border-gray-300 px-4 py-4 text-center font-mono text-4xl tracking-[0.4em] text-[#062A26] outline-none focus:border-[#008070] focus:ring-4 focus:ring-[#008070]/15"
        inputMode="numeric" autoComplete="one-time-code" placeholder="•••••"
        value={pin} onChange={onChange} disabled={loading} autoFocus
      />
      <ErrorText>{error}</ErrorText>
      {note && <p className="text-sm text-[#008070]">{note}</p>}
      <PrimaryButton type="button" loading={loading} disabled={pin.length !== 5} onClick={() => verify(pin)}>
        Show me my site
      </PrimaryButton>
      <TextLink onClick={resend}>Didn&apos;t get it? Send it again</TextLink>
    </div>
  )
}

// ── Step 6: revealed ─────────────────────────────────────────────────────────

function RevealedStep({ s, update, onStartOver }) {
  const r = s.reveal || {}

  // Same business, kinds of work and contact details; only the style changes.
  // A new style is a new build, so it goes back through the contact step
  // (prefilled) and a fresh code.
  function restyle() {
    trackEvent('instant_site_restyle', { from: s.template?.tone || '' })
    update({
      step: 'style',
      triedStyles: [...new Set([...(s.triedStyles || []), s.template?.id].filter(Boolean))],
      // Kept so "Keep the site I have" can go straight back to it.
      previous: { template: s.template, token: s.token, startedAt: s.startedAt, reveal: s.reveal },
      template: null,
      token: null,
      startedAt: null,
      reveal: null,
    })
  }
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="font-inter-display text-2xl font-semibold text-[#062A26] sm:text-3xl">
          Here&apos;s {s.selected?.name || 'your new site'}
        </h2>
        <p className="mt-1 text-gray-600">Built from your Google listing. Claim it and it goes live on your own domain.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <iframe src={r.previewUrl} title={`${s.selected?.name || 'Your'} website preview`} className="h-[70vh] w-full border-0 bg-white" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={r.claimUrl}
          onClick={() => { trackEvent('instant_site_claim_click', {}); trackPixel('InitiateCheckout', { content_name: 'instant_site_claim' }) }}
          className="flex-1 rounded-xl bg-[#008070] px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-[#008070]/25 transition hover:bg-[#006b5d]"
        >
          Claim my site
        </a>
        <a href={r.viewUrl} target="_blank" rel="noopener noreferrer"
          className="rounded-xl border border-gray-300 px-6 py-4 text-center font-bold text-gray-700 transition hover:border-gray-400">
          Open full screen
        </a>
      </div>
      <p className="text-center text-sm text-gray-500">We emailed you the link too, so you can come back to it anytime.</p>

      <div className="rounded-2xl border border-gray-200 bg-[#E7EDE8]/50 p-4 text-center sm:p-5">
        <p className="font-bold text-[#062A26]">Not quite the look you want?</p>
        <p className="mt-1 text-sm text-gray-600">
          See {s.selected?.name || 'your business'} in a different style. Your details stay the same.
        </p>
        <button
          type="button" onClick={restyle}
          className="mt-3 w-full rounded-xl border-2 border-[#008070] px-5 py-3 font-bold text-[#008070] transition hover:bg-[#008070] hover:text-white sm:w-auto"
        >
          Try a different style
        </button>
        <div className="mt-3">
          <TextLink onClick={onStartOver}>Start over with a different business</TextLink>
        </div>
      </div>
    </div>
  )
}

// ── Handoff: build couldn't start / not on Google ────────────────────────────

function HandoffStep({ s, manual }) {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#008070]/10 text-3xl">👍</div>
      <h2 className="font-inter-display text-2xl font-semibold text-[#062A26]">You&apos;re on our list</h2>
      <p className="text-gray-600">
        {manual
          ? `We'll put together a preview for ${s.businessName || 'your business'} by hand`
          : `We're finishing ${s.selected?.name || 'your site'} by hand`}
        {' '}and send it to <span className="font-bold text-[#062A26]">{maskEmail(s.email)}</span>, usually within one business day.
      </p>
      <p className="text-sm text-gray-500">Questions? Call or text <a className="font-bold text-[#008070]" href="tel:+15413210468">(541) 321-0468</a>.</p>
    </div>
  )
}
