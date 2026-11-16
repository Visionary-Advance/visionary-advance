'use client';

// Shared building blocks for the SEO dashboard. Colors come from the adm-* tokens in
// app/globals.css; status colors (good/warn/bad) always ship with an icon or text.

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight, ArrowUpRight, ArrowUp, ArrowDown, ArrowUpDown, ChevronRight, LoaderCircle, Minus, X,
  CircleCheck, TriangleAlert, Info,
} from 'lucide-react';

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-adm-bg';

export const inputClass = cx(
  'w-full rounded-lg border border-adm-border bg-adm-raised px-3 py-2 text-sm text-adm-text',
  'placeholder:text-adm-subtle hover:border-adm-border-strong focus:border-adm-accent focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

// ---------------------------------------------------------------------------
// Buttons

const buttonVariants = {
  primary: 'bg-adm-accent-solid text-white hover:bg-adm-accent-solid-hover border border-transparent',
  secondary: 'bg-adm-raised text-adm-text border border-adm-border hover:bg-adm-hover hover:border-adm-border-strong',
  ghost: 'text-adm-muted hover:text-adm-text hover:bg-adm-raised border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  'danger-ghost': 'text-adm-bad hover:bg-red-500/10 border border-transparent',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
};

export function Button({
  variant = 'secondary', size = 'md', icon: Icon, loading = false, href, external,
  className, children, disabled, ...props
}) {
  const classes = cx(
    'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
    'disabled:cursor-not-allowed disabled:opacity-50',
    focusRing, buttonVariants[variant], buttonSizes[size], className
  );
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const content = (
    <>
      {loading ? <LoaderCircle className={cx(iconSize, 'animate-spin')} aria-hidden /> : Icon && <Icon className={iconSize} aria-hidden />}
      {children}
    </>
  );
  if (href) {
    if (external) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>{content}</a>;
    }
    return <Link href={href} className={classes} {...props}>{content}</Link>;
  }
  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}

