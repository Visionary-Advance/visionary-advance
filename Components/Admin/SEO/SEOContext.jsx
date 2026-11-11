'use client';

// One place that loads the Google connection, the site list, and per-site analytics
// and active plans, so the sidebar, the sites table and each site page share the
// same data instead of each refetching it.

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';

const SEOContext = createContext(null);

export function SEOProvider({ children }) {
  const { user } = useAdminAuth();
  const email = user?.email;

  const [googleConnected, setGoogleConnected] = useState(null); // null = checking
  const [sites, setSites] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [sitesError, setSitesError] = useState(null);
  const [analyticsBySite, setAnalyticsBySite] = useState({});
  const [planBySite, setPlanBySite] = useState({});
  const inflight = useRef({});

  useEffect(() => {
    if (!email) return;
    fetch(`/api/auth/google/status?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => setGoogleConnected(!!data.connected))
      .catch(() => setGoogleConnected(false));
  }, [email]);

  const refreshSites = useCallback(async () => {
    if (!email) return;
    setSitesLoading(true);
    setSitesError(null);
    try {
      const res = await fetch(`/api/seo/sites?email=${encodeURIComponent(email)}&includeAvailable=true`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSites(data.sites || []);
      setAvailableSites(data.availableSites || []);
    } catch (err) {
      setSitesError(err.message);
    } finally {
      setSitesLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (googleConnected) refreshSites();
    else if (googleConnected === false) setSitesLoading(false);
  }, [googleConnected, refreshSites]);

  // Dedupe concurrent loads per key; `force` skips the cache (after a sync).
  const loadOnce = useCallback(async (key, fn) => {
    if (inflight.current[key]) return inflight.current[key];
    const p = fn().finally(() => { delete inflight.current[key]; });
    inflight.current[key] = p;
    return p;
  }, []);

  const loadAnalytics = useCallback((siteId, { force = false } = {}) => {
    if (!force && analyticsBySite[siteId]) return Promise.resolve(analyticsBySite[siteId]);
    return loadOnce(`a:${siteId}`, async () => {
      try {
        const res = await fetch(`/api/seo/analytics?siteId=${siteId}&days=28`);
        const data = await res.json();
        const value = data.error ? { error: data.error } : data;
        setAnalyticsBySite(m => ({ ...m, [siteId]: value }));
        return value;
      } catch (err) {
        const value = { error: err.message };
        setAnalyticsBySite(m => ({ ...m, [siteId]: value }));
        return value;
      }
    });
  }, [analyticsBySite, loadOnce]);

  // Active + draft plan summary per site, for progress in tables and the sidebar.
  const loadPlanSummary = useCallback((siteId, { force = false } = {}) => {
    if (!force && planBySite[siteId]) return Promise.resolve(planBySite[siteId]);
    return loadOnce(`p:${siteId}`, async () => {
      try {
        const res = await fetch(`/api/seo/plans?siteId=${siteId}`);
        const data = await res.json();
        const plans = data.plans || [];
        const active = plans.find(p => p.status === 'active') || null;
        const value = {
          active: active && {
            month: active.month,
            total: active.tasks?.length || 0,
            done: active.tasks?.filter(t => t.status === 'completed').length || 0,
          },
          hasDraft: plans.some(p => p.status === 'draft'),
        };
        setPlanBySite(m => ({ ...m, [siteId]: value }));
        return value;
      } catch {
        const value = { active: null, hasDraft: false, error: true };
        setPlanBySite(m => ({ ...m, [siteId]: value }));
        return value;
      }
    });
  }, [planBySite, loadOnce]);

  const updateSiteLocal = useCallback((siteId, patch) => {
    setSites(list => list.map(s => (s.id === siteId ? { ...s, ...patch } : s)));
  }, []);

  const removeSiteLocal = useCallback(siteId => {
    setSites(list => list.filter(s => s.id !== siteId));
  }, []);

  return (
    <SEOContext.Provider
      value={{
        user, googleConnected, sites, availableSites, sitesLoading, sitesError, refreshSites,
        analyticsBySite, loadAnalytics, planBySite, loadPlanSummary, updateSiteLocal, removeSiteLocal,
      }}
    >
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  const ctx = useContext(SEOContext);
  if (!ctx) throw new Error('useSEO must be used inside SEOProvider');
  return ctx;
}

// PATCH a site and mirror the change into the shared list.
export async function patchSite(siteId, body) {
  const res = await fetch(`/api/seo/sites?id=${siteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || 'Update failed');
  return data.site;
}
