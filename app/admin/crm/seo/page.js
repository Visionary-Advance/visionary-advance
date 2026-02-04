'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import SEOSiteCard from '@/Components/Admin/SEO/SEOSiteCard';
import SEOAnalyticsChart from '@/Components/Admin/SEO/SEOAnalyticsChart';
import AddSiteModal from '@/Components/Admin/SEO/AddSiteModal';
import SEOReportPanel from '@/Components/Admin/SEO/SEOReportPanel';

export default function SEODashboardPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [sites, setSites] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Check Google connection status
  useEffect(() => {
    if (!user?.email) return;

    async function checkGoogle() {
      try {
        const res = await fetch(`/api/auth/google/status?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setGoogleConnected(data.connected);
      } catch (err) {
        console.error('Error checking Google status:', err);
      }
    }
    checkGoogle();
  }, [user?.email]);

  // Fetch sites
  useEffect(() => {
    if (!user?.email || !googleConnected) return;

    async function fetchSites() {
      setLoading(true);
      try {
        const res = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setSites(data.sites || []);
        setAvailableSites(data.availableSites || []);

        // Log any errors fetching available sites
        if (data.availableSitesError) {
          console.error('Error fetching available sites:', data.availableSitesError);
        }

        // Auto-select first site if none selected
        if (data.sites?.length > 0 && !selectedSite) {
          setSelectedSite(data.sites[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, [user?.email, googleConnected]);

  // Fetch analytics when site is selected
  useEffect(() => {
    if (!selectedSite?.id) {
      setAnalytics(null);
      return;
    }

    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/seo/analytics?siteId=${selectedSite.id}&days=28`);
        const data = await res.json();

        if (data.error) {
          console.error('Error fetching analytics:', data.error);
          return;
        }

        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    }

    fetchAnalytics();
  }, [selectedSite?.id]);

  // Sync data
  async function handleSync() {
    if (!selectedSite?.id) return;

    setSyncing(true);
    try {
      const res = await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: selectedSite.id, type: 'all', days: 28 })
      });

      const data = await res.json();
      if (data.error) {
        alert('Sync failed: ' + data.error);
        return;
      }

      // Refresh analytics
      const analyticsRes = await fetch(`/api/seo/analytics?siteId=${selectedSite.id}&days=28`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      alert('Sync complete!');
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  }

  // Add site
  async function handleAddSite(siteUrl, displayName) {
    try {
      const res = await fetch('/api/seo/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl,
          googleEmail: user.email,
          displayName
        })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh sites list
      const sitesRes = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`);
      const sitesData = await sitesRes.json();
      setSites(sitesData.sites || []);
      setAvailableSites(sitesData.availableSites || []);

      // Select the new site
      setSelectedSite(data.site);
      setShowAddModal(false);

      // Trigger initial sync
      setTimeout(() => {
        handleSync();
      }, 500);
    } catch (err) {
      throw err;
    }
  }

  // Remove site
  async function handleRemoveSite(siteId) {
    if (!confirm('Are you sure you want to remove this site?')) return;

    try {
      const res = await fetch(`/api/seo/sites?id=${siteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.error) {
        alert('Failed to remove site: ' + data.error);
        return;
      }

      // Refresh sites
      setSites(sites.filter(s => s.id !== siteId));
      if (selectedSite?.id === siteId) {
        setSelectedSite(sites.find(s => s.id !== siteId) || null);
      }
    } catch (err) {
      alert('Failed to remove site: ' + err.message);
    }
  }

  // Add to dashboard
  async function handleAddToDashboard(widgetType) {
    try {
      const res = await fetch('/api/seo/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          widgetType,
          siteId: selectedSite?.id
        })
      });

      const data = await res.json();
      if (data.error) {
        alert('Failed to add widget: ' + data.error);
        return;
      }

      alert('Widget added to dashboard!');
    } catch (err) {
      alert('Failed to add widget: ' + err.message);
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!googleConnected) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">SEO Dashboard</h1>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <div className="text-gray-400 mb-4">
            Connect your Google account to access Search Console data.
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Connect Google Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">SEO Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Site
          </button>
          {selectedSite && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
      ) : sites.length === 0 ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <div className="text-gray-400 mb-4">
            No sites added yet. Add a site from your Search Console to get started.
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Your First Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sites Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Sites</h2>
            {sites.map(site => (
              <SEOSiteCard
                key={site.id}
                site={site}
                isSelected={selectedSite?.id === site.id}
                onClick={() => setSelectedSite(site)}
                onRemove={() => handleRemoveSite(site.id)}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSite ? (
              <div className="space-y-6">
                {/* Site Header */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedSite.display_name}</h2>
                      <p className="text-gray-400 text-sm">{selectedSite.site_url}</p>
                      {selectedSite.last_sync_at && (
                        <p className="text-gray-500 text-xs mt-1">
                          Last synced: {new Date(selectedSite.last_sync_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToDashboard('overview')}
                        className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
                      >
                        + Add to Dashboard
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analytics Overview */}
                {analytics && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard
                        label="Total Clicks"
                        value={analytics.totalClicks?.toLocaleString() || '0'}
                        trend={null}
                      />
                      <MetricCard
                        label="Total Impressions"
                        value={analytics.totalImpressions?.toLocaleString() || '0'}
                        trend={null}
                      />
                      <MetricCard
                        label="Avg. CTR"
                        value={((analytics.avgCtr || 0) * 100).toFixed(2) + '%'}
                        trend={null}
                      />
                      <MetricCard
                        label="Avg. Position"
                        value={(analytics.avgPosition || 0).toFixed(1)}
                        trend={null}
                      />
                    </div>

                    {/* Traffic Chart */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Traffic (Last 28 Days)</h3>
                        <button
                          onClick={() => handleAddToDashboard('traffic_chart')}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          + Add to Dashboard
                        </button>
                      </div>
                      <SEOAnalyticsChart data={analytics.dailyData || []} />
                    </div>

                    {/* Top Queries & Pages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Top Queries</h3>
                          <button
                            onClick={() => handleAddToDashboard('top_queries')}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            + Add to Dashboard
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(analytics.topQueries || []).slice(0, 10).map((q, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300 truncate flex-1 mr-4">{q.query}</span>
                              <div className="flex gap-4 text-gray-400">
                                <span>{q.clicks} clicks</span>
                              </div>
                            </div>
                          ))}
                          {(!analytics.topQueries || analytics.topQueries.length === 0) && (
                            <p className="text-gray-500 text-sm">No query data available</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Top Pages</h3>
                          <button
                            onClick={() => handleAddToDashboard('top_pages')}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            + Add to Dashboard
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(analytics.topPages || []).slice(0, 10).map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300 truncate flex-1 mr-4">
                                {new URL(p.page).pathname || '/'}
                              </span>
                              <div className="flex gap-4 text-gray-400">
                                <span>{p.clicks} clicks</span>
                              </div>
                            </div>
                          ))}
                          {(!analytics.topPages || analytics.topPages.length === 0) && (
                            <p className="text-gray-500 text-sm">No page data available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SEO Reports */}
                    <SEOReportPanel site={selectedSite} userEmail={user?.email} />
                  </>
                )}

                {!analytics && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
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
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                <p className="text-gray-400">Select a site to view analytics</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          availableSites={availableSites}
          onAdd={handleAddSite}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value, trend }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend !== null && (
        <p className={`text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}% vs last period
        </p>
      )}
    </div>
  );
}