export function IconButton({ icon: Icon, label, className, size = 'md', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex items-center justify-center rounded-lg text-adm-muted hover:bg-adm-raised hover:text-adm-text transition-colors cursor-pointer',
        size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        focusRing, className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}

// Two-step destructive action: the first click arms it, the second confirms.
export function ConfirmButton({ onConfirm, children, confirmLabel = 'Click again to confirm', icon, size = 'md', className }) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <Button
      variant={armed ? 'danger' : 'danger-ghost'}
      size={size}
      icon={icon}
      loading={busy}
      className={className}
      onClick={async () => {
        if (!armed) return setArmed(true);
        setBusy(true);
        try { await onConfirm(); } finally { setBusy(false); setArmed(false); }
      }}
    >
      {armed ? confirmLabel : children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Layout

export function PageHeader({ breadcrumbs, title, description, meta, actions, className }) {
  return (
    <div className={cx('mb-6', className)}>
      {breadcrumbs?.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
          {description && <p className="mt-1 text-sm text-adm-muted">{description}</p>}
          {meta && <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-adm-muted">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-adm-subtle">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1 min-w-0">
              {item.href && !last ? (
                <Link href={item.href} className={cx('truncate rounded hover:text-adm-text transition-colors', focusRing)}>
                  {item.label}
                </Link>
              ) : (
                <span className={cx('truncate', last && 'text-adm-muted')} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Card({ className, children, as: As = 'div', ...props }) {
  return (
    <As className={cx('rounded-xl border border-adm-border bg-adm-surface', className)} {...props}>
      {children}
    </As>
  );
}

export function CardHeader({ title, description, actions, className, as: Heading = 'h2' }) {
  return (
    <div className={cx('flex flex-wrap items-start justify-between gap-3 border-b border-adm-border px-5 py-4', className)}>
      <div className="min-w-0">
        <Heading className="text-sm font-semibold text-adm-text">{title}</Heading>
        {description && <p className="mt-0.5 text-sm text-adm-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionLabel({ children, className }) {
  return <h3 className={cx('text-xs font-medium uppercase tracking-wider text-adm-subtle', className)}>{children}</h3>;
}

// ---------------------------------------------------------------------------
// Status & data

const badgeTones = {
  neutral: 'bg-adm-raised text-adm-muted border-adm-border',
  accent: 'bg-teal-500/10 text-adm-accent border-teal-500/25',
  good: 'bg-green-500/10 text-adm-good border-green-500/25',
  warn: 'bg-amber-500/10 text-adm-warn border-amber-500/25',
  bad: 'bg-red-500/10 text-adm-bad border-red-500/25',
  info: 'bg-blue-500/10 text-adm-info border-blue-500/25',
};

export function Badge({ tone = 'neutral', icon: Icon, children, className, title }) {
  return (
    <span
      title={title}
      className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs font-medium', badgeTones[tone], className)}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}

// Signed change with an arrow; `inverted` for metrics where lower is better (position).
export function Delta({ value, inverted = false, suffix = '%', precision = 1, className, label = 'vs previous period' }) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={cx('text-xs text-adm-subtle', className)}>—</span>;
  }
  const flat = Math.abs(value) < 0.05;
  const good = inverted ? value < 0 : value > 0;
  const Icon = flat ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  const color = flat ? 'text-adm-subtle' : good ? 'text-adm-good' : 'text-adm-bad';
  const text = `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(precision)}${suffix}`;
  return (
    <span className={cx('inline-flex items-center gap-0.5 text-xs font-medium tabular-nums', color, className)} title={label}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {flat ? `0${suffix}` : text}
      <span className="sr-only"> {label}</span>
    </span>
  );
}

export function Sparkline({ data, className, inverted = false }) {
  const values = (data || []).filter(v => typeof v === 'number' && !Number.isNaN(v));
  if (values.length < 2) return null;
  const w = 96, h = 28, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const norm = (v - min) / span;
    const y = pad + (inverted ? norm : 1 - norm) * (h - pad * 2);
    return [x, y];
  });
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={cx('overflow-visible', className)} aria-hidden>
      <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" className="fill-adm-accent" />
    </svg>
  );
}

export function StatTile({ label, value, delta, spark, sparkInverted, hint, loading, href }) {
  const body = (
    <>
      <p className="text-sm text-adm-muted">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight text-adm-text">{value}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-adm-subtle">
              {delta}
              {hint && <span className="truncate">{hint}</span>}
            </div>
          </div>
          {spark && <Sparkline data={spark} inverted={sparkInverted} className="text-adm-muted shrink-0" />}
        </div>
      )}
    </>
  );
  const classes = 'block rounded-xl border border-adm-border bg-adm-surface p-4';
  if (href) {
    return <Link href={href} className={cx(classes, 'hover:border-adm-border-strong transition-colors', focusRing)}>{body}</Link>;
  }
  return <div className={classes}>{body}</div>;
}

export function ProgressBar({ value, max = 100, className, label }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cx('h-1.5 w-full overflow-hidden rounded-full bg-adm-raised', className)}
    >
      <div className="h-full rounded-full bg-adm-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cx('animate-pulse rounded-md bg-adm-raised', className)} aria-hidden />;
}

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex">
      <LoaderCircle className={cx('h-5 w-5 animate-spin text-adm-accent', className)} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cx('flex flex-col items-center px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-adm-border bg-adm-raised">
          <Icon className="h-5 w-5 text-adm-muted" aria-hidden />
        </div>
      )}
      <h3 className="text-base font-semibold text-adm-text">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-adm-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Alert({ tone = 'info', title, children, action, className }) {
  const tones = {
    info: { cls: 'border-blue-500/25 bg-blue-500/5', icon: Info, iconCls: 'text-adm-info' },
    warn: { cls: 'border-amber-500/30 bg-amber-500/5', icon: TriangleAlert, iconCls: 'text-adm-warn' },
    bad: { cls: 'border-red-500/30 bg-red-500/5', icon: TriangleAlert, iconCls: 'text-adm-bad' },
    good: { cls: 'border-green-500/25 bg-green-500/5', icon: CircleCheck, iconCls: 'text-adm-good' },
  };
  const t = tones[tone];
  const Icon = t.icon;
  return (
    <div role={tone === 'bad' ? 'alert' : undefined} className={cx('flex gap-3 rounded-xl border p-4', t.cls, className)}>
      <Icon className={cx('mt-0.5 h-4 w-4 shrink-0', t.iconCls)} aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-medium text-adm-text">{title}</p>}
        {children && <div className={cx('text-adm-muted', title && 'mt-1')}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inputs

export function SegmentedControl({ options, value, onChange, label, size = 'md', className }) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('inline-flex rounded-lg border border-adm-border bg-adm-raised p-0.5', className)}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors cursor-pointer',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
              active ? 'bg-adm-hover text-adm-text shadow-sm' : 'text-adm-muted hover:text-adm-text',
              focusRing
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className={cx('tabular-nums text-xs', active ? 'text-adm-muted' : 'text-adm-subtle')}>{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, htmlFor, hint, error, children, className }) {
  return (
    <div className={className}>
      {label && <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-adm-text">{label}</label>}
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-adm-subtle">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-adm-bad" role="alert">{error}</p>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className, icon: Icon }) {
  return (
    <div className={cx('relative', className)}>
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adm-subtle" aria-hidden />}
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cx(inputClass, Icon && 'pl-9')}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tables

export function Table({ children, className }) {
  return (
    <div className={cx('overflow-x-auto', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, align = 'left', sort, onSort, className }) {
  const alignCls = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  const ariaSort = sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : onSort ? 'none' : undefined;
  const SortIcon = sort === 'asc' ? ArrowUp : sort === 'desc' ? ArrowDown : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cx('whitespace-nowrap border-b border-adm-border px-4 py-2.5 text-xs font-medium text-adm-subtle', alignCls, className)}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className={cx('inline-flex items-center gap-1 rounded hover:text-adm-text cursor-pointer', sort && 'text-adm-muted', focusRing)}
        >
          {children}
          <SortIcon className={cx('h-3 w-3', !sort && 'opacity-50')} aria-hidden />
        </button>
      ) : children}
    </th>
  );
}

export function Td({ children, align = 'left', className, numeric, ...props }) {
  const alignCls = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td className={cx('px-4 py-3 align-middle', alignCls, numeric && 'tabular-nums', className)} {...props}>
      {children}
    </td>
  );
}

// Click-to-sort helper: returns [sorted rows, header props factory].
export function useSort(rows, initial = { key: null, dir: 'desc' }, accessors = {}) {
  const [sort, setSort] = useState(initial);
  const get = (row, key) => (accessors[key] ? accessors[key](row) : row[key]);
  const sorted = sort.key
    ? [...rows].sort((a, b) => {
        const av = get(a, sort.key), bv = get(b, sort.key);
        if (av === bv) return 0;
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : rows;
  const thProps = (key, defaultDir = 'desc') => ({
    sort: sort.key === key ? sort.dir : undefined,
    onSort: () => setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: defaultDir })),
  });
  return [sorted, thProps];
}

// ---------------------------------------------------------------------------
// Overlays

function useOverlay(onClose) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // Runs once per open: a parent re-render must not steal focus back to the first field.
  useEffect(() => {
    const prevFocus = document.activeElement;
    const onKey = e => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus inside so keyboard and screen reader users land in the dialog.
    const first = panelRef.current?.querySelector('[data-autofocus], input, select, textarea, button');
    (first || panelRef.current)?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);
  return panelRef;
}

export function Modal({ title, description, onClose, children, footer, size = 'md' }) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('relative flex max-h-[90dvh] w-full flex-col rounded-t-2xl border border-adm-border bg-adm-surface shadow-2xl sm:rounded-2xl', widths[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-adm-border px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-adm-text">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-adm-muted">{description}</p>}
          </div>
          <IconButton icon={X} label="Close" size="sm" onClick={onClose} className="-mr-1.5 -mt-1" />
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-adm-border px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ onClose, title, header, children, footer, label }) {
  const panelRef = useOverlay(onClose);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof title === 'string' ? title : 'Details')}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-adm-border bg-adm-surface shadow-2xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-adm-border px-5 py-4">
          <div className="min-w-0 flex-1">{header || <h2 className="text-base font-semibold text-adm-text">{title}</h2>}</div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2 -mt-1" data-autofocus />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-adm-border px-5 py-3">{footer}</div>}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toasts (replace window.alert)

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, tone = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), tone === 'error' ? 7000 : 4000);
  }, []);
  const icons = { success: CircleCheck, error: TriangleAlert, info: Info };
  const colors = { success: 'text-adm-good', error: 'text-adm-bad', info: 'text-adm-info' };
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map(t => {
          const Icon = icons[t.tone] || Info;
          return (
            <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-adm-border bg-adm-raised px-4 py-3 text-sm text-adm-text shadow-xl">
              <Icon className={cx('mt-0.5 h-4 w-4 shrink-0', colors[t.tone])} aria-hidden />
              <p className="min-w-0 flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}
                className={cx('rounded text-adm-subtle hover:text-adm-text cursor-pointer', focusRing)}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
