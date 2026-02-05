'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import SEOSiteCard from '@/Components/Admin/SEO/SEOSiteCard';
import SEOAnalyticsChart from '@/Components/Admin/SEO/SEOAnalyticsChart';
import AddSiteModal from '@/Components/Admin/SEO/AddSiteModal';
import SEOReportPanel from '@/Components/Admin/SEO/SEOReportPanel';
import LinkToBusinessModal from '@/Components/Admin/SEO/LinkToBusinessModal';

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
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [siteToLink, setSiteToLink] = useState(null);
  const [linkedBusinesses, setLinkedBusinesses] = useState({});
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

  // Fetch linked businesses info for sites
  useEffect(() => {
    if (!sites || sites.length === 0) return;

    async function fetchLinkedBusinesses() {
      const businessesToFetch = sites
        .filter(s => s.business_id && !linkedBusinesses[s.business_id])
        .map(s => s.business_id);

      if (businessesToFetch.length === 0) return;

      try {
        // Fetch each business's basic info
        const businessPromises = businessesToFetch.map(businessId =>
          fetch(`/api/crm/businesses/${businessId}`).then(r => r.json())
        );

        const businessResults = await Promise.all(businessPromises);
        const newLinkedBusinesses = { ...linkedBusinesses };

        businessResults.forEach(result => {
          if (result.business) {
            newLinkedBusinesses[result.business.id] = result.business;
          }
        });

        setLinkedBusinesses(newLinkedBusinesses);
      } catch (err) {
        console.error('Error fetching linked businesses:', err);
      }
    }

    fetchLinkedBusinesses();
  }, [sites]);

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

  // Link site to business
  async function handleLinkSite(businessId) {
    if (!siteToLink) return;

    const res = await fetch(`/api/seo/sites?id=${siteToLink.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId })
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update local state
    setSites(sites.map(s =>
      s.id === siteToLink.id ? { ...s, business_id: businessId } : s
    ));

    // Update selected site if it was the one linked
    if (selectedSite?.id === siteToLink.id) {
      setSelectedSite({ ...selectedSite, business_id: businessId });
    }

    // Fetch the business info if linking (not unlinking)
    if (businessId) {
      try {
        const businessRes = await fetch(`/api/crm/businesses/${businessId}`);
        const businessData = await businessRes.json();
        if (businessData.business) {
          setLinkedBusinesses(prev => ({ ...prev, [businessId]: businessData.business }));
        }
      } catch (err) {
        console.error('Error fetching linked business:', err);
      }
    }
  }

  // Open link modal for a site
  function openLinkModal(site) {
    setSiteToLink(site);
    setShowLinkModal(true);
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
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">SEO Dashboard</h1>
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
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
    <div>
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
              className="bg-[#171717] hover:bg-[#262626] border border-[#262626] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
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
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
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
                onLinkBusiness={() => openLinkModal(site)}
                linkedBusiness={site.business_id ? linkedBusinesses[site.business_id] : null}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSite ? (
              <div className="space-y-6">
                {/* Site Header */}
                <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
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
                    <div className="flex items-center gap-3">
                      {/* Linked Business Badge */}
                      {selectedSite.business_id && linkedBusinesses[selectedSite.business_id] ? (
                        <button
                          onClick={() => openLinkModal(selectedSite)}
                          className="flex items-center gap-2 px-3 py-2 bg-teal-900/30 border border-teal-700/50 rounded-lg hover:bg-teal-900/50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-teal-300 text-sm">
                            {linkedBusinesses[selectedSite.business_id].name}
                          </span>
                          <svg className="w-3 h-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => openLinkModal(selectedSite)}
                          className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="text-sm">Link to Business</span>
                        </button>
                      )}
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
                    <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Traffic (Last 28 Days)</h3>
                      <SEOAnalyticsChart data={analytics.dailyData || []} />
                    </div>

                    {/* Top Queries & Pages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Queries</h3>
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

                      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
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
            ) : (
              <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
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

      {/* Link to Business Modal */}
      {showLinkModal && siteToLink && (
        <LinkToBusinessModal
          site={siteToLink}
          onLink={handleLinkSite}
          onClose={() => {
            setShowLinkModal(false);
            setSiteToLink(null);
          }}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value, trend }) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-4">
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
