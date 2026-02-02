'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import SEODashboardWidget from '@/Components/Admin/SEO/SEODashboardWidget';

export default function CRMDashboardPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const [widgets, setWidgets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard widgets
  useEffect(() => {
    if (!user?.email) return;

    async function fetchWidgets() {
      try {
        const res = await fetch(`/api/seo/widgets?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setWidgets(data.widgets || []);
      } catch (err) {
        console.error('Error fetching widgets:', err);
      }
    }

    fetchWidgets();
  }, [user?.email]);

  // Fetch CRM stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/crm/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Remove widget
  async function handleRemoveWidget(widgetId) {
    try {
      const res = await fetch(
        `/api/seo/widgets?id=${widgetId}&email=${encodeURIComponent(user.email)}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setWidgets(widgets.filter(w => w.id !== widgetId));
      }
    } catch (err) {
      console.error('Error removing widget:', err);
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          label="Total Leads"
          value={stats?.totalLeads || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          href="/admin/crm/leads"
        />
        <QuickStatCard
          label="New This Week"
          value={stats?.newThisWeek || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          }
          href="/admin/crm/leads?status=new"
        />
        <QuickStatCard
          label="In Pipeline"
          value={stats?.inPipeline || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          href="/admin/crm/pipeline"
        />
        <QuickStatCard
          label="Won Deals"
          value={stats?.wonDeals || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          href="/admin/crm/leads?stage=won"
        />
      </div>

      {/* SEO Widgets Section */}
      {widgets.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">SEO Insights</h2>
            <Link
              href="/admin/crm/seo"
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map(widget => (
              <SEODashboardWidget
                key={widget.id}
                widget={widget}
                onRemove={() => handleRemoveWidget(widget.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/crm/leads"
            className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">View Leads</div>
              <div className="text-gray-400 text-sm">Manage your leads</div>
            </div>
          </Link>

          <Link
            href="/admin/crm/pipeline"
            className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">Pipeline View</div>
              <div className="text-gray-400 text-sm">Kanban board</div>
            </div>
          </Link>

          <Link
            href="/admin/crm/seo"
            className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">SEO Dashboard</div>
              <div className="text-gray-400 text-sm">Search analytics</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Add Widget Prompt (if no widgets) */}
      {widgets.length === 0 && (
        <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <div className="text-gray-400 mb-3">
            Add SEO widgets to your dashboard for quick insights
          </div>
          <Link
            href="/admin/crm/seo"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Go to SEO Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

function QuickStatCard({ label, value, icon, color = 'teal', href }) {
  const colorClasses = {
    teal: 'bg-teal-500/20 text-teal-400',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <Link
      href={href}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}
