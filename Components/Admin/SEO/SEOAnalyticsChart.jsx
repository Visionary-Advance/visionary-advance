'use client';

import { useMemo, useState } from 'react';

export default function SEOAnalyticsChart({ data }) {
  const [metric, setMetric] = useState('clicks');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { points: [], max: 0, labels: [] };

    const values = data.map(d => d[metric] || 0);
    const max = Math.max(...values, 1);

    return {
      points: values,
      max,
      labels: data.map(d => formatDate(d.date))
    };
  }, [data, metric]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Create SVG path for the area chart
  const width = 100;
  const height = 40;
  const padding = 2;
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const points = chartData.points.map((value, index) => {
    const x = padding + (index / (chartData.points.length - 1)) * effectiveWidth;
    const y = padding + effectiveHeight - (value / chartData.max) * effectiveHeight;
    return { x, y, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  // Y-axis labels
  const yLabels = [
    { value: chartData.max, y: padding },
    { value: Math.round(chartData.max / 2), y: height / 2 },
    { value: 0, y: height - padding }
  ];

  return (
    <div>
      {/* Metric Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'clicks', label: 'Clicks' },
          { key: 'impressions', label: 'Impressions' },
          { key: 'ctr', label: 'CTR' },
          { key: 'position', label: 'Position' }
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`
              px-3 py-1 text-sm rounded transition-colors
              ${metric === m.key
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          {yLabels.map((l, i) => (
            <span key={i}>{formatValue(l.value, metric)}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="ml-12 h-full relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line
              x1={padding}
              y1={padding}
              x2={width - padding}
              y2={padding}
              stroke="#374151"
              strokeWidth="0.2"
            />
            <line
              x1={padding}
              y1={height / 2}
              x2={width - padding}
              y2={height / 2}
              stroke="#374151"
              strokeWidth="0.2"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#374151"
              strokeWidth="0.2"
            />

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Interactive overlay */}
          <div className="absolute inset-0 flex">
            {points.map((point, i) => (
              <div
                key={i}
                className="flex-1 group relative"
              >
                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    <div className="font-medium">{chartData.labels[i]}</div>
                    <div className="text-teal-400">{formatValue(point.value, metric)}</div>
                  </div>
                </div>

                {/* Hover line */}
                <div className="hidden group-hover:block absolute top-0 left-1/2 w-px h-full bg-gray-600" />

                {/* Point dot */}
                <div
                  className="hidden group-hover:block absolute w-2 h-2 bg-teal-400 rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${((height - padding - (point.value / chartData.max) * effectiveHeight) / height) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="ml-12 flex justify-between text-xs text-gray-500 mt-2">
          <span>{chartData.labels[0]}</span>
          <span>{chartData.labels[Math.floor(chartData.labels.length / 2)]}</span>
          <span>{chartData.labels[chartData.labels.length - 1]}</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatValue(value, metric) {
  if (metric === 'ctr') {
    return (value * 100).toFixed(1) + '%';
  }
  if (metric === 'position') {
    return value.toFixed(1);
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toLocaleString();
}
