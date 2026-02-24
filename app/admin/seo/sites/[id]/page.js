'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import SEOAnalyticsChart from '@/Components/Admin/SEO/SEOAnalyticsChart';
import SEOPlanView from '@/Components/Admin/SEO/SEOPlanView';
import SEOReportPanel from '@/Components/Admin/SEO/SEOReportPanel';
import LinkToBusinessModal from '@/Components/Admin/SEO/LinkToBusinessModal';

export default function SiteDetailPage({ params }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';

  const [site, setSite] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkedBusiness, setLinkedBusiness] = useState(null);

  // Fetch site info
  useEffect(() => {
    if (!user?.email) return;

    async function fetchSite() {
      setLoading(true);
      try {
        const res = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        const found = (data.sites || []).find(s => s.id === id);
        if (!found) {
          router.push('/admin/seo/sites');
          return;
        }
        setSite(found);
      } catch (err) {
        console.error('Error fetching site:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSite();
  }, [user?.email, id]);

  // Fetch analytics
  useEffect(() => {
    if (!site?.id) return;

    fetch(`/api/seo/analytics?siteId=${site.id}&days=28`)
      .then(r => r.json())
      .then(data => { if (!data.error) setAnalytics(data); })
      .catch(() => {});
  }, [site?.id]);

  // Fetch linked business
  useEffect(() => {
    if (!site?.business_id) { setLinkedBusiness(null); return; }

    fetch(`/api/crm/businesses/${site.business_id}`)
      .then(r => r.json())
      .then(data => { if (data.business) setLinkedBusiness(data.business); })
      .catch(() => {});
  }, [site?.business_id]);

  // Sync data
  async function handleSync() {
    if (!site?.id) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, type: 'all', days: 28 })
      });
      const data = await res.json();
      if (data.error) { alert('Sync failed: ' + data.error); return; }

      const analyticsRes = await fetch(`/api/seo/analytics?siteId=${site.id}&days=28`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
      alert('Sync complete!');
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  }

  // Link site to business
  async function handleLinkSite(businessId) {
    if (!site) return;
    const res = await fetch(`/api/seo/sites?id=${site.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setSite({ ...site, business_id: businessId });

    if (businessId) {
      try {
        const bRes = await fetch(`/api/crm/businesses/${businessId}`);
        const bData = await bRes.json();
        if (bData.business) setLinkedBusiness(bData.business);
      } catch {}
    } else {
      setLinkedBusiness(null);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-12 text-gray-400">
        Site not found. <button onClick={() => router.push('/admin/seo/sites')} className="text-teal-400 hover:text-teal-300">Back to Sites</button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          onClick={() => router.push('/admin/seo/sites')}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sites
        </button>
      </div>

      {/* Site Header */}
      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{site.display_name}</h1>
            <p className="text-gray-400 text-sm">{site.site_url}</p>
            {site.last_sync_at && (
              <p className="text-gray-500 text-xs mt-1">
                Last synced: {new Date(site.last_sync_at).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Linked Business Badge */}
            {site.business_id && linkedBusiness ? (
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-teal-900/30 border border-teal-700/50 rounded-lg hover:bg-teal-900/50 transition-colors"
              >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-teal-300 text-sm">{linkedBusiness.name}</span>
                <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm">Link to Business</span>
              </button>
            )}

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-[#171717] hover:bg-[#262626] border border-[#262626] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#262626] mb-6">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'plan', label: 'Plan' },
          { id: 'reports', label: 'Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {analytics ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Total Clicks" value={analytics.totalClicks?.toLocaleString() || '0'} />
                <MetricCard label="Total Impressions" value={analytics.totalImpressions?.toLocaleString() || '0'} />
                <MetricCard label="Avg. CTR" value={((analytics.avgCtr || 0) * 100).toFixed(2) + '%'} />
                <MetricCard label="Avg. Position" value={(analytics.avgPosition || 0).toFixed(1)} />
              </div>

              <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Traffic (Last 28 Days)</h3>
                <SEOAnalyticsChart data={analytics.dailyData || []} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Queries</h3>
                  <div className="space-y-3">
                    {(analytics.topQueries || []).slice(0, 10).map((q, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 truncate flex-1 mr-4">{q.query}</span>
                        <span className="text-gray-400">{q.clicks} clicks</span>
                      </div>
                    ))}
                    {(!analytics.topQueries || analytics.topQueries.length === 0) && (
                      <p className="text-gray-500 text-sm">No query data available</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
                  <div className="space-y-3">
                    {(analytics.topPages || []).slice(0, 10).map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 truncate flex-1 mr-4">
                          {(() => { try { return new URL(p.page).pathname || '/'; } catch { return p.page; } })()}
                        </span>
                        <span className="text-gray-400">{p.clicks} clicks</span>
                      </div>
                    ))}
                    {(!analytics.topPages || analytics.topPages.length === 0) && (
                      <p className="text-gray-500 text-sm">No page data available</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
              <div className="text-gray-400 mb-4">
                No analytics data cached yet. Click "Sync Data" to fetch data from Search Console.
              </div>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === 'plan' && <SEOPlanView site={site} />}

      {/* Reports Tab */}
      {activeTab === 'reports' && <SEOReportPanel site={site} userEmail={user?.email} />}

      {/* Link to Business Modal */}
      {showLinkModal && (
        <LinkToBusinessModal
          site={site}
          onLink={handleLinkSite}
          onClose={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-4">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
