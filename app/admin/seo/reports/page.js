'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';

export default function SEOReportsPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteFilter, setSiteFilter] = useState('all');
  const [googleConnected, setGoogleConnected] = useState(false);

  // Check Google connection
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/auth/google/status?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => setGoogleConnected(data.connected))
      .catch(() => {});
  }, [user?.email]);

  // Fetch reports and sites
  useEffect(() => {
    if (!user?.email || !googleConnected) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [reportsRes, sitesRes] = await Promise.all([
          fetch('/api/seo/reports?limit=50'),
          fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}`)
        ]);
        const reportsData = await reportsRes.json();
        const sitesData = await sitesRes.json();
        setReports(reportsData.reports || []);
        setSites(sitesData.sites || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.email, googleConnected]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    if (siteFilter === 'all') return reports;
    return reports.filter(r => r.site_id === siteFilter);
  }, [reports, siteFilter]);

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
        <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
          <div className="text-gray-400 mb-4">Connect your Google account to view SEO reports.</div>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
      </div>

      {/* Filter */}
      {sites.length > 0 && (
        <div className="mb-6">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Sites</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.display_name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">No Reports Yet</h2>
          <p className="text-gray-400 mb-6">Generate your first report from a site's detail page.</p>
          <button
            onClick={() => router.push('/admin/seo/sites')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            View Sites
          </button>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Site</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Period</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Clicks</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Impressions</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">CTR</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => {
                const currentMonth = report.month_comparison?.currentMonth?.name;
                const previousMonth = report.month_comparison?.previousMonth?.name;
                const period = currentMonth && previousMonth
                  ? `${currentMonth} vs ${previousMonth}`
                  : formatDateRange(report.start_date, report.end_date);
                const siteName = report.site?.display_name || report.site?.site_url || 'Unknown';

                return (
                  <tr
                    key={report.id}
                    onClick={() => router.push(`/admin/seo/sites/${report.site_id}?tab=reports`)}
                    className="border-b border-[#262626] last:border-0 hover:bg-[#171717] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{siteName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm">{period}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white">{report.total_clicks?.toLocaleString() || 0}</span>
                      {report.clicks_change != null && (
                        <ChangeIndicator value={report.clicks_change} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white">{report.total_impressions?.toLocaleString() || 0}</span>
                      {report.impressions_change != null && (
                        <ChangeIndicator value={report.impressions_change} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white">{((report.avg_ctr || 0) * 100).toFixed(2)}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {report.status === 'sent' ? (
                        <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">Sent</span>
                      ) : (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-gray-400 text-sm">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ChangeIndicator({ value }) {
  if (value === null || value === undefined) return null;
  const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-500';
  const arrow = value > 0 ? '↑' : value < 0 ? '↓' : '';
  return (
    <span className={`text-xs ml-1 ${color}`}>
      {arrow}{Math.abs(value).toFixed(1)}%
    </span>
  );
}

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}
