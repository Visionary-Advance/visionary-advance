'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// useState that survives a page refresh. Values live in sessionStorage (per browser
// tab), keyed by the current path, so each admin page remembers its own tabs,
// filters and expanded items without leaking into other pages or tabs.
//
// Admin pages only render on the client (AdminAuthProvider shows a spinner until
// auth resolves), so reading storage in the initializer can't cause a hydration
// mismatch.
export function usePersistedState(key, defaultValue, { scope } = {}) {
  const pathname = usePathname();
  const storageKey = `va-admin:${scope ?? pathname}:${key}`;

  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      return raw === null ? defaultValue : JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (value === undefined) window.sessionStorage.removeItem(storageKey);
      else window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // storage full or blocked; state still works for this session
    }
  }, [storageKey, value]);

  return [value, setValue];
}
