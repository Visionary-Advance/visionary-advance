'use client'

// Stale-while-revalidate GET for admin pages.
//
// A page you've already opened this session paints instantly from the last
// response (memory, then sessionStorage), and the fresh copy replaces it as soon
// as it arrives. Requests for the same URL are shared, so four pages asking for
// /api/finance/stats at once make one call. After a write, call
// invalidate('/api/finance/') to refetch everything under that prefix.

import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'va-admin-cache:'
const memory = new Map() // url -> { data, at }
const listeners = new Map() // url -> Set<(entry) => void>
const inflight = new Map() // url -> Promise

function read(url) {
  if (memory.has(url)) return memory.get(url)
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(PREFIX + url)
    if (!raw) return null
    const entry = JSON.parse(raw)
    memory.set(url, entry)
    return entry
  } catch {
    return null
  }
}

function write(url, data) {
  const entry = { data, at: Date.now() }
  memory.set(url, entry)
  try {
    window.sessionStorage.setItem(PREFIX + url, JSON.stringify(entry))
  } catch {
    // Quota or private mode: memory still works
  }
  listeners.get(url)?.forEach((fn) => fn(entry))
}

function load(url) {
  if (inflight.has(url)) return inflight.get(url)
  const p = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const err = new Error(body.error || `Request failed (${res.status})`)
        err.status = res.status
        throw err
      }
      const data = await res.json()
      write(url, data)
      return data
    })
    .finally(() => inflight.delete(url))
  inflight.set(url, p)
  return p
}

// Refetch every mounted URL under `prefix`; drop the cached copies of the rest so
// they don't flash stale rows when next opened.
export function invalidate(prefix) {
  const keys = new Set([...memory.keys()])
  try {
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i)
      if (k?.startsWith(PREFIX)) keys.add(k.slice(PREFIX.length))
    }
  } catch { /* ignore */ }

  const pending = []
  for (const url of keys) {
    if (!url.startsWith(prefix)) continue
    if (listeners.get(url)?.size) {
      pending.push(load(url).catch(() => {}))
    } else {
      memory.delete(url)
      try { window.sessionStorage.removeItem(PREFIX + url) } catch { /* ignore */ }
    }
  }
  return Promise.all(pending)
}

// Forget everything (on sign-out).
export function clearCache() {
  memory.clear()
  try {
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const k = window.sessionStorage.key(i)
      if (k?.startsWith(PREFIX)) window.sessionStorage.removeItem(k)
    }
  } catch { /* ignore */ }
}

/**
 * const { data, loading, validating, error, refresh } = useCachedFetch(url, opts)
 *  - url: null/undefined to skip
 *  - opts.keepPrevious: while a new URL loads (next page, other filter), keep
 *    showing the previous URL's data instead of going back to a skeleton
 *  - opts.onError(err): called when a fetch fails
 */
export function useCachedFetch(url, { keepPrevious = false, onError } = {}) {
  const [entry, setEntry] = useState(() => (url ? { ...read(url), url } : null))
  const [error, setError] = useState(null)
  const [validating, setValidating] = useState(false)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const previous = useRef(undefined)

  useEffect(() => {
    if (!url) return undefined
    setEntry({ ...read(url), url })
    setError(null)

    let set = listeners.get(url)
    if (!set) listeners.set(url, (set = new Set()))
    const fn = (e) => setEntry({ ...e, url })
    set.add(fn)

    let active = true
    setValidating(true)
    load(url)
      .catch((err) => {
        if (!active) return
        setError(err)
        onErrorRef.current?.(err)
      })
      .finally(() => active && setValidating(false))

    return () => {
      active = false
      set.delete(fn)
    }
  }, [url])

  const refresh = useCallback(() => (url ? load(url).catch((err) => setError(err)) : Promise.resolve()), [url])

  // Right after `url` changes the state still holds the old URL's entry for one render.
  const current = entry?.url === url ? entry : url ? read(url) : null
  let data = current?.data
  if (data !== undefined) previous.current = data
  else if (keepPrevious) data = previous.current

  return { data, loading: data === undefined && !error, validating, error, refresh }
}
