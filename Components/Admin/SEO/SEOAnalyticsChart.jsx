'use client';

// Daily Search Console trend, one metric at a time (never two y-scales). Position is
// drawn inverted so "up" always means better. Hover / arrow keys show exact values,
// and a table view carries the same numbers for screen readers.

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChartLine, Table2 } from 'lucide-react';
import { SegmentedControl, IconButton, EmptyState, Table, Th, Td, cx, focusRing } from './ui';
import { fmtCompact, fmtInt, fmtPct, fmtPos, fmtDate } from './format';

const METRICS = [
  { value: 'clicks', label: 'Clicks', fmt: fmtCompact, full: fmtInt },
  { value: 'impressions', label: 'Impressions', fmt: fmtCompact, full: fmtInt },
  { value: 'ctr', label: 'CTR', fmt: v => fmtPct(v, 1), full: v => fmtPct(v, 2) },
  { value: 'position', label: 'Avg. position', fmt: fmtPos, full: fmtPos, inverted: true },
];

const H = 260;
const PAD = { top: 12, right: 12, bottom: 28, left: 48 };

export default function SEOAnalyticsChart({ data }) {
  const [metricKey, setMetricKey] = useState('clicks');
  const [view, setView] = useState('chart');
  const metric = METRICS.find(m => m.value === metricKey);

  const rows = useMemo(
    () => (data || []).map(d => ({ date: d.date, value: Number(d[metricKey]) || 0 })),
    [data, metricKey]
  );

  if (!data || data.length === 0) {
    return <EmptyState icon={ChartLine} title="No daily data yet" description="Sync Search Console to see the trend." />;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl options={METRICS} value={metricKey} onChange={setMetricKey} label="Metric" size="sm" />
        <IconButton
          icon={view === 'chart' ? Table2 : ChartLine}
          label={view === 'chart' ? 'Show as table' : 'Show as chart'}
          size="sm"
          onClick={() => setView(v => (v === 'chart' ? 'table' : 'chart'))}
        />
      </div>
      {view === 'chart' ? (
        <LineChart rows={rows} metric={metric} />
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-adm-border">
          <Table>
            <thead className="sticky top-0 bg-adm-surface">
              <tr><Th>Date</Th><Th align="right">{metric.label}</Th></tr>
            </thead>
            <tbody>
              {[...rows].reverse().map(r => (
                <tr key={r.date} className="border-t border-adm-border">
                  <Td className="text-adm-muted">{fmtDate(r.date)}</Td>
                  <Td align="right" numeric className="text-adm-text">{metric.full(r.value)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

function LineChart({ rows, metric }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const values = rows.map(r => r.value);
  const { lo, hi, ticks } = useMemo(() => scaleFor(values, metric), [values.join(','), metric.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = H - PAD.top - PAD.bottom;
  const x = i => PAD.left + (rows.length > 1 ? (i / (rows.length - 1)) * plotW : plotW / 2);
  const y = v => {
    const t = hi === lo ? 0.5 : (v - lo) / (hi - lo);
    return PAD.top + (metric.inverted ? t : 1 - t) * plotH;
  };

  const line = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r.value).toFixed(1)}`).join(' ');
  const baseY = metric.inverted ? PAD.top + plotH : y(lo);
  const area = rows.length > 1 ? `${line} L${x(rows.length - 1).toFixed(1)},${baseY} L${x(0).toFixed(1)},${baseY} Z` : '';

  const labelIdx = xLabelIndexes(rows.length, width < 480 ? 3 : 6);
  const h = hover !== null ? rows[hover] : null;

  function indexFromEvent(e) {
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - rect.left - PAD.left;
    return Math.max(0, Math.min(rows.length - 1, Math.round((px / plotW) * (rows.length - 1))));
  }

  const latest = rows[rows.length - 1];
  const summary = `${metric.label} over ${rows.length} days, latest ${metric.full(latest.value)} on ${fmtDate(latest.date)}. Use the arrow keys to step through days.`;

  return (
    <div
      ref={ref}
      className={cx('relative select-none rounded-lg outline-none', focusRing)}
      style={{ height: H }}
      tabIndex={0}
      role="img"
      aria-label={summary}
      onPointerMove={e => width && setHover(indexFromEvent(e))}
      onPointerLeave={() => setHover(null)}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') setHover(i => Math.min(rows.length - 1, (i ?? -1) + 1));
        else if (e.key === 'ArrowLeft') setHover(i => Math.max(0, (i ?? rows.length) - 1));
        else if (e.key === 'Escape') setHover(null);
        else return;
        e.preventDefault();
      }}
      onBlur={() => setHover(null)}
    >
      {width > 0 && (
        <svg width={width} height={H} className="absolute inset-0" aria-hidden>
          {ticks.map(t => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="stroke-adm-border" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-adm-subtle text-[11px] tabular-nums">
                {metric.fmt(t)}
              </text>
            </g>
          ))}
          {labelIdx.map(i => (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle'} className="fill-adm-subtle text-[11px]">
              {fmtDate(rows[i].date, { month: 'short', day: 'numeric' })}
            </text>
          ))}
          {area && <path d={area} className="fill-adm-accent" fillOpacity="0.08" />}
          <path d={line} fill="none" className="stroke-adm-accent" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {h && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} className="stroke-adm-border-strong" strokeWidth="1" />
              <circle cx={x(hover)} cy={y(h.value)} r="4.5" className="fill-adm-accent stroke-adm-surface" strokeWidth="2" />
            </>
          )}
        </svg>
      )}
      {h && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-adm-border bg-adm-raised px-3 py-2 text-xs shadow-xl"
          style={{
            top: Math.max(0, y(h.value) - 64),
            left: Math.min(Math.max(x(hover) - 70, 0), width - 140),
            width: 140,
          }}
        >
          <p className="text-adm-muted">{fmtDate(h.date, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="mt-0.5 text-sm font-semibold text-adm-text tabular-nums">{metric.full(h.value)} <span className="font-normal text-adm-muted">{metric.label.toLowerCase()}</span></p>
        </div>
      )}
    </div>
  );
}

// Round, evenly spaced ticks. Counts start at 0; position hugs its range.
function scaleFor(values, metric) {
  let min = Math.min(...values), max = Math.max(...values);
  if (metric.inverted) {
    min = Math.max(1, Math.floor(min));
    max = Math.ceil(max);
    if (max === min) max = min + 1;
  } else {
    min = 0;
    if (max <= 0) max = metric.value === 'ctr' ? 0.01 : 1;
  }
  const step = niceStep((max - min) / 4);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + step / 2; t += step) ticks.push(Number(t.toFixed(6)));
  return { lo: metric.inverted ? Math.max(lo, metric.inverted ? 1 : 0) : lo, hi, ticks: metric.inverted ? ticks.filter(t => t >= 1) : ticks };
}

function niceStep(raw) {
  if (raw <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

function xLabelIndexes(n, count) {
  if (n <= 1) return [0];
  const out = new Set();
  for (let k = 0; k < count; k++) out.add(Math.round((k / (count - 1)) * (n - 1)));
  return [...out];
}
