'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Keeps your place on admin pages across a refresh. The browser's own scroll
// restoration gives up because admin content loads async (spinner first, then
// data), so the page is too short to scroll to when it tries.
//
// On a reload / back-forward load we wait until the page is tall enough, then
// jump back. Client-side navigation is left alone (new pages start at the top).

const MAX_WAIT_MS = 8000;
let initialLoadHandled = false;

function storageKey(pathname) {
  return `va-admin-scroll:${pathname}`;
}

function isReloadOrHistoryLoad() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav?.type === 'reload' || nav?.type === 'back_forward';
  } catch {
    return false;
  }
}

export default function AdminScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const key = storageKey(pathname);
    let saving = false;
    let frame = 0;
    let cancelled = false;
    const cleanups = [];

    const save = () => {
      if (!saving) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(key, String(Math.round(window.scrollY)));
        } catch {}
      });
    };
    window.addEventListener('scroll', save, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', save));

    const shouldRestore = !initialLoadHandled && isReloadOrHistoryLoad();
    initialLoadHandled = true;

    let target = 0;
    if (shouldRestore) {
      try {
        target = parseInt(sessionStorage.getItem(key) || '0', 10) || 0;
      } catch {}
    }

    if (target <= 0) {
      saving = true;
    } else {
      const started = Date.now();
      const stop = () => {
        if (cancelled) return;
        cancelled = true;
        saving = true;
        observer.disconnect();
        clearInterval(timer);
        userEvents.forEach(e => window.removeEventListener(e, stop));
      };
      const tryRestore = () => {
        if (cancelled) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll >= target) {
          window.scrollTo(0, target);
          stop();
        } else if (Date.now() - started > MAX_WAIT_MS) {
          // Page never got that tall (content changed); get as close as we can.
          window.scrollTo(0, Math.max(0, maxScroll));
          stop();
        }
      };

      // Re-check whenever content changes, plus a timer as a fallback.
      const observer = new ResizeObserver(tryRestore);
      observer.observe(document.body);
      const timer = setInterval(tryRestore, 150);

      // If you start scrolling yourself, don't yank you somewhere else.
      const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
      userEvents.forEach(e => window.addEventListener(e, stop, { passive: true }));

      cleanups.push(stop);
      tryRestore();
    }

    return () => {
      cancelAnimationFrame(frame);
      cleanups.forEach(fn => fn());
    };
  }, [pathname]);

  return null;
}
