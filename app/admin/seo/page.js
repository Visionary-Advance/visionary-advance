'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import AddSiteModal from '@/Components/Admin/SEO/AddSiteModal';

export default function SEODashboardPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [sites, setSites] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [aggregateMetrics, setAggregateMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Check Google connection
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/auth/google/status?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => setGoogleConnected(data.connected))
      .catch(() => {});
  }, [user?.email]);

  // Fetch all data
  useEffect(() => {
    if (!user?.email || !googleConnected) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [sitesRes, reportsRes] = await Promise.all([
          fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`),
          fetch('/api/seo/reports?limit=5')
        ]);

        const sitesData = await sitesRes.json();
        const reportsData = await reportsRes.json();

        const fetchedSites = sitesData.sites || [];
        setSites(fetchedSites);
        setAvailableSites(sitesData.availableSites || []);
        setRecentReports(reportsData.reports || []);

        // Fetch aggregate analytics across all sites
        if (fetchedSites.length > 0) {
          const analyticsResults = await Promise.all(
            fetchedSites.map(s =>
              fetch(`/api/seo/analytics?siteId=${s.id}&days=28`)
                .then(r => r.json())
                .catch(() => null)
            )
          );

          let totalClicks = 0;
          let totalImpressions = 0;
          let sitesWithData = 0;

          analyticsResults.forEach(data => {
            if (data && !data.error) {
              totalClicks += data.totalClicks || 0;
              totalImpressions += data.totalImpressions || 0;
              if (data.totalClicks || data.totalImpressions) sitesWithData++;
            }
          });

          setAggregateMetrics({ totalClicks, totalImpressions, sitesWithData });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.email, googleConnected]);

  // Add site handler
  async function handleAddSite(siteUrl, displayName) {
    const res = await fetch('/api/seo/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteUrl, googleEmail: user.email, displayName })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const sitesRes = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`);
    const sitesData = await sitesRes.json();
    setSites(sitesData.sites || []);
    setAvailableSites(sitesData.availableSites || []);
    setShowAddModal(false);

    // Navigate to the new site
    if (data.site?.id) router.push(`/admin/seo/sites/${data.site.id}`);
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
            onClick={() => router.push('/admin/seo/sites')}
            className="bg-[#171717] hover:bg-[#262626] border border-[#262626] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            View All Sites
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Site
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
      ) : sites.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Get Started with SEO Tracking</h2>
          <p className="text-gray-400 mb-6">Add your first site from Google Search Console to start monitoring performance.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            Add Your First Site
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Aggregate Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-5">
              <p className="text-gray-400 text-sm mb-1">Total Sites</p>
              <p className="text-3xl font-bold text-white">{sites.length}</p>
              <p className="text-gray-500 text-xs mt-1">
                {aggregateMetrics?.sitesWithData || 0} with data
              </p>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-5">
              <p className="text-gray-400 text-sm mb-1">Total Clicks (28d)</p>
              <p className="text-3xl font-bold text-white">
                {(aggregateMetrics?.totalClicks || 0).toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">Across all sites</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-5">
              <p className="text-gray-400 text-sm mb-1">Total Impressions (28d)</p>
              <p className="text-3xl font-bold text-white">
                {(aggregateMetrics?.totalImpressions || 0).toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">Across all sites</p>
            </div>
          </div>

          {/* Sites Quick List */}
          <div className="bg-[#0a0a0a] rounded-lg border border-[#262626]">
            <div className="flex items-center justify-between p-4 border-b border-[#262626]">
              <h2 className="text-lg font-semibold text-white">Your Sites</h2>
              <button
                onClick={() => router.push('/admin/seo/sites')}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-[#262626]">
              {sites.map(site => (
                <button
                  key={site.id}
                  onClick={() => router.push(`/admin/seo/sites/${site.id}`)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#171717] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{site.display_name}</p>
                    <p className="text-gray-500 text-sm truncate">{site.site_url}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {site.last_sync_at ? (
                      <span className="text-gray-500 text-xs">
                        Synced {formatTimeAgo(site.last_sync_at)}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">Not synced</span>
                    )}
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-[#0a0a0a] rounded-lg border border-[#262626]">
            <div className="flex items-center justify-between p-4 border-b border-[#262626]">
              <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
              <button
                onClick={() => router.push('/admin/seo/reports')}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                View All
              </button>
            </div>
            {recentReports.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <p>No reports generated yet.</p>
                <p className="text-sm mt-1">Generate reports from individual site pages.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#262626]">
                {recentReports.map(report => {
                  const currentMonth = report.month_comparison?.currentMonth?.name;
                  const previousMonth = report.month_comparison?.previousMonth?.name;
                  const period = currentMonth && previousMonth
                    ? `${currentMonth} vs ${previousMonth}`
                    : formatDateRange(report.start_date, report.end_date);
                  const siteName = report.site?.display_name || report.site?.site_url || 'Unknown';

                  return (
                    <button
                      key={report.id}
                      onClick={() => router.push(`/admin/seo/sites/${report.site_id}?tab=reports`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#171717] transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">{siteName}</p>
                        <p className="text-gray-500 text-sm">{period}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-gray-400 text-sm">
                          {report.total_clicks?.toLocaleString() || 0} clicks
                        </span>
                        {report.status === 'sent' ? (
                          <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">Sent</span>
                        ) : (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Draft</span>
                        )}
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
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

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}
