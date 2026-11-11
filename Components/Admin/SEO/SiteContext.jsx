'use client';

import { createContext, useContext } from 'react';

// Provided by app/admin/seo/sites/[id]/layout.js to every section of one site:
// { site, analytics, analyticsLoading, syncing, sync, updateSite, linkedBusiness,
//   setLinkedBusiness, refreshPlanSummary }
export const SiteContext = createContext(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside a site page');
  return ctx;
}
