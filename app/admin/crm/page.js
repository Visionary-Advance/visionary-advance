'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import ProjectWidgets from '@/Components/CRM/Dashboard/ProjectWidgets';
import TasksWidget from '@/Components/CRM/Dashboard/TasksWidget';

export default function CRMDashboardPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <QuickStatCard
          label="Active Leads"
          value={stats?.overview?.totalLeads || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          href="/admin/crm/leads"
        />
        <QuickStatCard
          label="Total Clients"
          value={stats?.overview?.totalClients || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          color="green"
          href="/admin/crm/clients"
        />
        <QuickStatCard
          label="New This Week"
          value={stats?.overview?.leadsThisWeek || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          }
          href="/admin/crm/leads"
        />
        <QuickStatCard
          label="In Pipeline"
          value={stats?.overview?.activePipeline || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          href="/admin/crm/pipeline"
        />
        <QuickStatCard
          label="Win Rate"
          value={`${stats?.overview?.conversionRate || 0}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          }
          color="purple"
          href="/admin/crm/pipeline"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
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
              <div className="text-gray-400 text-sm">Lead kanban board</div>
            </div>
          </Link>

          <Link
            href="/admin/crm/projects"
            className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">Projects</div>
              <div className="text-gray-400 text-sm">Project kanban board</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tasks Widget and Project Widgets in 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Tasks Widget - Left Column */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4">My Tasks</h2>
          <TasksWidget />
        </div>

        {/* Project Widgets - Right Columns */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Project Overview</h2>
          <ProjectWidgets />
        </div>
      </div>
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
