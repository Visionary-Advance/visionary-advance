// app/admin/finance/income/page.js — Income ledger
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowDownLeft, ChevronRight, ExternalLink, Pencil, Plus, Repeat, Search, Trash2, Upload } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import { invalidate, useCachedFetch } from '@/lib/useCachedFetch'
import { PAYMENT_METHODS } from '@/lib/finance'
import {
  Badge, Button, Card, ConfirmButton, Drawer, EmptyState, PageHeader, SearchInput, Skeleton, StatTile,
  Table, Td, Th, cx, focusRing, useSort, useToast,
} from '@/Components/Admin/ui'
import { DetailRow, MONTHS, SelectInput, YearSelect, fmtMoney } from '@/Components/Admin/Finance/parts'
import IncomeForm from '@/Components/Admin/Finance/IncomeForm'
import CSVImportModal from '@/Components/Admin/Finance/CSVImportModal'
import Fab from '@/Components/Admin/Mobile/Fab'

const dateOf = (d) => new Date(d + 'T00:00:00')
const methodLabel = (m) => PAYMENT_METHODS[m]?.label || m

export default function IncomePage() {
  const notify = useToast()
  const [year, setYear] = usePersistedState('year', new Date().getFullYear())
  const [month, setMonth] = usePersistedState('month', '')
  const [search, setSearch] = usePersistedState('search', '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  // The page number belongs to one set of filters; changing a filter starts at page 1
  const filterKey = `${year}|${month}|${debouncedSearch}`
  const [pageState, setPageState] = useState({ key: filterKey, n: 1 })
  const page = pageState.key === filterKey ? pageState.n : 1
  const setPage = (n) => setPageState({ key: filterKey, n })

  const params = new URLSearchParams({ year: String(year), page: String(page), limit: '20' })
  if (month) params.set('month', month)
  if (debouncedSearch) params.set('search', debouncedSearch)
  const list = useCachedFetch(`/api/finance/income?${params}`, {
    keepPrevious: true,
    onError: () => notify('Could not load income', 'error'),
  })
  const { data: stats } = useCachedFetch(`/api/finance/stats?year=${year}`)

  const entries = list.data?.entries || []
  const pagination = list.data?.pagination || { page: 1, totalPages: 1, total: 0 }
  const loading = list.loading
  const yearTotal = stats ? stats.overview?.ytdIncome ?? 0 : null
  const refresh = () => invalidate('/api/finance/')

  const handleDelete = async (entry) => {
    const res = await fetch(`/api/finance/income/${entry.id}`, { method: 'DELETE' })
    if (!res.ok) return notify("Couldn't delete that entry", 'error')
    notify(`Deleted ${fmtMoney(entry.amount, { cents: true })} from ${entry.client_name}`, 'success')
    setSelected(null)
    refresh()
  }

  const openForm = (entry = null) => {
    setSelected(null)
    setEditEntry(entry)
    setShowForm(true)
  }

  const [sorted, thProps] = useSort(entries, { key: 'date_paid', dir: 'desc' }, {
    amount: (e) => parseFloat(e.amount),
    client_name: (e) => (e.client_name || '').toLowerCase(),
  })
  const pageTotal = entries.reduce((s, e) => s + parseFloat(e.amount || 0), 0)
  const filtered = Boolean(month || search)

  return (
    <div>
      <PageHeader
        title="Income"
        description="Payments received from clients"
        actions={
          <>
            <Button icon={Upload} onClick={() => setShowImport(true)}>Import CSV</Button>
            <Button variant="primary" icon={Plus} onClick={() => openForm()} className="hidden md:inline-flex">Add income</Button>
          </>
        }
      />

      <section aria-label="Totals" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatTile label={`${year} income`} value={fmtMoney(yearTotal)} loading={yearTotal === null} hint="year to date" />
        <StatTile label="Payments" value={pagination.total} loading={loading} hint={filtered ? 'matching filters' : `in ${year}`} />
        <div className="col-span-2 lg:col-span-1">
          <StatTile label="This page" value={fmtMoney(pageTotal)} loading={loading} hint={`${entries.length} shown`} />
        </div>
      </section>

      <Card>
        <div className="flex flex-col gap-2 border-b border-adm-border p-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" icon={Search} className="sm:max-w-xs sm:flex-1 [&_input]:h-10" />
          <div className="flex gap-2">
            <YearSelect value={year} onChange={setYear} className="flex-1 sm:flex-none" />
            <SelectInput value={month} onChange={setMonth} label="Month" className="flex-1 sm:flex-none">
              <option value="">All months</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </SelectInput>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-11 w-full" />)}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={ArrowDownLeft}
            title={filtered ? 'No matching payments' : `No income in ${year} yet`}
            description={filtered ? 'Try a different month or search.' : 'Record a payment or import a CSV from your bank.'}
            action={!filtered && <Button variant="primary" icon={Plus} onClick={() => openForm()}>Add income</Button>}
          />
        ) : (
          <>
            {/* Phones: tappable rows */}
            <ul className="divide-y divide-adm-border md:hidden">
              {sorted.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(entry)}
                    className="flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left active:bg-adm-raised"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-[15px] font-medium text-adm-text">
                        <span className="truncate">{entry.client_name}</span>
                        {entry.type === 'recurring' && <Repeat className="h-3.5 w-3.5 shrink-0 text-adm-info" aria-label="Recurring" />}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-adm-subtle">
                        {format(dateOf(entry.date_paid), 'MMM d')} · {methodLabel(entry.payment_method)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[15px] font-semibold tabular-nums text-adm-text">
                      +{fmtMoney(entry.amount, { cents: true })}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            {/* Desktop: sortable table */}
            <Table className="hidden md:block">
              <thead>
                <tr>
                  <Th {...thProps('client_name', 'asc')}>Client</Th>
                  <Th {...thProps('date_paid')}>Date</Th>
                  <Th>Method</Th>
                  <Th>Type</Th>
                  <Th align="right" {...thProps('amount')}>Amount</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {sorted.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className="cursor-pointer transition-colors hover:bg-adm-raised"
                  >
                    <Td>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelected(entry) }}
                        className={cx('cursor-pointer rounded text-left font-medium text-adm-text hover:text-adm-accent', focusRing)}
                      >
                        {entry.client_name}
                      </button>
                    </Td>
                    <Td className="text-adm-muted">{format(dateOf(entry.date_paid), 'MMM d, yyyy')}</Td>
                    <Td className="text-adm-muted">{methodLabel(entry.payment_method)}</Td>
                    <Td>
                      {entry.type === 'recurring'
                        ? <Badge tone="info" icon={Repeat}>Recurring</Badge>
                        : <Badge>One-time</Badge>}
                    </Td>
                    <Td align="right" numeric className="font-medium text-adm-text">{fmtMoney(entry.amount, { cents: true })}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-adm-border px-4 py-3 sm:px-5">
                <p className="text-xs text-adm-subtle">Page {pagination.page} of {pagination.totalPages}</p>
                <div className="flex gap-2">
                  <Button size="sm" disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)}>Previous</Button>
                  <Button size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(pagination.page + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {selected && (
        <Drawer
          onClose={() => setSelected(null)}
          label={`Payment from ${selected.client_name}`}
          header={
            <div>
              <p className="text-sm text-adm-muted">{selected.client_name}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-adm-text">{fmtMoney(selected.amount, { cents: true })}</p>
            </div>
          }
          footer={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" icon={ExternalLink} href={`/admin/finance/income/${selected.id}`}>Full details</Button>
              <Button icon={Pencil} onClick={() => openForm(selected)}>Edit</Button>
              <ConfirmButton icon={Trash2} confirmLabel="Tap again to delete" onConfirm={() => handleDelete(selected)} className="ml-auto">
                Delete
              </ConfirmButton>
            </div>
          }
        >
          <dl className="divide-y divide-adm-border text-sm">
            <DetailRow label="Date paid">{format(dateOf(selected.date_paid), 'EEEE, MMMM d, yyyy')}</DetailRow>
            <DetailRow label="Method">{methodLabel(selected.payment_method)}</DetailRow>
            <DetailRow label="Type">{selected.type === 'recurring' ? 'Recurring' : 'One-time'}</DetailRow>
            <DetailRow label="Client">
              {selected.client_id
                ? <Link href={`/admin/crm/clients/${selected.client_id}`} className="text-adm-accent hover:underline">Open in CRM</Link>
                : <span className="text-adm-subtle">Not linked to a CRM client</span>}
            </DetailRow>
          </dl>
          {selected.notes && (
            <div className="mt-5 rounded-lg border border-adm-border bg-adm-raised p-3">
              <p className="mb-1 text-xs font-medium text-adm-subtle">Notes</p>
              <p className="whitespace-pre-wrap text-sm text-adm-muted">{selected.notes}</p>
            </div>
          )}
        </Drawer>
      )}

      <Fab onClick={() => openForm()} label="Add income" />

      <IncomeForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditEntry(null) }}
        onSave={refresh}
        entry={editEntry}
      />
      <CSVImportModal isOpen={showImport} onClose={() => setShowImport(false)} onComplete={refresh} type="income" />
    </div>
  )
}

