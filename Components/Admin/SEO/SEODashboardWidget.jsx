'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SEODashboardWidget({ widget, onRemove }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!widget.site_id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/seo/analytics?siteId=${widget.site_id}&days=28`);
        const result = await res.json();

        if (result.error) {
          setError(result.error);
          return;
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [widget.site_id]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  // Render based on widget type
  switch (widget.widget_type) {
    case 'overview':
      return <OverviewWidget widget={widget} data={data} onRemove={onRemove} />;
    case 'top_queries':
      return <TopQueriesWidget widget={widget} data={data} onRemove={onRemove} />;
    case 'top_pages':
      return <TopPagesWidget widget={widget} data={data} onRemove={onRemove} />;
    case 'traffic_chart':
      return <TrafficChartWidget widget={widget} data={data} onRemove={onRemove} />;
    default:
      return null;
  }
}

function WidgetHeader({ title, siteName, onRemove }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        {siteName && <p className="text-gray-400 text-xs">{siteName}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/admin/crm/seo"
          className="text-gray-400 hover:text-white transition-colors"
          title="View SEO Dashboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-400 transition-colors"
          title="Remove widget"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function OverviewWidget({ widget, data, onRemove }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <WidgetHeader
        title="SEO Overview"
        siteName={widget.site?.display_name}
        onRemove={onRemove}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Clicks</p>
          <p className="text-2xl font-bold text-white">
            {data?.totalClicks?.toLocaleString() || '0'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Impressions</p>
          <p className="text-2xl font-bold text-white">
            {data?.totalImpressions?.toLocaleString() || '0'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">CTR</p>
          <p className="text-2xl font-bold text-white">
            {((data?.avgCtr || 0) * 100).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Avg Position</p>
          <p className="text-2xl font-bold text-white">
            {(data?.avgPosition || 0).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

function TopQueriesWidget({ widget, data, onRemove }) {
  const queries = data?.topQueries?.slice(0, 5) || [];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <WidgetHeader
        title="Top Search Queries"
        siteName={widget.site?.display_name}
        onRemove={onRemove}
      />
      <div className="space-y-3">
        {queries.length === 0 ? (
          <p className="text-gray-500 text-sm">No data available</p>
        ) : (
          queries.map((q, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm truncate flex-1 mr-4">{q.query}</span>
              <span className="text-teal-400 text-sm font-medium">{q.clicks}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TopPagesWidget({ widget, data, onRemove }) {
  const pages = data?.topPages?.slice(0, 5) || [];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <WidgetHeader
        title="Top Pages"
        siteName={widget.site?.display_name}
        onRemove={onRemove}
      />
      <div className="space-y-3">
        {pages.length === 0 ? (
          <p className="text-gray-500 text-sm">No data available</p>
        ) : (
          pages.map((p, i) => {
            let path = '/';
            try {
              path = new URL(p.page).pathname || '/';
            } catch {}
            return (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm truncate flex-1 mr-4">{path}</span>
                <span className="text-teal-400 text-sm font-medium">{p.clicks}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function TrafficChartWidget({ widget, data, onRemove }) {
  const dailyData = data?.dailyData || [];

  // Simple sparkline
  const maxClicks = Math.max(...dailyData.map(d => d.clicks), 1);
  const points = dailyData.map((d, i) => {
    const x = (i / (dailyData.length - 1 || 1)) * 100;
    const y = 100 - (d.clicks / maxClicks) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <WidgetHeader
        title="Traffic Trend"
        siteName={widget.site?.display_name}
        onRemove={onRemove}
      />
      {dailyData.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available</p>
      ) : (
        <div className="h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{dailyData[0]?.date?.slice(5) || ''}</span>
        <span>{dailyData[dailyData.length - 1]?.date?.slice(5) || ''}</span>
      </div>
    </div>
  );
}
